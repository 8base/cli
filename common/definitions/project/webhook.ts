
import * as url from "url";
import { UserDataStorage } from "../../userDataStorage";

export class WebhookDefinition {
  name: string;
  functionName: string;
  httpMethod: string;
  path: string;
  appId: string;

}


export class RelativeWebhookDefinition {
  constructor(options: {
    name: string,
    httpMethod: string,
    accountRelativePath: string;
    appId: string
  }) {
    this.name = options.name;
    this.appId= options.appId;
    this.accountRelativePath = options.accountRelativePath;
    this.httpMethod = options.httpMethod;
    this.resolvedPath = url.resolve(UserDataStorage.remoteAddress, this.accountRelativePath);
  }

  name: string;
  httpMethod: string;

  get resolvedHttpMethod(): string {
    return this.httpMethod.toUpperCase() === "ANY" ? "POST" : this.httpMethod;
  }

  accountRelativePath: string;
  appId: string;
  resolvedPath: string;

}
