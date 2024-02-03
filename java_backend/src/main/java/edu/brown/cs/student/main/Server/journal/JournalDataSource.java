package edu.brown.cs.student.main.Server.journal;


public interface JournalDataSource {

  void updateEntry(String date, String newEntry, String newPrompt);
  JournalEntry getPrev() throws DatasourceException;
  JournalEntry getNext(String date, String newPrompt);
}
