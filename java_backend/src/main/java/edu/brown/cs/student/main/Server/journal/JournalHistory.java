package edu.brown.cs.student.main.Server.journal;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;
public class JournalHistory implements JournalDataSource{
  private Map<Integer, JournalEntry> journalHistory = new HashMap<>();
  private Integer currentEntryNumber;

  /**
   * constructor
   */
  public JournalHistory() {
    currentEntryNumber = 0;
  }

  /**
   * Updates the text body of the current journal entry
   * @param newEntry
   */
  public void updateEntry(String date, String newEntry, String newPrompt) {
    if (this.journalHistory.containsKey(this.currentEntryNumber)) {
      this.journalHistory.get(this.currentEntryNumber).updateEntry(newEntry);
    } else {
      this.journalHistory.put(this.currentEntryNumber, new JournalEntry(date, newEntry, newPrompt));
    }
  }

  /**
   *  Returns the previous Journal Entry. Throws an error if tries to access a previous entry when
   *  there are no previous entries.
   * @return
   * @throws DatasourceException
   */
  public JournalEntry getPrev() throws DatasourceException {
    System.out.println("getPrev handler was triggered and journal history is: \n" + journalHistory.toString());
    for (int i=0; i<journalHistory.size(); i++) {
      String prompt = journalHistory.get(i).getPrompt();
      String date = journalHistory.get(i).getDate();
      String entry = journalHistory.get(i).getEntry();
      System.out.println("prompt: \n" + prompt + "\ndate: \n"+ date + "\nentry \n" + entry);
    }
    Integer newCurrent = this.currentEntryNumber - 1;
    if (newCurrent < 0) {
      throw new DatasourceException("Previous entry does not exist");
    }
    this.currentEntryNumber = newCurrent;
    return this.journalHistory.get(this.currentEntryNumber);
  }

  /**
   * Returns the next Journal Entry. If it already exists, then return it. If it doesn't already
   * exist, make a new journal entry, add it to the JournalHistory hashmap, and return the new
   * journal entry.
   * @param date
   * @return
   */
  public JournalEntry getNext(String date, String prompt) {
    System.out.println("I'm in the get next function in JournalHistory");

    Integer newCurrent = this.currentEntryNumber + 1;
    if (this.journalHistory.containsKey(newCurrent)) {
      this.currentEntryNumber = newCurrent;
      return this.journalHistory.get(this.currentEntryNumber);
    }
    this.currentEntryNumber = newCurrent;
    this.journalHistory.put(this.currentEntryNumber, new JournalEntry(date, "", prompt));
    return this.journalHistory.get(this.currentEntryNumber);
  }



}
