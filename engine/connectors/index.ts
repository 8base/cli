import { ICliConnector, ICloudConnector } from "../../interfaces";
import { ServerConnector } from "./serverConnector";
import { AwsConnector } from "./awsConnector";

export function getCliConnector(): ICliConnector {
    return new ServerConnector();
}

export function getCloudConnector(): ICloudConnector {
    return new AwsConnector();
}


