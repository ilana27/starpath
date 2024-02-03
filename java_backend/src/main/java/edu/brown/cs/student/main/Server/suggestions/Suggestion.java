package edu.brown.cs.student.main.Server.suggestions;

public class Suggestion {
  private String suggestion;
  private int numClicks;


  public Suggestion(String suggestion) {
    this.suggestion = suggestion;
    this.numClicks = 1;
  }

  public void updateNumClicks(){
    this.numClicks++;
  }

  /**
   * Returns a defensive copy of the # of clicks associated with a suggestion
   * @return
   */
  public int getNumClicks(){
    int clicksCopy = this.numClicks;
    return clicksCopy;

  }

}
