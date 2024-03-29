import { Page } from 'puppeteer';
import { Utils } from '../../../src/common/utils';

export const testScreenshot = async (page: Page, options = {}) => {
  // Rid of unnecessary hover
  await page.mouse.move(0, 0);

  await Utils.sleep(1000);

  return page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: 1440,
      height: 960,
    },
    ...options,
  });
};
