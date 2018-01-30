import { ICloudConnector } from "../../interfaces";
import * as aws from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import { debug } from "../../common";
import 'isomorphic-fetch';
import * as request from "request";

export class AwsConnector implements ICloudConnector {

    async uploadPost(postData: any, filepath: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async upload(url: any, filepath: any): Promise<any> {
        const data = fs.readFileSync(filepath);
        debug("start upload file....");
        return new Promise<any>((resolve, reject) => {
            request({
                method: "PUT",
                url: url,
                body: data,
                headers: {
                    'Content-Length': data.length
                }
            },
            (err: any, res: any, body: any) => {
                if (res && res.statusCode !== 200 ) {
                    reject(new Error(res.body));
                }
                debug("upload file \"" + filepath + "\" success");
                resolve(path.basename(filepath));
            });
    });
    }

}