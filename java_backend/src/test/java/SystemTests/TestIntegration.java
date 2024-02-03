//package SystemTests;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//import com.squareup.moshi.JsonAdapter;
//import com.squareup.moshi.Moshi;
//import com.squareup.moshi.Types;
//import edu.brown.cs.student.main.Census.ACSAPIDataSource;
//import edu.brown.cs.student.main.Census.DatasourceException;
//import edu.brown.cs.student.main.Server.BroadbandHandler;
//import edu.brown.cs.student.main.Server.LoadCSVHandler;
//import edu.brown.cs.student.main.Server.SearchCSVHandler;
//import edu.brown.cs.student.main.Server.ViewCSVHandler;
//import java.io.IOException;
//import java.lang.reflect.Type;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.util.*;
//import java.util.Map;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import okio.Buffer;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.testng.Assert;
//import spark.Spark;
//
//public class TestIntegration {
//
//  @BeforeAll
//  public static void setupOnce() {
//    // Pick an arbitrary free port
//    //    Spark.port(0);
//    //    // Eliminate logger spam in console for test suite
//    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root
//  }
//
//  private final Type mapStringObject =
//      Types.newParameterizedType(Map.class, String.class, Object.class);
//  private JsonAdapter<Map<String, Object>> adapter;
//
//  @BeforeEach
//  public void setup() throws DatasourceException {
//    // In fact, restart the entire Spark server for every test!
//    Spark.get("/loadCSV", new LoadCSVHandler());
//    Spark.get("/viewCSV", new ViewCSVHandler());
//    Spark.get("/searchCSV", new SearchCSVHandler());
//    ACSAPIDataSource censusDataSource = new ACSAPIDataSource();
//    Spark.get("/broadband", new BroadbandHandler(censusDataSource));
//    Spark.init();
//    Spark.awaitInitialization(); // don't continue until the server is listening
//
//    Moshi moshi = new Moshi.Builder().build();
//    adapter = moshi.adapter(mapStringObject);
//  }
//
//  @AfterEach
//  public void teardown() {
//    // Gracefully stop Spark listening on both endpoints
//    Spark.unmap("/order");
//    Spark.awaitStop(); // don't proceed until the server is stopped
//  }
//
//  /**
//   * Helper to start a connection to a specific API endpoint/params
//   *
//   * @param apiCall the call string, including endpoint (NOTE: this would be better if it had more
//   *     structure!)
//   * @return the connection for the given URL, just after connecting
//   * @throws IOException if the connection fails for some reason
//   */
//  private static HttpURLConnection tryRequest(String apiCall) throws IOException {
//    // Configure the connection (but don't actually send the request yet)
//    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
//    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
//
//    // The default method is "GET", which is what we're using here.
//    // If we were using "POST", we'd need to say so.
//    clientConnection.setRequestMethod("GET");
//
//    clientConnection.connect();
//    return clientConnection;
//  }
//
//  /**
//   * Tests calling the view CSV handler without first loading
//   *
//   * @throws IOException
//   */
//  @Test
//  public void testViewWithoutLoading() throws IOException {
//    HttpURLConnection clientConnection = tryRequest("viewCSV");
//
//    assertEquals(200, clientConnection.getResponseCode());
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//    System.out.println("view test: expResult: " + expResult);
//
//    assertEquals("error_csv_not_loaded", expResult);
//
//    clientConnection.disconnect();
//  }
//
//  /**
//   * Tests calling the load CSV handler
//   *
//   * @throws IOException
//   */
//  @Test
//  public void testLoadCSVHandler() throws IOException {
//    HttpURLConnection clientConnection =
//        tryRequest("loadCSV?filepath=data/stars/ten-star.csv&hasHeader=true");
//
//    assertEquals(200, clientConnection.getResponseCode());
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    assertEquals("success", responseMap.get("result"));
//    clientConnection.disconnect();
//  }
//
//  /**
//   * tests case where view csv handler is called after the load handler
//   *
//   * @throws IOException
//   */
//  @Test
//  public void testViewCSVHandler() throws IOException {
//    HttpURLConnection loadConnection =
//        tryRequest("loadCSV?filepath=data/stars/ten-star.csv&hasHeader=true");
//    assertEquals(200, loadConnection.getResponseCode());
//
//    HttpURLConnection clientConnection = tryRequest("viewCSV");
//    // Get an OK response (the *connection* worked, the *API* provides an error response)
//    assertEquals(200, clientConnection.getResponseCode());
//    // We'll use okio's Buffer class here
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//
//    assertEquals("success", expResult);
//
//    clientConnection.disconnect();
//  }
//
//  /**
//   * tests that a broadband connection is successfully established and returns the coverage data we
//   * expect
//   *
//   * @throws IOException
//   */
//  @Test
//  public void testBroadbandHandler() throws IOException {
//    HttpURLConnection broadbandConnection =
//        tryRequest("broadband?state=california&county=Monterey");
//    assertEquals(200, broadbandConnection.getResponseCode());
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(broadbandConnection.getInputStream()));
//    showDetailsIfError(body);
//    System.out.println("body" + body);
//    String broadBandData = (String) body.get("broadband_percentage");
//
//    String expPercentageCoverage = "93.1";
//
//    Assert.assertTrue(broadBandData.contains(expPercentageCoverage));
//
//    broadbandConnection.disconnect();
//  }
//
//  /**
//   * Tests that searching a csv works when the CSV is loaded
//   *
//   * @throws IOException if there is an error with input/output
//   */
//  @Test
//  public void testSearchCSVHandler() throws IOException {
//    HttpURLConnection loadConnection =
//        tryRequest("loadCSV?filepath=data/stars/ten-star.csv&hasHeader=true");
//    assertEquals(200, loadConnection.getResponseCode()); //
//
//    HttpURLConnection clientConnection =
//        tryRequest(
//            "searchCSV?searchVal=Sol&colIdentifier=none"); // Get an OK response (the *connection*
//    // worked, the *API* provides an error
//    // response)
//    assertEquals(200, clientConnection.getResponseCode());
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//
//    assertEquals("success", expResult);
//
//    clientConnection.disconnect();
//  }
//
//  @Test
//  public void testSearchWithoutLoading() throws IOException {
//    HttpURLConnection clientConnection = tryRequest("searchCSV?searchVal=Sol&colIdentifier=none");
//    // Get an OK response (the *connection* worked, the *API* provides an error response)
//    assertEquals(200, clientConnection.getResponseCode());
//
//    // We'll use okio's Buffer class here
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//    System.out.println("search test: expResult: " + expResult);
//
//    assertEquals("error", expResult);
//
//    clientConnection.disconnect();
//  }
//
//  /**
//   * Tests that searching a loaded csv returns errors with faulty requests
//   *
//   * @throws IOException if there is an error with input/output
//   */
//  @Test
//  public void testSearchCSVHandlerFaultyRequests() throws IOException {
//    HttpURLConnection loadConnection =
//        tryRequest("loadCSV?filepath=data/stars/ten-star_no_headings.csv&hasHeader=false");
//    assertEquals(200, loadConnection.getResponseCode()); //
//
//    HttpURLConnection clientConnection =
//        tryRequest("searchCSV?searchVal=Sol&colIdentifier=badInput"); // Get an OK response (the
//    // *connection* worked, the *API*
//    // provides an error response)
//    assertEquals(200, clientConnection.getResponseCode());
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//    System.out.println("exp result: " + expResult);
//
//    assertEquals("error", expResult);
//
//    clientConnection.disconnect();
//
//    HttpURLConnection clientConnection2 =
//        tryRequest("searchCSV?searchVal=NonexistentSearchValue&colIdentifier=none");
//    assertEquals(200, clientConnection2.getResponseCode());
//
//    Map<String, Object> body2 =
//        adapter.fromJson(new Buffer().readFrom(clientConnection2.getInputStream()));
//    showDetailsIfError(body2);
//    Map<String, Object> responseMap2 = (Map<String, Object>) body2.get("responseMap");
//    Object expResult2 = responseMap2.get("result");
//
//    assertEquals("success", expResult2);
//    List<String> matches = (List<String>) responseMap2.get("matches");
//    Assert.assertTrue(matches.isEmpty());
//    clientConnection2.disconnect();
//  }
//
//  /**
//   * Loads a CSV with a header, then without a header, then tries to view Asserts that the header is
//   * not contained in the csv data
//   *
//   * @throws IOException
//   */
//  @Test
//  public void testLoadTwiceView() throws IOException {
//    HttpURLConnection loadConnectionWithHeader =
//        tryRequest("loadCSV?filepath=data/stars/ten-star.csv&hasHeader=true");
//    assertEquals(200, loadConnectionWithHeader.getResponseCode());
//
//    HttpURLConnection loadConnectionWithoutHeader =
//        tryRequest("loadCSV?filepath=data/stars/ten-star_no_headings.csv&hasHeader=false");
//    assertEquals(200, loadConnectionWithoutHeader.getResponseCode());
//
//    HttpURLConnection clientConnection = tryRequest("viewCSV");
//    assertEquals(200, clientConnection.getResponseCode());
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//    System.out.println("view test: expResult: " + expResult);
//
//    List<List<String>> data = (List<List<String>>) responseMap.get("data");
//    System.out.println("data is " + data);
//    Assert.assertFalse(data.contains("ProperName"));
//
//    assertEquals("success", expResult);
//
//    clientConnection.disconnect();
//  }
//
//  /**
//   * Loads a CSV, searches it once successfully, searches it again but with an invalid column
//   * identifier, then views it
//   *
//   * @throws IOException
//   */
//  @Test
//  public void testLoadSearchSearchView() throws IOException {
//    // Load
//    HttpURLConnection loadConnection =
//        tryRequest("loadCSV?filepath=data/stars/ten-star.csv&hasHeader=true");
//    assertEquals(200, loadConnection.getResponseCode()); //
//    loadConnection.disconnect();
//
//    // Search successfully
//    HttpURLConnection clientConnection = tryRequest("searchCSV?searchVal=Sol&colIdentifier=none");
//    assertEquals(200, clientConnection.getResponseCode());
//
//    Map<String, Object> body =
//        adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
//    showDetailsIfError(body);
//    Map<String, Object> responseMap = (Map<String, Object>) body.get("responseMap");
//    Object expResult = responseMap.get("result");
//
//    assertEquals("success", expResult);
//    clientConnection.disconnect();
//
//    // Search unsuccessfully
//    HttpURLConnection clientConnection2 =
//        tryRequest("searchCSV?searchVal=Sol&colIdentifier=17.468");
//    assertEquals(200, clientConnection2.getResponseCode());
//
//    Map<String, Object> body2 =
//        adapter.fromJson(new Buffer().readFrom(clientConnection2.getInputStream()));
//    showDetailsIfError(body2);
//    Map<String, Object> responseMap2 = (Map<String, Object>) body2.get("responseMap");
//    Object expResult2 = responseMap2.get("result");
//    System.out.println("responseMap2: " + responseMap2);
//
//    assertEquals("error_bad_request", expResult2);
//    clientConnection2.disconnect();
//
//    // View
//    HttpURLConnection viewConnection = tryRequest("viewCSV");
//    assertEquals(200, viewConnection.getResponseCode());
//    Map<String, Object> body3 =
//        adapter.fromJson(new Buffer().readFrom(viewConnection.getInputStream()));
//    showDetailsIfError(body3);
//    Map<String, Object> responseMap3 = (Map<String, Object>) body3.get("responseMap");
//    Object expResult3 = responseMap3.get("result");
//    System.out.println("view test: expResult: " + expResult3);
//
//    assertEquals("success", expResult3);
//    viewConnection.disconnect();
//  }
//
//  private void showDetailsIfError(Map<String, Object> body) {
//    if (body.containsKey("type") && "error".equals(body.get("type"))) {
//      System.out.println(body.toString());
//    }
//  }
//}
