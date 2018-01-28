import { ICliConnector, ICloudConnector } from "../../interfaces";
import { ServerConnector } from "./serverConnector";

export function getCliConnector(): ICliConnector {
    return new ServerConnector();
}

export function getCloudConnector(): ICloudConnector {
    return new; 
}


