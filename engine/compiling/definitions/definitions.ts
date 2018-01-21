export class Schema {
  path: string;
}

export class FunctionHandler {
  path: string;

  code?: string;

}

export enum FunctionType {
  resolver, trigger
}

export class FunctionDefinition {
  name: string;

  handler: FunctionHandler;

  type: FunctionType;

  schema: Schema;
}

export class ProjectDefinition {

  name: string;
  functions: FunctionDefinition[];
}

export const SupportedCompileExtension = new Set<string>([".ts", ".js"]);