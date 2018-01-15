
export default abstract class IRemoteConnector {
    /**
     * @param user user name
     * @param password
     *
     * @returns token
     */

    abstract async login(user: string, password: string): Promise<string>;
}
