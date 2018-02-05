import { debug, trace, ExecutionConfig, UserDataStorage, AccountLoginData } from "../../common";
import { getCliConnector, getCloudConnector } from "../../engine";
import * as path from "path";

/**
 * class implement scope of remote cli graphql actions.
 * deploy:
 *  1. get url and token for upload to aws
 *  2. upload to aws. receive guid of uploaded build,
 *  3. send command to remote cli point deploy uploaded schema.
 *
 * autorizate
 *  At moment implementation is developed for tests.
 *  For the future: we have to login through frontend (like graphcool)
 *  1. send to the server command with generated guid that some user is going to login
 *  2. open browser with generated guid
 *  3. user login
 *  4. ask the server login status. (use generated guid in first section)
 */

export class RemoteActionController {

    static async deploy(archiveBuildPath: string, archiveSummaryPath: string, build: string) {

        const cliConnector = getCliConnector();

        const urls = await cliConnector.getDeployUrl(build);

        const cloudConnector = getCloudConnector();
        await cloudConnector.upload(urls.buildUrl, archiveBuildPath);
        await cloudConnector.upload(urls.summaryDataUrl, archiveSummaryPath);

        const result = await cliConnector.deployShema(build);

        if (!result.success) {
            throw new Error(result.message);
        }

    }

    static async autorizate(user?: string, password?: string): Promise<AccountLoginData> {
        let data = UserDataStorage.getData();
        if (data) {
            trace("You are already logged into 8base account");
            return data;
        }

        let loginData = await getCliConnector().login(user, password);

        debug("receive token = " + loginData.token);
        debug("save token...");

        UserDataStorage.save(loginData);

        return loginData;
    }

}