import { IConnector } from "../../interfaces";
import { ServerConnector } from "./serverConnector";

export function getConnector(): IConnector {
    return new ServerConnector();
}


