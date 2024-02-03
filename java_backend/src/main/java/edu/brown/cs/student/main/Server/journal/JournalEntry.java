package edu.brown.cs.student.main.Server.journal;
import java.util.*;

public class JournalEntry {
  private String date;
  private String entry;
  private String prompt;

  public JournalEntry(String date, String entry, String prompt) {
    this.date = date;
    this.entry = entry;
    this.prompt = prompt;
  }

  public void updateEntry(String entry) {
    this.entry = entry;
  }

  public String getDate() {
    return this.date.toString();
  }

  public String getEntry() {
    return this.entry;
  }


  public String getPrompt() {
    return this.prompt;
  }
}
