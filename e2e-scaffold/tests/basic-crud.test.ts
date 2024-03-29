import { ElementHandle, Page } from 'puppeteer';

let page: Page;
let auth: any;

const { E2E_SCAFFOLD_APP_URL } = process.env;

beforeAll(async () => {
  ({ auth } = await global.asUser());
});

beforeEach(async () => {
  page = await global.initPage(global.__BROWSER_CONTEXT__, auth);
});

it('As a user, I can see customers page', async () => {
  await page.goto(E2E_SCAFFOLD_APP_URL, { waitUntil: 'networkidle2' });

  await ((await page.waitForXPath(`//nav//*[contains(text(), "C")]`)) as ElementHandle).click();
  await page.waitForXPath(`//*[@role="loader"]`);
  await page.waitForXPath(`//*[@role="loader"]`, { hidden: true });

  expect(await global.testScreenshot(page)).toMatchImageSnapshot();
});

it('As a user, I can create new property', async () => {
  await page.goto(`${E2E_SCAFFOLD_APP_URL}/properties`, { waitUntil: 'networkidle2' });

  await ((await page.waitForXPath(`//button/span[contains(text(), "Create Property")]`)) as ElementHandle).click();

  await page.waitForXPath(`//span[contains(text(), "New Property")]`);

  await (await page.waitForXPath(`//input[@name="bedrooms"]`)).type('2');
  await (await page.waitForXPath(`//input[@name="title"]`)).type('Beladle');
  await (await page.waitForXPath(`//input[@name="description"]`)).type('Description');
  await (await page.waitForXPath(`//input[@name="sqFootage"]`)).type('1000');
  await (await page.waitForXPath(`//input[@name="bathrooms"]`)).type('2');
  await ((await page.waitForXPath(`//form//*[contains(text(), "Garage")]/..`)) as ElementHandle).click();
  await ((await page.waitForXPath(`//form//*[contains(text(), "Pool")]/..`)) as ElementHandle).click();

  await ((await page.waitForXPath(`//form//*[@name="listings"]`)) as ElementHandle).click();
  await (
    (await page.waitForXPath(`//*[contains(@id, "react-select")][contains(text(), "Closing")]`)) as ElementHandle
  ).click();
  await ((await page.waitForXPath(`//form//*[@name="listings"]`)) as ElementHandle).click();
  await (
    (await page.waitForXPath(`//*[contains(@id, "react-select")][contains(text(), "Lead")]`)) as ElementHandle
  ).click();

  await page.$eval('*', () => (document.activeElement as any).blur());

  expect(await ((await page.waitForXPath('//form/..')) as ElementHandle).screenshot()).toMatchImageSnapshot();

  await (
    (await page.waitForXPath(`//form//button/span[contains(text(), "Create Property")]`)) as ElementHandle
  ).click();

  await page.waitForXPath(`//*[@class="Toastify"]//*[contains(text(), "Property successfully created")]`);
  await page.waitForXPath(`//*[@class="Toastify"]//*[contains(text(), "Property successfully created")]`, {
    hidden: true,
  });
});

it('As a user, I can edit property', async () => {
  await page.goto(`${E2E_SCAFFOLD_APP_URL}/properties`, { waitUntil: 'networkidle2' });

  await ((await page.waitForXPath(`//*[contains(text(), "Beladle")]/../..//i`)) as ElementHandle).click();
  await (
    (await page.waitForXPath(`//*[contains(text(), "Beladle")]/../..//*[contains(text(), "Edit")]`)) as ElementHandle
  ).click();

  await (await page.waitForXPath(`//input[@name="title"]`)).type(' Other');

  expect(await ((await page.waitForXPath('//form/..')) as ElementHandle).screenshot()).toMatchImageSnapshot();

  await (
    (await page.waitForXPath(`//form//button/span[contains(text(), "Update Property")]`)) as ElementHandle
  ).click();

  await page.waitForXPath(`//*[@class="Toastify"]//*[contains(text(), "Property successfully updated")]`);
  await page.waitForXPath(`//*[@class="Toastify"]//*[contains(text(), "Property successfully updated")]`, {
    hidden: true,
  });

  await page.waitForXPath(`//*[contains(text(), "Beladle Other")]`);
});

it('As a user, I can delete property', async () => {
  await page.goto(`${E2E_SCAFFOLD_APP_URL}/properties`, { waitUntil: 'networkidle2' });

  await ((await page.waitForXPath(`//*[contains(text(), "Beladle")]/../..//i`)) as ElementHandle).click();
  await (
    (await page.waitForXPath(`//*[contains(text(), "Beladle")]/../..//*[contains(text(), "Delete")]`)) as ElementHandle
  ).click();

  expect(await ((await page.waitForXPath('//form/..')) as ElementHandle).screenshot()).toMatchImageSnapshot();

  await (
    (await page.waitForXPath(`//form//button/span[contains(text(), "Delete Property")]`)) as ElementHandle
  ).click();

  await page.waitForXPath(`//*[@class="Toastify"]//*[contains(text(), "Property successfully deleted")]`);
  await page.waitForXPath(`//*[@class="Toastify"]//*[contains(text(), "Property successfully deleted")]`, {
    hidden: true,
  });

  await page.waitForXPath(`//*[contains(text(), "Beladle Other")]`, { hidden: true });
});

export {};
