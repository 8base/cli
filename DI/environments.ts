
import { IConnector } from "../interfaces";
import { AwsConnector } from "../engine";
import { di } from "../DI";

export function setDevEnvironment() {
    di.register(IConnector, AwsConnector);
}