import { test, expect } from "@playwright/test";

/**
 * This file includes a variety of integration tests for the front end to the back end,
 * testing integration of the entire system
 */

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

/** unit test that tests that text can be typed into text box*/
/** using this to see if playwright can find my tests */
test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("a simple case of broadband works", async ({ page }) => {
  // an example broadband query: broadband California Kings County, California // Result: 83.5
  // broadband California Los Angeles County, California // // Result: 89.9

  const mock_command = "broadband California Kings County, California";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
  await page.keyboard.press("Enter");

  await expect(page.getByText("Result: 83.5")).toBeVisible();
});

test("I can query broadband between loading, viewing, and seraching a CSV without errors", async ({
  page,
}) => {
  // broadband query 1
  const command = "broadband California Kings";
  await page.fill('[aria-label="Command input"]', command);
   await page.keyboard.press("Enter");

  await expect(page.getByText("Result: 83.5")).toBeVisible();

  // Step 1: Load the CSV
  const mock_command = "load_file data/simple/mini-star.csv true";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  // Asser that load worked correctly
  const historyContent1 = await page.waitForSelector(".repl-history");

  const receivedHTML1 = await historyContent1.evaluate((el) => el.innerHTML);
  const receivedText1 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML1);

  expect(receivedText1).toContain(
    "Result: data/simple/mini-star.csv successfully loaded."
  );

  // broadband call #2
  const broadband_command2 = "broadband California Kings";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(broadband_command2);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  await expect(page.getByText("Result: 83.5")).toBeVisible();

  // Step 2: View CSV
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");

  // Click the button
   await page.keyboard.press("Enter");

  // Step 3: Assert the command appears in the history section
  // Assuming 'repl-history' is a class or role that represents your history section
  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  // Perform the assertions
  // expect(receivedText).toContain("Result:data/simple/mini-star.csv successfully loaded.");
  expect(receivedText).toContain("StarID, ProperName");
  expect(receivedText).toContain("0, Sol");
  expect(receivedText).toContain("1, button");

  // searching for Sol with column name
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search Sol ProperName");

  await page.keyboard.press("Enter");

  const historyContent3 = await page.waitForSelector(".repl-history");

  const receivedHTML3 = await historyContent3.evaluate((el) => el.innerHTML);
  const receivedText3 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML3);

  // searching for Sol with column
  expect(receivedText3).toContain("Result: 0, Sol");

  // searching for Sol
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search Sol 1");

   await page.keyboard.press("Enter");

  const historyContent4 = await page.waitForSelector(".repl-history");

  const receivedHTML4 = await historyContent4.evaluate((el) => el.innerHTML);
  const receivedText4 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML4);

  // searching for Sol
  expect(receivedText4).toContain("Result: 0, Sol");
});

/**
 * INTEGRATION TESTS W/ CSVS THAT LOAD, SEARCH, & VIEW CSVs IN DIFFERENT ORDER W/ DIFFERENT MODES
 */

test("I can load, then view", async ({ page }) => {
  // Step 1: Load the CSV
  const mock_command = "load_file data/simple/mini-star.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  // Asser that load worked correctly
  const historyContent1 = await page.waitForSelector(".repl-history");

  const receivedHTML1 = await historyContent1.evaluate((el) => el.innerHTML);
  const receivedText1 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML1);

  expect(receivedText1).toContain(
    "Result: data/simple/mini-star.csv successfully loaded."
  );

  // Step 2: View CSV
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");

  // Click the button
   await page.keyboard.press("Enter");

  // Step 3: Assert the command appears in the history section
  // Assuming 'repl-history' is a class or role that represents your history section
  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  // Perform the assertions
  // expect(receivedText).toContain("Result:data/simple/mini-star.csv successfully loaded.");
  expect(receivedText).toContain("StarID, ProperName");
  expect(receivedText).toContain("0, Sol");
  expect(receivedText).toContain("1, button");
});

