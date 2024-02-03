package edu.brown.cs.student.main.Server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

import edu.brown.cs.student.main.Server.journal.DatasourceException;
import edu.brown.cs.student.main.Server.journal.JournalDataSource;
import edu.brown.cs.student.main.Server.journal.JournalEntry;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class JournalGetPrevHandler implements Route {
  private JournalDataSource journalHistory;

  public JournalGetPrevHandler(JournalDataSource journalHistory) {
    this.journalHistory = journalHistory;
  }

  public Object handle(Request request, Response response) throws Exception {
    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObject);
    Map<String, Object> responseMap = new HashMap<>();

    try {
      JournalEntry currentEntry = this.journalHistory.getPrev();
      responseMap.put("result", "success");
      responseMap.put("journal_date", currentEntry.getDate());
      responseMap.put("journal_entry", currentEntry.getEntry());
      responseMap.put("journal_prompt", currentEntry.getPrompt());

      System.out.println("in get prev handler, ");
      System.out.println("entry is: " + currentEntry.getEntry());
    } catch (DatasourceException e) {
      responseMap.put("result", "error");
      responseMap.put("error_msg", e.getMessage());
    }

    return adapter.toJson(responseMap);
  }

}
