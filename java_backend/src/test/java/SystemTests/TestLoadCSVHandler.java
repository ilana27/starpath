//package SystemTests;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//import com.squareup.moshi.JsonAdapter;
//import com.squareup.moshi.Moshi;
//import com.squareup.moshi.Types;
//import edu.brown.cs.student.main.CSVParser.*;
//import edu.brown.cs.student.main.Server.LoadCSVHandler;
//import java.io.FileNotFoundException;
//import java.io.FileReader;
//import java.io.IOException;
//import java.lang.reflect.Type;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.util.List;
//import java.util.Map;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import okio.Buffer;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import spark.Spark;
//
//public class TestLoadCSVHandler {
//
//  /**
//   * Integration tests: send real web requests to our server as it is running. Note that for these,
//   * we prefer to avoid sending many real API requests to the NWS, and use "mocking" to avoid it.
//   * (There are many other reasons to use mock data here. What are they?)
//   *
//   * <p>In short, there are two new techniques demonstrated here: integration testing; and testing
//   * with mock data / mock objects.
//   */
//  @BeforeAll
//  public static void setupOnce() {
//    // Pick an arbitrary free port
//    Spark.port(0);
//    // Eliminate logger spam in console for test suite
//    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root
//  }
//
//  // Helping Moshi serialize Json responses; see the gearup for more info.
//  private final Type mapStringObject =
//      Types.newParameterizedType(Map.class, String.class, Object.class);
//  private List mockedCSV;
//
//  private JsonAdapter<Map<String, Object>> adapter;
//  //  private JsonAdapter<WeatherData> weatherDataAdapter;
//
//  @BeforeEach
//  public void setup() throws FileNotFoundException {
//    // Re-initialize parser, state, etc. for every test method
//
//    /*
//     * mocked CSV data
//     */
//    FileReader fReader = new FileReader("data/stars/ten-star.csv");
//    edu.brown.cs.student.main.CSVParser.rowtype.StringList stringList =
//        new edu.brown.cs.student.main.CSVParser.rowtype.StringList();
//    Parse<List<String>> parser = new Parse<>(fReader, stringList, true);
//    this.mockedCSV = parser.getDataRows();
//
//    // calling the handler
//    Spark.get("loadCSV", new LoadCSVHandler<>()); // TODO: add dependency injection?
//    Spark.awaitInitialization(); // don't continue until the server is listening
//
//    // New Moshi adapter for responses (and requests, too; see a few lines below)
//    //   For more on this, see the Server gearup.
//    Moshi moshi = new Moshi.Builder().build();
//    adapter = moshi.adapter(mapStringObject);
//    //    weatherDataAdapter = moshi.adapter(WeatherData.class);
//  }
//
//  @AfterEach
//  public void tearDown() {
//    // Gracefully stop Spark listening on both endpoints
//    Spark.unmap("loadCSV");
//    Spark.awaitStop(); // don't proceed until the server is stopped
//  }
//
//  /*
//  Recall that the "throws" clause doesn't matter -- JUnit will fail if an
//  exception is thrown that hasn't been declared as a parameter to @Test.
//   */
//
//  /**
//   * Helper to start a connection to a specific API endpoint/params
//   *
//   * @param apiCall the call string, including endpoint (Note: this would be better if it had more
//   *     structure!)
//   * @return the connection for the given URL, just after connecting
//   * @throws IOException if the connection fails for some reason
//   */
//  private HttpURLConnection tryRequest(String apiCall) throws IOException {
//    // Configure the connection (but don't actually send a request yet)
//    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
//    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
//    // The request body contains a Json object
//    clientConnection.setRequestProperty("Content-Type", "application/json");
//    // We're expecting a Json object in the response body
//    clientConnection.setRequestProperty("Accept", "application/json");
//
//    clientConnection.connect();
//    return clientConnection;
//  }
//
//  //  final Geolocation providence = new Geolocation(41.8240, -71.4128);
//
//  @Test
//  public void testLoadCSVSuccess() throws IOException {
//    /////////// LOAD DATASOURCE ///////////
//    // Set up the request, make the request
//    HttpURLConnection loadConnection =
//        tryRequest("loadCSV?filepath=data/stars/ten-star.csv&hasHeader=true");
//    // Get an OK response (the *connection* worked, the *API* provides an error response)
//    assertEquals(200, loadConnection.getResponseCode());
//    // Get the expected response: a success
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
//    showDetailsIfError(body);
//    assertEquals("success", body.get("response_type"));
//
//    loadConnection.disconnect();
//  }
//
//  private void showDetailsIfError(Map<String, Object> body) {
//    if (body.containsKey("result") && "error".equals(body.get("result"))) {
//      System.out.println(body);
//    }
//  }
//}
