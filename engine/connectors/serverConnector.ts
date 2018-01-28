import { StaticConfig, debug, ExecutionConfig, UserDataStorage } from "../../common";
import 'isomorphic-fetch';
import { ICliConnector } from "../../interfaces";
import { GraphQLClient, request } from "graphql-request";
import * as _ from "lodash";

export class ServerConnector extends ICliConnector {

    async getDeployUrl(sourceFilePath: string): Promise<any> {
        debug("upload process start");
        const result = await this.graphqlClient(`mutation {
                        generateDeployUrl(filename:"${sourceFilePath}") {
                            id, url, fields
                        }
                    }`);
        return _.assign(_.pick(result, ["id", "url"]), JSON.parse(result.fields));
    }

    async registrateShema(filename: string): Promise<any> {
        throw new Error("Method not implemented.");
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
    async login(user?: string, password?: string): Promise<string> {
        // TODO !! just for developing => have to be on frontend side!
        debug("login token process");
        const result = await this.graphqlClient(`mutation {
            accountLogin(data:{email: "${user}", password: "${password}"}) {
                success, token
            }
        }`);
        debug("responce = " + JSON.stringify(result, null, 2));
        return result.accountLogin.token as string;
    }

    private async graphqlClient(query: any, variables?: any): Promise<any> {
        debug('create graphql client ' + StaticConfig.remoteServerCliEndPoint);
        const localClient = new GraphQLClient(StaticConfig.remoteServerCliEndPoint, {
          headers: {
            Authorization: `Bearer ${UserDataStorage.getToken()}`,
          },
        });

        debug('Sending query');
        debug(query);
        debug(variables);
        try {
            return await localClient.request(query, variables);
        } catch (e) {
            debug("graphql client error = " + e.message);
            throw e;
        }
    }
}