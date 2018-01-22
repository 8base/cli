import { IConnector } from "../../../interfaces";
import * as aws from "aws-sdk";
import { StaticConfig, debug } from "../../../common";
import * as path from "path";
import { FunctionDefinition, CompileProject } from "../../../engine";
import * as _ from "lodash";
import * as fs from "fs";


/**
 * class use for develop. to avoid server, directly call to aws
 */

aws.config.loadFromPath(path.join(StaticConfig.rootProjectDir, "../engine/connectors/awsConnector/configAws.json"));

export class AwsConnector extends IConnector {

    private bucket = "kokokotest";

    private zipFile: string;

    async invoke(): Promise<any> {
    }

    async login(user?: string, password?: string): Promise<string> {
        return "";
    }

    async getTemporaryUrlToUpload(): Promise<string> {
        return "";
    }

    async deploy(url: string, project: CompileProject, sourceFile: string): Promise<any> {
        this.zipFile = sourceFile;
        debug("aws connector: start upload");
        await Promise.all(_.map(project.functions, async (func) => {
            await this.uploadFunction(func);
        }));

        debug("aws connector: upload complete");
    }

    private async uploadFunction(func: FunctionDefinition) {
        let req: aws.Lambda.Types.CreateFunctionRequest;
        req = {
            FunctionName: func.name,
            Runtime: "nodejs6.10",
            Role: "arn:aws:iam::005301729547:role/testservice-dev-us-east-1-lambdaRole",
            Handler: func.name,
            Code: {
                S3Bucket: this.bucket,
                S3Key: func.name,
                // S3ObjectVersion: "",
                ZipFile: fs.readFileSync(this.zipFile)
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