import { ICloudConnector } from "../../interfaces";
export { ServerConnector } from "./serverConnector";
import { AwsConnector } from "./awsConnector";

export function getCloudConnector(): ICloudConnector {
    return new AwsConnector();
}


