import { ExecutionConfig } from "../../../common";


abstract class IRemoteConnector {
    abstract async login(user: string, password: string): Promise<string>;
    abstract async checkToken(user: string, token: string): Promise<boolean>;
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
    return new MockConnector();
}