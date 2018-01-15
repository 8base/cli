import { ExecutionConfig } from "../../../common";
import 'isomorphic-fetch'
import { StaticConfig, debug } from "../../../common";


abstract class IRemoteConnector {
    abstract async login(user: string, password: string): Promise<string>;
    abstract async checkToken(user: string, token: string): Promise<boolean>;
}

class RemoteConnector extends IRemoteConnector {

    async login(user: string, password: string): Promise<string> {
        debug("login token process");
        const resp = await fetch(StaticConfig.remoteServerEndPoint + StaticConfig.loginPath, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
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

        debug("receive status = " + resp.status)
        return resp.status == 200;
    }
    
}

class MockConnector extends IRemoteConnector {

    async checkToken(user: string, token: string): Promise<boolean> {
        return true;
    }

    async login(user: string, password: string): Promise<string> {
        return "mocktoken";
    }
}

export function getRemoteConnector(config: ExecutionConfig): IRemoteConnector {
    if (config.mock.login) {
        return new MockConnector();
    }
    
    return new RemoteConnector();
}