import { BrowserContext } from 'puppeteer';

export const initPage = async (context: BrowserContext, auth: { [key: string]: string }) => {
  const page = await context.newPage();

  if (!!auth) {
    await page.evaluateOnNewDocument((auth: any) => {
      localStorage.clear();
      localStorage.setItem("auth", JSON.stringify(auth));
    }, auth);
  }

  await page.setViewport({ width: 1440, height: 960 });

  await page.addStyleTag({
    content: `
      * {
        -webkit-transition: none !important;
        transition: none !important;
        -webkit-animation: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `,
  });

  return page;
};
