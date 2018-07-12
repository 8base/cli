import {
    debug,
    ExecutionConfig,
    UserDataStorage,
    UserLoginData,
    RefreshTokenDataReq,
    RelativeWebhookDefinition,
    ResolverDefinition,
    TriggerDefinition
} from "../../common";
import { GraphQLClient, request } from "graphql-request";
import * as _ from "lodash";
import * as uuid from "uuid";

class ServerConnectorImpl {

    async invokeAsync(functionName: string, args: string): Promise<{ success: boolean, message: string }> {
        const result = await this.graphqlClient(`mutation {
            invokeAsync(functionName: "${functionName}", inputArgs:"${args}") {
                success, message
            }
        }
        `);

        return result.invokeAsync;
    }

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

    // TODO rename deploySchema to deployBuild
    async deployBuild(build: string): Promise<any> {
        const result = await this.graphqlClient(`
        mutation {
            deploySchema(build:"${build}")
        }
        `);
    }

    async invoke(functionName: string, args: string): Promise<string> {
        const result = await this.graphqlClient(`mutation {
            invoke(functionName: "${functionName}", inputArgs:"${args}") {
                responseData
            }
        }
        `);

        return result.invoke.responseData;
    }

    async describeBuild(): Promise< {
        functions: ResolverDefinition[],
        webhooks: RelativeWebhookDefinition[],
        triggers: TriggerDefinition[] }> {
        const result = await this.graphqlClient(`
        query{
            describeBuild {
              functions {
                name, gqlType
              }
              webhooks{
                accountRelativePath httpMethod name appId
              }
              triggers {
                table action stage
              }
            }
          }
        `);
        return {
            functions: result.describeBuild.functions,
            triggers: result.describeBuild.triggers,
            webhooks: result.describeBuild.webhooks.map((w:any) => new RelativeWebhookDefinition(w)),
        };
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
        debug('create graphql client ' + UserDataStorage.remoteCliAddress);
        debug('account id ' + UserDataStorage.accountId);
        debug('token ' + UserDataStorage.token);

        const localClient = new GraphQLClient(UserDataStorage.remoteCliAddress, {
          headers: {
              "account-id": UserDataStorage.accountId,
          //   Authorization: UserDataStorage.token,
          //   on the server side auth is turn off => TODO: turn on!!!
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

export const ServerConnector = (): ServerConnectorImpl => {
    return new ServerConnectorImpl();
};