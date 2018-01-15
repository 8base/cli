import { ExecutionConfig } from "../../../common";
import 'isomorphic-fetch';
import { StaticConfig, debug } from "../../../common";
import IRemoteConnector from "../../../interfaces/IRemoteConnector";

export class RemoteConnector extends IRemoteConnector {

    /**
     * @param user user name
     * @param password
     *
     * @returns token
     */
    async login(user: string, password: string): Promise<string> {
        debug("login token process");
        const resp = await fetch(StaticConfig.remoteServerEndPoint + StaticConfig.loginPath, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user })
        });

        const responce = await resp.json();
        return responce.token;
    }
}