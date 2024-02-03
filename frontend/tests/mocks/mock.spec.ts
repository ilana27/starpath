import { test, expect } from "@playwright/test";

/**
 * Mocking Overview
 *
 * We test the following front end functionality with mocks:
 *
 * Mock prompt is visible
 * Mock date is visible
 * Mock previous entry can be accessed by pressing the prev button
 * Mock next entry can be accessed by pressing the next button
 * Mock suggestions can be seen by pressing 'submit for suggestions' button
 *
 */

test("on page load, I see correct login page elements", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByLabel("login button")).toBeVisible();
  await expect(page.getByLabel("email text box")).toBeVisible();
  await expect(page.getByLabel("password text box")).toBeVisible();
});

test("after logging in, the elements of the journal display are visible", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("email text box").fill("awinters@risd.edu");
  await page.getByLabel("password text box").fill("i<3dogs20");
  await page.getByLabel("login button").click();
  await expect(page.getByLabel("submit button")).toBeVisible();
  await expect(page.getByLabel("Journal input")).toBeVisible();
  await expect(page.getByLabel("journal command box")).toBeVisible();
  await expect(page.getByLabel("mental health disclaimer")).toBeVisible();
});

/**
 * Journal Prompt Tests Asserting Visibility & Presence
 */
test("on page load, i see a journal prompt", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await expect(page.getByText("Daily Prompt:")).toBeDefined();

  // await expect(
  //   page.getByText("Mock: Describe a highlight and challenge from today.")
  // ).toBeVisible();
  await expect(page.locator("css=.journal-prompt")).toBeDefined();
  await expect(page.locator("css=.journal-prompt")).toBeDefined();
});

test("on page load, the date is displayed", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await expect(page.locator("css=.date")).toBeVisible();
  await expect(page.locator("css=.date")).toBeDefined();
  await expect(page.locator("css=.date")).toBeTruthy();
});

test("when the submit button is clicked, the suggestions panel is displayed", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("email text box").fill("awinters@risd.edu");
  await page.getByLabel("password text box").fill("i<3dogs20");
  await page.getByLabel("login button").click();
  await page.getByLabel("journal command box").click();
  await page
    .getByLabel("journal command box")
    .fill("I HATE essays. I LOVE dogs");
  await page.getByLabel("submit button").click();
  await expect(page.getByLabel("suggestions display")).toBeVisible();
  await expect(page.getByLabel("suggestions list")).toBeVisible();
  await expect(page.getByLabel("random plant image")).toBeVisible();
});

test("when I press submit, I can see mock suggestions in the suggestions panel", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await page.getByLabel("journal command box").click();
  await page
    .getByLabel("journal command box")
    .fill("I HATE essays. I LOVE dogs");
  
  /* before the submit button is pressed, suggestions are not visible on screen */
  await expect(page.getByLabel(".suggestions-list li")).not.toBeVisible();

  await page.getByLabel("submit button").click();
  // await expect(page.getByLabel("checkbox1").textContent().t
  // const list = await page.getByLabel(".suggestions-list li");
  await expect(page.getByLabel(".suggestions-list li")).toBeDefined();
  // await expect(page.$('ul'))

  const list = await page.waitForSelector('.suggestions-list');
  const listItems = await list.$$('li');
  for (const listItem of listItems) {
    const listItemText = await listItem.textContent();
    // each list item contains the substring Mock: Suggestion
    expect(listItemText).toBeDefined();
    // expect(listItemText).toContain("Mock: Suggestion")
  }
  // there are 3 mock suggestions
  expect(listItems.length).toBe(3);
});


/** Testing prev & next button functinality w/ mocked data */
test("pressing the next and previous buttons provides expected functionality", async ({
  page
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await page.getByLabel("journal command box").click();
  await page
    .getByLabel("journal command box")
    .fill("hmmm");

  // when I press the next button, a new prompt & date populate
  await page.locator("css=.next-button").click();

  const nextPrompt = "Mock: What helps you with difficult emotions?";
  // await expect(page.getByText(nextPrompt)).toBeVisible();
  await expect(page.getByText(nextPrompt)).toBeTruthy();


  const nextDate = "Mock: Dec 25, 2023";
  await expect(page.getByText(nextDate)).toBeTruthy();

  // when I press the back button, I see the original prompt, entry and date
  await page.locator("css=.prev-button").click();
  const initPrompt = "Mock: Describe a highlight and challenge from today.";
  await expect(page.getByText(initPrompt)).toBeTruthy();

  const initDate = "Mock: Dec 18, 2023";
  await expect(page.getByText(initDate)).toBeTruthy();

  const initEntry = "hmm";
  // await expect(page.locator("input")).toHaveValue(initEntry);
  // await expect(page.getByText(initEntry)).toBeVisible();
  const textArea = await page.$('textarea');
  const textEnty = await textArea?.textContent();

  expect(textEnty?.includes(initEntry));

  // when I press the prev button again, I can see my previous submission and my saved entry
  await page.locator("css=.prev-button").click();
  const prevPrompt = "Mock: Describe your emotions over the past few days.";
  await expect(page.getByText(prevPrompt)).toBeTruthy();

  const prevDate = "Mock: Dec 11, 2023";
  await expect(page.getByText(prevDate)).toBeTruthy();

  const prevEntry = "Mock: I've been really sad, but also really grateful.";
  await expect(page.getByText(prevEntry)).toBeTruthy();











  
  
  // /* before the submit button is pressed, suggestions are not visible on screen */
  // await expect(page.getByLabel(".suggestions-list li")).not.toBeVisible();

  // await page.getByLabel("submit button").click();
  // // await expect(page.getByLabel("checkbox1").textContent().t
  // // const list = await page.getByLabel(".suggestions-list li");
  // await expect(page.getByLabel(".suggestions-list li")).toBeDefined();
  // // await expect(page.$('ul'))

  // const list = await page.waitForSelector('.suggestions-list');
  // const listItems = await list.$$('li');
  // for (const listItem of listItems) {
  //   const listItemText = await listItem.textContent();
  //   // each list item contains the substring Mock: Suggestion
  //   expect(listItemText).toContain("Mock: Suggestion")
  // }
  // // there are 3 mock suggestions
  // expect(listItems.length).toBe(3);
});