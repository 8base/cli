export {};

declare global {
  var asUser: Function;
  var testScreenshot: any;
  var initPage: Function;
  var __BROWSER__: { [key: string]: any };
  var __BROWSER_CONTEXT__: { [key: string]: any };
}

declare namespace jest {
  interface Matchers<R> {
    toMatchImageSnapshot(): R;
  }
}
