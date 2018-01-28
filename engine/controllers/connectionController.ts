import { debug, trace, ExecutionConfig, UserDataStorage } from "../../common";
import { getConnector } from "../../engine";
import * as path from "path";
import 'isomorphic-fetch';
import * as aws from "aws-sdk";

export class ConnectionController {

    static async upload(filename: string) {
        const data = getConnector().getDeployUrl(path.basename(filename));

    }

    private static async uploadInternal(filename: string, data: any) {
        const resp = await fetch(data.url, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user })
        });
    }

    static async autorizate(user?: string, password?: string) {
        let token = UserDataStorage.getToken();
        if (token) {
            trace("You are already logged into 8base account");
            return token;
        }

        token = await getConnector().login(user, password);

        debug("receive token = " + token);
        debug("save token...");

        UserDataStorage.saveToken(token);

        return token;
    }
}