import { StaticConfig, debug, ExecutionConfig, UserDataStorage, UserLoginData, RefreshTokenDataReq, RefreshTokenDataResp } from "../../common";
import 'isomorphic-fetch';
import { ICliConnector } from "../../interfaces";
import { GraphQLClient, request } from "graphql-request";
import * as _ from "lodash";
import * as uuid from "uuid";

export class ServerConnector extends ICliConnector {

    async getDeployUrl(build: string): Promise<any> {
        debug("upload process start");
        const result = await this.graphqlClient(`mutation {
                        generateDeployUrl(build:"${build}") {
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
    async deployShema(build: string): Promise<any> {
        debug("deploy schema process start");
        const result = await this.graphqlClient(`mutation {
            deploySchema(build:"${build}") {
                    success, message
                }
            }
        `);
        debug(JSON.stringify(result, null, 2));
        return {
            success: result.deploySchema.success,
            message: result.deploySchema.message
        };
    }

    async invoke(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async reauth(data: RefreshTokenDataReq): Promise<RefreshTokenDataResp> {
        const result = await this.graphqlClient(`
        mutation {
            userRefreshToken(data:{refreshToken: ${data.refreshToken}, email: ${data.email}}) {
            refreshToken, idToken
          }
        }
        `);

        return {
            token: result.userRefreshToken.token
        };
    }

    /**
     * @param user user name
     * @param password
     *
     * @returns token
     */
    async login(session: string, email?: string, password?: string): Promise<any> {

        const result = await this.graphqlClient(`
        mutation {
            userLogin(data:{email:"${email}", password: "${password}", sessionID:"${session}"}) {
            success, message
          }
        }`);

        return {
            success: result.userLogin.success,
            message: result.userLogin.message
        };
    }

    async getUserLoginToken(session: string): Promise<any> {
        const resp = await this.graphqlClient(`
        mutation {
            getUserLoginToken(loginSessionId:"${session}") {
                success, accessToken, tokenId, refreshToken
          }
        }
        `);

        return {
            success: resp.getUserLoginToken.success,
            email: resp.getUserLoginToken.email,
            accessToken: resp.getUserLoginToken.accessToken,
            refreshToken: resp.getUserLoginToken.refreshToken,
            tokenId: resp.getUserLoginToken.tokenId
        };
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