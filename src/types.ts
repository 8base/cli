import { DocumentNode } from 'graphql';

export type GqlRequest = <Result = {}, Variables = {}>(
  gqlTag: DocumentNode,
  variables?: Variables,
  options?: {
    checkPermissions?: boolean;
    headers?: Record<string, any>;
  },
) => Promise<Result>;

export type FunctionContext = {
  api: {
    gqlRequest: GqlRequest;
  };
  invokeFunction: <Result = {}, Args = {}>(
    name: string,
    args?: Args,
    options?: { waitForResponse: boolean; checkPermissions?: boolean },
  ) => Promise<Result>;
};

export type FunctionEvent<Data = {}, OriginalObject = {}, ExtendObject = {}, Error = {}> = {
  data: Data;
  originalObject: OriginalObject;
  errors: Error[];
  body?: string;
  headers: { [key: string]: string | undefined };
} & ExtendObject;

export type FunctionResult<Data = {}, OriginalObject = {}, ExtendObject = {}, Error = {}> = Promise<
  {
    data?: Data;
    originalObject?: OriginalObject;
    errors?: Error[];
    body?: string;
  } & ExtendObject
>;
