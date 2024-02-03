package HandlerTests;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.Server.handlers.JournalGetNextHandler;
import edu.brown.cs.student.main.Server.handlers.JournalGetPrevHandler;
import edu.brown.cs.student.main.Server.handlers.JournalUpdateEntryHandler;
import edu.brown.cs.student.main.Server.journal.DatasourceException;
import edu.brown.cs.student.main.Server.journal.JournalDataSource;
import edu.brown.cs.student.main.Server.journal.JournalHistory;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class PrevNextAndUpdateTests {
  
  @BeforeAll
  public static void setupOnce() {
    // Pick an arbitrary free port
    Spark.port(0);
    // Eliminate logger spam in console for test suite
    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root
  }

  // Helping Moshi serialize Json responses; see the gearup for more info.
  private final Type mapStringObject =
      Types.newParameterizedType(Map.class, String.class, Object.class);
  private List mockedCSV;

  private JsonAdapter<Map<String, Object>> adapter;
  //  private JsonAdapter<WeatherData> weatherDataAdapter;

  @BeforeEach
  public void setup() throws DatasourceException {
    // In fact, restart the entire Spark server for every test!
    JournalDataSource journalHistory = new JournalHistory();
    Spark.get("/updateEntry", new JournalUpdateEntryHandler(journalHistory));
    Spark.get("/getprev", new JournalGetPrevHandler(journalHistory));
    Spark.get("/getnext", new JournalGetNextHandler(journalHistory));
    Spark.init();
    Spark.awaitInitialization(); // don't continue until the server is listening

    Moshi moshi = new Moshi.Builder().build();
    adapter = moshi.adapter(mapStringObject);
  }

  @AfterEach
  public void tearDown() {
    // Gracefully stop Spark listening on both endpoints
    Spark.unmap("updateEntry");
    Spark.unmap("getprev");
    Spark.unmap("getnext");
    Spark.awaitStop(); // don't proceed until the server is stopped
  }

  /*
  Recall that the "throws" clause doesn't matter -- JUnit will fail if an
  exception is thrown that hasn't been declared as a parameter to @Test.
   */

  /**
   * Helper to start a connection to a specific API endpoint/params
   *
   * @param apiCall the call string, including endpoint (Note: this would be better if it had more
   *     structure!)
   * @return the connection for the given URL, just after connecting
   * @throws IOException if the connection fails for some reason
   */
  private HttpURLConnection tryRequest(String apiCall) throws IOException {
    // Configure the connection (but don't actually send a request yet)
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    // The request body contains a Json object
    clientConnection.setRequestProperty("Content-Type", "application/json");
    // We're expecting a Json object in the response body
    clientConnection.setRequestProperty("Accept", "application/json");

    clientConnection.connect();
    return clientConnection;
  }

  /**
   * tests that update entry returns success
   * @throws IOException
   */
  @Test
  public void testUpdateEntrySuccess() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    // Set up the request, make the request
    HttpURLConnection loadConnection =
        tryRequest("updateEntry?entry=testentry&prompt=testprompt&date=testdate");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt", body.get("new_prompt"));
    assertEquals("testentry", body.get("new_entry"));
    assertEquals("testdate", body.get("new_date"));

    loadConnection.disconnect();
  }

  /**
   * tests that update entry returns success and returns a new empty entry
   * @throws IOException
   */
  @Test
  public void testGetNextSuccess() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    // Set up the request, make the request
    HttpURLConnection loadConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    loadConnection.disconnect();
  }

  /**
   * tests that get previous returns success when a preivous one exists
   * (first update the current, get next, then get previous to return the original updated entry)
   * @throws IOException
   */
  @Test
  public void testGetPrevSuccess() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    HttpURLConnection updateConnection =
        tryRequest("updateEntry?entry=testentry&prompt=testprompt&date=testdate");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt", body.get("new_prompt"));
    assertEquals("testentry", body.get("new_entry"));
    assertEquals("testdate", body.get("new_date"));

    updateConnection.disconnect();
    // Set up the request, make the request
    HttpURLConnection nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    HttpURLConnection prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry", body.get("journal_entry"));
    assertEquals("testdate", body.get("journal_date"));
    assertEquals("testprompt", body.get("journal_prompt"));
    prevConnection.disconnect();

  }

  /**
   * tests that get prev throws a failure if called before making any new entries
   * @throws IOException
   */
  @Test
  public void testGetPrevFailure() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    // Set up the request, make the request
    HttpURLConnection loadConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("error", body.get("result"));
    assertEquals("Previous entry does not exist", body.get("error_msg"));
    loadConnection.disconnect();
  }

  /**
   * Integration test: update, getnext, update, getnext, update, getnext, getprev, getprev, getprev
   * @throws IOException
   */
  @Test
  public void testIntegrationSuccess() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    HttpURLConnection updateConnection =
        tryRequest("updateEntry?entry=testentry1&prompt=testprompt1&date=testdate1");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt1", body.get("new_prompt"));
    assertEquals("testentry1", body.get("new_entry"));
    assertEquals("testdate1", body.get("new_date"));

    updateConnection.disconnect();
    // Set up the request, make the request
    HttpURLConnection nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    updateConnection =
        tryRequest("updateEntry?entry=testentry2&prompt=testprompt2&date=testdate2");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt2", body.get("new_prompt"));
    assertEquals("testentry2", body.get("new_entry"));
    assertEquals("testdate2", body.get("new_date"));

    updateConnection.disconnect();

    nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    updateConnection =
        tryRequest("updateEntry?entry=testentry3&prompt=testprompt3&date=testdate3");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt3", body.get("new_prompt"));
    assertEquals("testentry3", body.get("new_entry"));
    assertEquals("testdate3", body.get("new_date"));

    updateConnection.disconnect();

    nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    HttpURLConnection prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry3", body.get("journal_entry"));
