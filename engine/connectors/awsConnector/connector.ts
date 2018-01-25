import { IConnector } from "../../../interfaces";
import * as aws from "aws-sdk";
import { FunctionDefinition, StaticConfig, debug } from "../../../common";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";

/**
 * class use for develop. to avoid server, directly call to aws
 */

// aws.config.loadFromPath(path.join(StaticConfig.rootProjectDir, "../engine/connectors/awsConnector/configAws.json"));

export class AwsConnector extends IConnector {
    async upload(sourceFilePath: string): Promise<any> {
        this.zipFile = sourceFilePath;
        debug("aws connector: start upload");
        /*
        await Promise.all(_.map(project.functions, async (func) => {
            await this.uploadFunction(func);
        }));
        */
        debug("aws connector: upload complete");
    }
    async updateConfiguration(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    private bucket = "kokokotest";

    private zipFile: string;

    async invoke(): Promise<any> {
    }

    async login(user?: string, password?: string): Promise<string> {
        return "";
    }

    private async getTemporaryUrlToUpload(): Promise<string> {
        return "";
    }

    private async uploadFunction(func: FunctionDefinition) {
        let req: aws.Lambda.Types.CreateFunctionRequest;
        debug(this.zipFile);

        debug(fs.readFileSync(this.zipFile).length);

        req = {
            FunctionName: "ggg2",
            Runtime: "nodejs6.10",
            Role: "arn:aws:iam::005301729547:role/testservice-dev-us-east-1-lambdaRole",
            Handler: "hello_eug_koko",
            Code: {
                 S3Bucket: this.bucket,
                 S3Key: "build.zip",
                // S3ObjectVersion: "",
                // ZipFile: fs.readFileSync("/home/eugene/git_source/8base/source/test/testrepo/.build/build.zip")//.toString('base64')
            },
            MemorySize: 150
        };

        const lambda = new aws.Lambda();

        const res = await lambda.createFunction(req, (err, data) => {
            if (err) {
                debug("error aws = " + err);
                return;
            }
        }).promise();

        debug("upload success arn = " + res.FunctionArn);
    }
}