

declare namespace NodeJS {
  export interface Global {
    asUser: Function;
    testScreenshot: any;
    initPage: Function;
    __BROWSER__: { [key:string]: any };
    __BROWSER_CONTEXT__: { [key: string]: any };
  }
}

declare namespace jest {
  // tslint:disable-next-line:interface-name
  interface Matchers<R> {
    toMatchImageSnapshot(): R;
  }
}

