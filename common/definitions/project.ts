/**
 * Must be send to different git repository, cause server use it too
 */



export interface FunctionHandler {
  code: string;
}

export enum FunctionType {
  resolver, trigger
}

export interface FunctionDefinition {
  name: string;

  handler: FunctionHandler;

  type: FunctionType;

  schema: string;
}

export interface ProjectDefinition {

  name: string;
  functions: FunctionDefinition[];
}

