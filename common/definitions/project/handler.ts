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