//    assertEquals("testdate3", body.get("journal_date"));
//    assertEquals("testprompt3", body.get("journal_prompt"));
    prevConnection.disconnect();

    prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry2", body.get("journal_entry"));
//    assertEquals("testdate2", body.get("journal_date"));
//    assertEquals("testprompt2", body.get("journal_prompt"));
    prevConnection.disconnect();

    prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry1", body.get("journal_entry"));
//    assertEquals("testdate1", body.get("journal_date"));
//    assertEquals("testprompt1", body.get("journal_prompt"));
    prevConnection.disconnect();

  }

  /**
   * Integration test: update, getnext, update, getnext, update, getnext, getprev, getprev, getprev,
   * get prev
   * @throws IOException
   */
  @Test
  public void testIntegrationFailure() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    HttpURLConnection updateConnection =
        tryRequest("updateEntry?entry=testentry1&prompt=testprompt1&date=testdate1");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt1", body.get("new_prompt"));
    assertEquals("testentry1", body.get("new_entry"));
    assertEquals("testdate1", body.get("new_date"));

    updateConnection.disconnect();
    // Set up the request, make the request
    HttpURLConnection nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    updateConnection =
        tryRequest("updateEntry?entry=testentry2&prompt=testprompt2&date=testdate2");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt2", body.get("new_prompt"));
    assertEquals("testentry2", body.get("new_entry"));
    assertEquals("testdate2", body.get("new_date"));

    updateConnection.disconnect();

    nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    updateConnection =
        tryRequest("updateEntry?entry=testentry3&prompt=testprompt3&date=testdate3");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt3", body.get("new_prompt"));
    assertEquals("testentry3", body.get("new_entry"));
    assertEquals("testdate3", body.get("new_date"));

    updateConnection.disconnect();

    nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    HttpURLConnection prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry3", body.get("journal_entry"));
//    assertEquals("testdate3", body.get("journal_date"));
//    assertEquals("testprompt3", body.get("journal_prompt"));
    prevConnection.disconnect();

    prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry2", body.get("journal_entry"));
//    assertEquals("testdate2", body.get("journal_date"));
//    assertEquals("testprompt2", body.get("journal_prompt"));
    prevConnection.disconnect();

    prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry1", body.get("journal_entry"));
//    assertEquals("testdate1", body.get("journal_date"));
//    assertEquals("testprompt1", body.get("journal_prompt"));
    prevConnection.disconnect();


    prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("error", body.get("result"));
    assertEquals("Previous entry does not exist", body.get("error_msg"));
    prevConnection.disconnect();


  }

  /**
   * Integration test: update, getnext, update, getnext, get prev, update, get prev, get next
   * @throws IOException
   */
  @Test
  public void testIntegrationWithChangesSuccess() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    HttpURLConnection updateConnection =
        tryRequest("updateEntry?entry=testentry1&prompt=testprompt1&date=testdate1");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt1", body.get("new_prompt"));
    assertEquals("testentry1", body.get("new_entry"));
    assertEquals("testdate1", body.get("new_date"));

    updateConnection.disconnect();
    // Set up the request, make the request
    HttpURLConnection nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();

    updateConnection =
        tryRequest("updateEntry?entry=testentry2&prompt=testprompt2&date=testdate2");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, updateConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(updateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testprompt2", body.get("new_prompt"));
    assertEquals("testentry2", body.get("new_entry"));
    assertEquals("testdate2", body.get("new_date"));

    updateConnection.disconnect();

    nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("", body.get("journal_entry"));
    nextConnection.disconnect();


    HttpURLConnection prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry2", body.get("journal_entry"));
//    assertEquals("testdate3", body.get("journal_date"));
//    assertEquals("testprompt3", body.get("journal_prompt"));
    prevConnection.disconnect();

    HttpURLConnection newUpdateConnection =
        tryRequest("updateEntry?entry=updated test entry");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, newUpdateConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(newUpdateConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("updated test entry", body.get("new_entry"));

    newUpdateConnection.disconnect();

    prevConnection =
        tryRequest("getprev");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, prevConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(prevConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("testentry1", body.get("journal_entry"));
//    assertEquals("testdate2", body.get("journal_date"));
//    assertEquals("testprompt2", body.get("journal_prompt"));
    prevConnection.disconnect();

    nextConnection =
        tryRequest("getnext");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, nextConnection.getResponseCode());
    // Get the expected response: a success
    body =
        adapter.fromJson(new Buffer().readFrom(nextConnection.getInputStream()));
    showDetailsIfError(body);
    assertEquals("success", body.get("result"));
    assertEquals("updated test entry", body.get("journal_entry"));
    nextConnection.disconnect();

  }

  private void showDetailsIfError(Map<String, Object> body) {
    if (body.containsKey("result") && "error".equals(body.get("result"))) {
      System.out.println(body);
    }
  }
}
