import { debug, trace, ExecutionConfig, UserDataStorage, AccountLoginData } from "../../common";
import { getCliConnector, getCloudConnector } from "../../engine";
import * as path from "path";
import * as uuid from "uuid";

/**
 * class implement scope of remote cli graphql actions.
 * deploy:
 *  1. get url and token for upload to aws
 *  2. upload to aws. receive guid of uploaded build,
 *  3. send command to remote cli point registrate uploaded schema.
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

    static async deployArchive(archivePath: string, build: string, accountId: number) {

        const cliConnector = getCliConnector();

        const url = await cliConnector.getDeployUrl(build, accountId);

        await getCloudConnector().upload(url, archivePath);

        await cliConnector.registrateShema(build, accountId);
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