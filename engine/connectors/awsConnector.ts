import { ICloudConnector } from "../../interfaces";
import * as aws from "aws-sdk";

export class AwsConnector implements ICloudConnector {
    async upload(data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}