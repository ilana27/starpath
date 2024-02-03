package BackendTests;

import edu.brown.cs.student.main.Server.journal.JournalPromptGenerator;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.testng.Assert;

public class UnitTests {

  /* Testing prompt generation */
  @Test
  public void testPromptGeneration() {
    JournalPromptGenerator promptGen = new JournalPromptGenerator();
    String randomPrompt1 = promptGen.getRandomJournalPrompt();
    String randomPrompt2 = promptGen.getRandomJournalPrompt();
    String randomPrompt3 = promptGen.getRandomJournalPrompt();
    String randomPrompt4 = promptGen.getRandomJournalPrompt();

    List<String> testPrompts = new ArrayList() {{
      add("How have you been dealing with stress lately?");
      add("Have you felt inspired by anything recently? If so, what?");
      add("What's been your high and low of the day?");
      add("What are you looking forward to in the next week?");
      add("What's been your biggest struggle of the last month?");
      add("Reflect on the last time you cried.");
      add("What is one thing you are grateful for?");
      add("Have you been able to prioritize yourself lately? Why or why not?");
      add("What is your biggest regret?");
      add("Is there anyone in your life you want to reconnect with?");
      add("What are you goals for the next month?");
      add("Reflect on a time when you had courage and confronted a difficult situation. How did you feel afterwards? Is there anything you've been putting off that would be good to address?");
      add("What are some goals you have for today?");
      add("What is your greatest fear?");
      add("Is there anything you need to get off your chest?");
      add("What has been going well in your life? Is there anything you would like to change?");
    }};

    // assert that the random prompts are in the list of test prompts
    Assert.assertTrue(testPrompts.contains(randomPrompt1));
    Assert.assertTrue(testPrompts.contains(randomPrompt2));
    Assert.assertTrue(testPrompts.contains(randomPrompt3));
    Assert.assertTrue(testPrompts.contains(randomPrompt4));

    // assert that there are multiple prompts in the list of test prompts
    Assert.assertTrue(testPrompts.size() > 1);
  }


}
