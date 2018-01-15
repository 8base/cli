
export default abstract class IRemoteConnector {
    abstract async login(user: string, password: string): Promise<string>;
    abstract async checkToken(user: string, token: string): Promise<boolean>;
}
