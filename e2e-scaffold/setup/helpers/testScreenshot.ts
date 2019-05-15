import { Page } from "puppeteer";

export const testScreenshot = async (page: Page, options = {}) => {
  // Rid of unnecessary hover
  await page.mouse.move(0, 0);

  await page.waitFor(1000);

  const screenshot = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: 1440,
      height: 960,
    },
    ...options,
  });

  return screenshot;
};
