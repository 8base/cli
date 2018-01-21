import { ExecutionConfig } from "../../common";
import 'isomorphic-fetch';
import { StaticConfig, debug } from "../../common";

export class RemoteConnector {

    /**
     * @param user user name
     * @param password
     *
     * @returns token
     */
    static async login(user: string, password: string): Promise<string> {
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

    static async upload() {

    }
}