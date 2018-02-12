export enum FunctionHandlerType {
    Code, Webhook
}

export interface IFunctionHandler {

  value(): string;

  type(): FunctionHandlerType;
}

export class FunctionHandlerCode implements IFunctionHandler {
  private code: string;
  constructor(code: string) {
    this.code = code;
  }

  value(): string {
    return this.code;
  }
  type(): FunctionHandlerType {
    return FunctionHandlerType.Code;
  }
}

export class FunctionHandlerWebhook implements IFunctionHandler {
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  value(): string {
    return this.url;
  }
  type(): FunctionHandlerType {
    return FunctionHandlerType.Webhook;
  }
}