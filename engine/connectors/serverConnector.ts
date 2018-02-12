import { StaticConfig, debug, ExecutionConfig, UserDataStorage, UserLoginData, RefreshTokenDataReq } from "../../common";
import 'isomorphic-fetch';
import { ICliConnector } from "../../interfaces";
import { GraphQLClient, request } from "graphql-request";
import * as _ from "lodash";
import * as uuid from "uuid";

export class ServerConnector extends ICliConnector {

    async getDeployUrl(build: string): Promise<any> {
        const result = await this.graphqlClient(`mutation {
                        generateDeployUrl(build:"${build}") {
                            buildUrl, summaryDataUrl
                        }
                    }`);
        return result.generateDeployUrl;
    }

    /**
     *
     * @param build
     * @param account
     *
     * @returns { success, message }
     */
    async deployBuild(build: string): Promise<any> {
        const result = await this.graphqlClient(`mutation {
            deploySchema(build:"${build}") {
                    success, message
                }
            }
        `);

        return result.deploySchema;
    }

    async invoke(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async reauth(data: RefreshTokenDataReq): Promise<UserLoginData> {
        const res = await this.graphqlClient(`
        mutation {
            refreshToken(data:{refreshToken: "${data.refreshToken}", email: "${data.email}"}) {
                refreshToken, idToken, accessToken
          }
        }
        `);

        return res.refreshToken;
    }

    /**
     * @param user user name
     * @param password
     * @param session - uuid login session
     * @returns success, message
     */
    async login(session: string, email?: string, password?: string): Promise<any> {

        const result = await this.graphqlClient(`
        mutation {
            userLogin(data:{email:"${email}", password: "${password}", sessionID:"${session}"}) {
            success, message
          }
        }`);

        return result.userLogin;
    }

    async getUserLoginToken(session: string): Promise<any> {
        const resp = await this.graphqlClient(`
        mutation {
            getUserLoginToken(loginSessionId:"${session}") {
                complete, success, accessToken, idToken, refreshToken, email, message
          }
        }
        `);

        return resp.getUserLoginToken;
    }

    /*
        Private functions
    */

    private async graphqlClient(query: any, variables?: any): Promise<any> {
        debug('create graphql client ' + StaticConfig.remoteServerCliEndPoint);

        // todo token format?
        const localClient = new GraphQLClient(StaticConfig.remoteServerCliEndPoint, {
          headers: {
              "account-id": UserDataStorage.accountId,
              Authorization: UserDataStorage.token,
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