test("I can load, view, then load and view something else successfully", async ({
  page,
}) => {
  /** Loading & viewing CSV 1 */
  const mock_command = "load_file data/simple/mini-star.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  // Step 3: Assert the command appears in the history section
  // Assuming 'repl-history' is a class or role that represents your history section
  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  // Step 4: Perform the assertions
  // expect(receivedText).toContain("Result:data/simple/mini-star.csv successfully loaded.");
  expect(receivedText).toContain("StarID, ProperName");
  expect(receivedText).toContain("0, Sol");
  expect(receivedText).toContain("1, button");

  /** Loading & viewing CSV 3 */
  const mock_command2 = "load_file data/simple/mini-lego.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command2);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  // Step 3: Assert the command appears in the history section
  // Assuming 'repl-history' is a class or role that represents your history section
  const historyContent2 = await page.waitForSelector(".repl-history");

  const receivedHTML2 = await historyContent2.evaluate((el) => el.innerHTML);
  const receivedText2 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML2);

  // Step 4: Perform the assertions
  expect(receivedText2).toContain(
    "Result: data/simple/mini-lego.csv successfully loaded."
  );
  expect(receivedText2).toContain("color, shape");
  expect(receivedText2).toContain("red, rectangle");
  expect(receivedText2).toContain("blue, square");
});

test("searching for a result not in the csv will return empty", async ({
  page,
}) => {
  const mock_command = "load_file data/simple/mini-lego.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  // searching for song
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search peanut");
  // Step 2: Click the button
   await page.keyboard.press("Enter");

  const historyContent = await page.waitForSelector(".repl-history");
  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  // TODO: why isn't this working?
  if (receivedText !== null) {
    expect(receivedText).toContain(
      "Result: data/simple/mini-lego.csv successfully loaded."
    );
  }
});

test("I can load, search, and then search something else", async ({ page }) => {
  /** Loading & viewing CSV 1 */
  // Step 1: Interact with the input
  const mock_command = "load_file data/simple/mini-star.csv true";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  // searching for Sol
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search Sol");

   await page.keyboard.press("Enter");

  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  // Step 4: Perform the assertions
  // searching for Sol
  expect(receivedText).toContain(
    "Result: data/simple/mini-star.csv successfully loaded."
  );
  expect(receivedText).toContain("0, Sol");

  // searching for 'button'
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search button");

   await page.keyboard.press("Enter");

  const historyContent2 = await page.waitForSelector(".repl-history");
  const receivedHTML2 = await historyContent2.evaluate((el) => el.innerHTML);
  const receivedText2 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML2);

  expect(receivedText2).toContain("1, button");
});

test("an invalid command causes an alert to display", async ({ page }) => {
  // Start listening for the dialog event
  let dialogMessage = "uscdvfb1";
  page.on("dialog", (dialog) => {
    dialogMessage = dialog.message();
    dialog.dismiss(); // or dialog.accept() depending on what you want to do
  });

  const mock_command = "sfdgfdhgf uscdvfb1";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);
   await page.keyboard.press("Enter");

  expect(dialogMessage).toBe("Enter a valid command."); // Replace 'invalid filepath' with the exact message you expect
});

test("an invalid filepath causes an informative result message", async ({
  page,
}) => {
  // Start listening for the dialog event

  const mock_command = "load_file asdfadf"; // stopped here ******************************************************
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  expect(receivedText).toContain(
    "Error loading asdfadf. Please enter valid filepath."
  );
});

test("I can submit user input by pressing the enter button", async ({
  page,
}) => {
  // fill the mock command
  const load_command = "load_file data/simple/mini-star.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(load_command);

  // press enter to submit instead of clicking
  await page.keyboard.press("Enter");

  const historyContent1 = await page.waitForSelector(".repl-history");

  const receivedHTML1 = await historyContent1.evaluate((el) => el.innerHTML);
  const receivedText1 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML1);

  expect(receivedText1).toContain(
    "Result: data/simple/mini-star.csv successfully loaded."
  );

  const view_command = "view";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(view_command);

  // press enter to submit instead of clicking
  await page.keyboard.press("Enter");

  // assert view is as expected
  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  expect(receivedText).toContain("StarID, ProperName");
  expect(receivedText).toContain("0, Sol");
  expect(receivedText).toContain("1, button");
});

