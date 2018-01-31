import { StaticConfig, debug, ExecutionConfig, UserDataStorage, AccountLoginData } from "../../common";
import 'isomorphic-fetch';
import { ICliConnector } from "../../interfaces";
import { GraphQLClient, request } from "graphql-request";
import * as _ from "lodash";

export class ServerConnector extends ICliConnector {

    async getDeployUrl(build: string, account: string): Promise<any> {
        debug("upload process start");
        const result = await this.graphqlClient(`mutation {
                        generateDeployUrl(build:"${build}", account:"${account}") {
                            buildUrl, summaryDataUrl
                        }
                    }`);
        const data = result.generateDeployUrl;
        debug("receive url = " + JSON.stringify(data, null, 2));
        return data;
    }

    /**
     *
     * @param build
     * @param account
     *
     * @returns { success, message }
     */
    async registrateShema(build: string, account: string): Promise<any> {
        debug("registrate schema process start");
        const result = await this.graphqlClient(`mutation {
            registrateShema(build:"${build}", account:"${account}") {
                    success, message
                }
            }
        `);
        debug(JSON.stringify(result, null, 2));
        return {
            success: result.registrateShema.success,
            message: result.registrateShema.message
        };
    }

    private async getTemporaryUrlToUpload(): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async invoke(): Promise<any> {
        throw new Error("Method not implemented.");
    }


    /**
     * @param user user name
     * @param password
     *
     * @returns token
     */
    async login(user?: string, password?: string): Promise<AccountLoginData> {
        // TODO !! just for developing => have to be on frontend side!
        debug("login token process");
        const result = await this.graphqlClient(`mutation {
            accountLogin(data:{email: "${user}", password: "${password}"}) {
                account, token, success
            }
        }`);

        if (!result.accountLogin.success) {
            throw new Error("Login error!");
        }

        return {
            accountId: result.accountLogin.account,
            token: result.accountLogin.token
        };
    }

    private async graphqlClient(query: any, variables?: any): Promise<any> {
        debug('create graphql client ' + StaticConfig.remoteServerCliEndPoint);

        // todo token format?
        const localClient = new GraphQLClient(StaticConfig.remoteServerCliEndPoint, {
          headers: {
              "account-id": UserDataStorage.accountId,
              Authorization: `Bearer ${UserDataStorage.token}`,
          },
        });

        debug('Sending query:');
        debug(query);
        debug('Variables:');
        debug(variables);
        try {
            return await localClient.request(query, variables);
        } catch (e) {
            debug("graphql client error = " + e.message);
            throw e;
        }
    }
}