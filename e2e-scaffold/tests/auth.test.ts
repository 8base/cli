import { Page } from 'puppeteer';

let page: Page;

const { E2E_SCAFFOLD_EMAIL, E2E_SCAFFOLD_PASSWORD, E2E_SCAFFOLD_APP_URL } = process.env;

beforeEach(async () => {
  page = await global.initPage(global.__BROWSER_CONTEXT__);
});

it('As a user, I can login to the app', async () => {
  await page.goto(E2E_SCAFFOLD_APP_URL, { waitUntil: 'networkidle2' });

  await page.waitForXPath(`//*[@id="auth0-lock-container-1"]`);
  await page.waitFor(5000);

  const emailInput = await page.waitForXPath(`//input[@name="email"]`);
  await emailInput.type(E2E_SCAFFOLD_EMAIL);

  const passwordInput = await page.waitForXPath(`//input[@name="password"]`);
  await passwordInput.type(E2E_SCAFFOLD_PASSWORD);

  const buttonSubmit = await page.waitForXPath(`//button[@name="submit"]`);
  await buttonSubmit.click();

  await page.waitForXPath(`//div[@id="root"]//span[contains(text(), "example")]`);
});

export {};
