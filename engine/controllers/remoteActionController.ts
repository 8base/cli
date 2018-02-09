import { debug, trace, ExecutionConfig, UserDataStorage, UserLoginData } from "../../common";
import { getCliConnector, getCloudConnector } from "../../engine";
import { ICliConnector } from "../../interfaces";
import * as path from "path";
import _ = require("lodash");
import * as uuid from "uuid";

/**
 * class implement scope of remote cli graphql actions.
 * deploy:
 *  1. get url and token for upload to aws
 *  2. upload to aws. receive guid of uploaded build,
 *  3. send command to remote cli point deploy uploaded schema.
 *
 * autorizate
 *  For the future: we have to login through frontend (like graphcool)
 *  1. send to the server command with generated guid that some user is going to login
 *  2. open browser with generated guid
 *  3. user login
 *  4. ask the server login status. (use generated guid in first section)
 */

export class RemoteActionController {

    static async deploy(archiveBuildPath: string, archiveSummaryPath: string, build: string) {
        await this.remoteActionWrap(
            _.bind(RemoteActionController.deployInternal, this, archiveBuildPath, archiveSummaryPath, build));
    }

    static async autorizate(email?: string, password?: string): Promise<UserLoginData> {

        let data = UserDataStorage.getData();

        // check jwt token

        if (data) {
            trace("You are already logged into 8base account. To clear auth data use \"8base clear\"");
            return data;
        }

        const session = uuid.v4();
        const resp = await getCliConnector().login(session, email, password);

        // TODO open browser and login from it

        debug("try to get token data");

        const loginData = await this.waitForUserLogin(session);

        debug("save token...");

        UserDataStorage.auth = { email, ...loginData };
        UserDataStorage.email = loginData.email;

        return loginData;
    }


    /*
        Private functions
    */

    /*
        Function call reauth cli function and save received data to local db
    */

    private static async reauth() {
        const res = await getCliConnector().reauth({ email: UserDataStorage.email, refreshToken: UserDataStorage.refreshToken });
        UserDataStorage.auth = res;
    }

    /*
        Function reauthenticate in case of failed action by token reason
    */
    private static async remoteActionWrap(action: any) {
        try {
            await action();
        } catch(ex) {
            if (ex.response
                && _.isArray(ex.response.errors)
                && ex.response.errors.find((e: any) => e.code === "InvalidTokenError" || e.code == "TokenExpiredError")) {

                    trace("action auth error = " + ex.message);
                    await this.reauth();
                    return await action();
            }
            throw ex;
        }
    }

    private static async deployInternal(archiveBuildPath: string, archiveSummaryPath: string, build: string) {
        const cliConnector = getCliConnector();

        const urls = await cliConnector.getDeployUrl(build);

        const cloudConnector = getCloudConnector();
        await cloudConnector.upload(urls.buildUrl, archiveBuildPath);
        await cloudConnector.upload(urls.summaryDataUrl, archiveSummaryPath);

        const result = await cliConnector.deployBuild(build);

        if (!result.success) {
            throw new Error(result.message);
        }
    }

    private static async waitForUserLogin(session: string): Promise<any> {
        let complete = false;
        const cliConnector = getCliConnector();
        let res: any;
        let counter = 100;
        while(!complete && --counter >= 0) {
            res = await cliConnector.getUserLoginToken(session);
            complete = res.complete;
        }

        if (counter < 0) {
            throw new Error("Max retry count reached!");
        }

        if (!res.success) {
            throw new Error(res.message);
        }

        return _.pick(res, ["email", "refreshToken", "idToken", "accessToken"]);
    }
}