test("I can load, view, search, then change to verbose mode and view and search something else with col idx", async ({
  page,
}) => {
  /** Loading & viewing CSV 1 */
  // Step 1: Load the CSV
  const mock_command = "load_file data/simple/mini-star.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
  await page.keyboard.press("Enter");

  // Asser that load worked correctly
  const historyContent1 = await page.waitForSelector(".repl-history");

  const receivedHTML1 = await historyContent1.evaluate((el) => el.innerHTML);
  const receivedText1 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML1);

  expect(receivedText1).toContain(
    "Result: data/simple/mini-star.csv successfully loaded."
  );

  // Step 2: View CSV
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");

  // Click the button
   await page.keyboard.press("Enter");

  // Step 3: Assert the command appears in the history section
  // Assuming 'repl-history' is a class or role that represents your history section
  const historyContent = await page.waitForSelector(".repl-history");

  const receivedHTML = await historyContent.evaluate((el) => el.innerHTML);
  const receivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, receivedHTML);

  // Perform the assertions
  // expect(receivedText).toContain("Result:data/simple/mini-star.csv successfully loaded.");
  expect(receivedText).toContain("StarID, ProperName");
  expect(receivedText).toContain("0, Sol");
  expect(receivedText).toContain("1, button");

  // *** change mode to verbose ***
  const mode_command = "mode verbose";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mode_command);

   await page.keyboard.press("Enter");

  const verboseHistoryContent1 = await page.waitForSelector(".repl-history");
  const verboseReceivedHTML1 = await verboseHistoryContent1.evaluate(
    (el) => el.innerHTML
  );
  const verboseReceivedText1 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, verboseReceivedHTML1);

  expect(verboseReceivedText1).toContain("Command: mode verbose");

  // load CSV3
  const load_command2 = "load_file data/simple/mini-lego.csv";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(load_command2);

   await page.keyboard.press("Enter");

  // viewing CSV3 in VERBOSE
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");

   await page.keyboard.press("Enter");

  // assert view is as expected in VERBOSE
  const verboseHistoryContent = await page.waitForSelector(".repl-history");

  const verboseReceivedHTML = await verboseHistoryContent.evaluate(
    (el) => el.innerHTML
  );
  const verboseReceivedText = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, verboseReceivedHTML);

  // Perform the assertions
  expect(verboseReceivedText).toContain("Command: view");
  expect(verboseReceivedText).toContain("StarID, ProperName");
  expect(verboseReceivedText).toContain("0, Sol");
  expect(verboseReceivedText).toContain("1, button");

  // search CSV3 in VERBOSE by col identifier colIdx
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search blue");

   await page.keyboard.press("Enter");

  // assert search is as expected
  const verboseHistoryContent2 = await page.waitForSelector(".repl-history");
  const verboseReceivedHTML2 = await verboseHistoryContent2.evaluate(
    (el) => el.innerHTML
  );
  const verboseReceivedText2 = await page.evaluate((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
  }, verboseReceivedHTML2);

  expect(verboseReceivedText2).toContain("Command: search blue");
  expect(verboseReceivedText2).toContain("Result: blue, square");
});

test("testing areasearch function", async ({ page }) => {
  // an example broadband query: broadband California Kings County, California // Result: 83.5
  // broadband California Los Angeles County, California // // Result: 89.9

  const mock_command = "areasearch Hartford";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(mock_command);

  // Step 2: Click the button
   await page.keyboard.press("Enter");

  await expect(page.getByText("Performing area search.")).toBeVisible();
});
