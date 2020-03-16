declare namespace NodeJS {
  export interface Global {
    asUser: Function;
    testScreenshot: any;
    initPage: Function;
    __BROWSER__: { [key: string]: any };
    __BROWSER_CONTEXT__: { [key: string]: any };
  }
}

declare namespace jest {
  interface Matchers<R> {
    toMatchImageSnapshot(): R;
  }
}
