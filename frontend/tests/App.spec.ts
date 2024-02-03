import { test, expect } from "@playwright/test";

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
  await expect(page.getByLabel("journal command box")).toBeEditable();
  await expect(page.getByLabel("journal command box")).toBeEmpty();
  await expect(page.getByLabel("mental health disclaimer")).toBeVisible();
});

test("after logging in, journal is editable", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("email text box").fill("awinters@risd.edu");
  await page.getByLabel("password text box").fill("i<3dogs20");
  await page.getByLabel("login button").click();
  await expect(page.getByLabel("submit button")).toBeVisible();
  await expect(page.getByLabel("Journal input")).toBeVisible();
  await expect(page.getByLabel("journal command box")).toBeVisible();
  await expect(page.getByLabel("journal command box")).toBeEditable();
  await page
    .getByLabel("journal command box")
    .fill("I HATE essays. I LOVE dogs");
  await expect(page.getByLabel("journal command box")).toContainText(
    "I HATE essays. I LOVE dogs"
  );
});

test("after logging in, a prompt and date is visible", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await expect(page.getByLabel("journal prompt")).toBeVisible();
  await expect(page.getByLabel("date created")).toBeVisible();
});

/**
 * Journal Prompt Tests Asserting Visibility & Presence
 */
test("on page load, i see a journal prompt", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await expect(page.getByText("Daily prompt")).toBeVisible();
  await expect(page.locator("css=.journal-prompt")).toBeVisible();
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

test("the previous and next buttons are visible, and immediately clicking the previous button will result in an error message", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await expect(page.getByLabel("previous button")).toBeVisible();
  await expect(page.getByLabel("next button")).toBeVisible();
  await page.getByLabel("previous button").click();
  await expect(page.getByLabel("notification message overlay")).toBeVisible();
  await expect(page.getByLabel("notification message overlay")).toContainText(
    "There are no more previous entries!"
  );
});

test("the next button is visible, and clicking the next button will change the suggestions display", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await expect(page.getByLabel("suggestions display")).toBeHidden();
  await page.getByLabel("submit button").click();
  await expect(page.getByLabel("suggestions display")).toBeVisible();
  await expect(page.getByLabel("next button")).toBeVisible();
  await page.getByLabel("next button").click();
  await expect(page.getByLabel("suggestions display")).toBeHidden();
});

test("the previous button will result in a popup that can be closed", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("login button").click();
  await page.getByLabel("previous button").click();
  await expect(page.getByLabel("notification message overlay")).toBeVisible();
  await expect(page.getByLabel("notification message overlay")).toContainText(
    "There are no more previous entries!"
  );
  await page.getByLabel("close button").click();
  await expect(page.getByLabel("notification message overlay")).toBeHidden();
});

test("option keyboard shortcut to focus on submit button", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.keyboard.down("Alt");
  await expect(page.getByLabel("login button")).toBeFocused();
  await page.getByLabel("login button").click();
  await page.keyboard.down("Alt");
  await expect(page.getByLabel("submit button")).toBeFocused();
});

test("option and enter keyboard shortcut for the submit button", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.keyboard.down("Alt");
  await expect(page.getByLabel("login button")).toBeFocused();
  await page.getByLabel("login button").click();
  await expect(page.getByLabel("journal command box")).toBeVisible();
  await page.keyboard.down("Alt");
  await expect(page.getByLabel("submit button")).toBeFocused();
  await page.keyboard.down("Enter");
  await expect(page.getByLabel("suggestions display")).toBeVisible();
});
