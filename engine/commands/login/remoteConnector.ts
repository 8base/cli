import { ExecutionConfig } from "../../../common";
import 'isomorphic-fetch';
import { StaticConfig, debug } from "../../../common";
import IRemoteConnector from "./IRemoteConnector";

export class RemoteConnector extends IRemoteConnector {

    async login(user: string, password: string): Promise<string> {
        debug("login token process");
        const resp = await fetch(StaticConfig.remoteServerEndPoint + StaticConfig.loginPath, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user })
        });

        return await resp.json();
    }

    async checkToken(user: string, token: string): Promise<boolean> {
        debug("check token process");
        const resp = await fetch(StaticConfig.remoteServerEndPoint + StaticConfig.checkTokenPath, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user })
        });

        debug("receive status = " + resp.status);
        return resp.status == 200;
    }
}