//package edu.brown.cs.student.main.Server.handlers;
//
//public class JournalPromptGeneratorHandler {
//
//}


package edu.brown.cs.student.main.Server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

import edu.brown.cs.student.main.Server.journal.JournalPromptGenerator;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class JournalPromptGeneratorHandler implements Route {
  private String journalPrompt;

  public JournalPromptGeneratorHandler(JournalPromptGenerator promptGenerator) {
    this.journalPrompt = promptGenerator.getRandomJournalPrompt();
  }

  public Object handle(Request request, Response response) throws Exception {
    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObject);
    Map<String, Object> responseMap = new HashMap<>();

    responseMap.put("result", "success");
    responseMap.put("prompt", this.journalPrompt);
    return adapter.toJson(responseMap);
  }

}
