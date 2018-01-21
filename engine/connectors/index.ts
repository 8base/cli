import { IConnector } from "../../interfaces";
import { ServerConnector } from "./serverConnector";
import { ExecutionConfig } from "../../common";
import { di } from "../../DI";

di.register(IConnector, ServerConnector);

export * from "./serverConnector";
export * from "./awsConnector";

// export function remoteConnection(): IConnector {
//    return DI.default.getObject(IConnector);
// }