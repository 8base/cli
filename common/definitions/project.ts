/**
 * Must be send to different git repository, cause server use it too
 */



export interface FunctionHandler {
  code: string;
}

export enum FunctionType {
  Resolver, Trigger
}

export enum GraphQlFunctionType {
  Mutation, Query
}

export interface FunctionDefinition {
  name: string;

  handler: FunctionHandler;

  type: FunctionType;

  gqlType?: GraphQlFunctionType;

  gqlschemaPath: string;
}

export interface ProjectDefinition {

  name: string;
  functions: FunctionDefinition[];
  rootPath: string;
  gqlSchema: string;
}

