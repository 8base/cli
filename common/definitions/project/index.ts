/**
 * Must be send to different git repository, cause server use it too
 */

import { IFunctionHandler } from "./handler";



export enum FunctionType {
  Resolver, Trigger
}

export enum GraphQlFunctionType {
  Mutation, Query
}

export interface FunctionDefinition {
  name: string;

  handler: IFunctionHandler;

  type: FunctionType;

  gqlType?: GraphQlFunctionType;

  gqlschemaPath: string;

  environments?: Map<string, string>;
}

export interface ProjectDefinition {

  name: string;
  functions: FunctionDefinition[];
  rootPath: string;
  gqlSchema: string;
}

export * from "./handler";