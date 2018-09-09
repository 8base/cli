import { UserDataStorage } from "./userDataStorage";
import { setTraceLevel, TraceLevel, debug } from "./tracer";
import { StaticConfig } from ".";
const { Client } = require("@8base/api-client");

export class Context {

  constructor(params: any) {
    if (params.d) {
      setTraceLevel(TraceLevel.Debug);
    }
  }
  request(query: string, variables: any): Promise<any> {
    debug("query = ");
    debug(query);
    debug("vaiables = ");
    debug(JSON.stringify(variables));
    debug("remote address = " + StaticConfig.remoteAddress);

    const client = new Client(StaticConfig.remoteAddress);
    client.setRefreshToken(UserDataStorage);
    return client.request(query, variables);
  }

}