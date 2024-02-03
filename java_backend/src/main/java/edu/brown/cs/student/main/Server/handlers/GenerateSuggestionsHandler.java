package edu.brown.cs.student.main.Server.handlers;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

import edu.brown.cs.student.main.Server.journal.DatasourceException;
import edu.brown.cs.student.main.Server.journal.JournalDataSource;
import edu.brown.cs.student.main.Server.journal.JournalEntry;
import spark.Request;
import spark.Response;
import spark.Route;

public class GenerateSuggestionsHandler implements Route {

    public GenerateSuggestionsHandler() {
    }

  public Object handle(Request request, Response response) throws Exception {
    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObject);
    String entry = request.queryParams("entry");
    Map<String, Object> responseMap = new HashMap<>();
    responseMap.put("result", "success");
    List<String> suggestions = new ArrayList<String>();
    suggestions.add("suggestion 1");
    suggestions.add("suggestion 2");
    suggestions.add("suggestion 3");
    responseMap.put("suggestions", suggestions);
    return adapter.toJson(responseMap);
  }
}
