import { debug, trace, ExecutionConfig, UserDataStorage } from "../../common";
import { getConnector } from "../../engine";


export class ConnectionController {

    static async upload() {
    }

    static async autorizate(user?: string, password?: string) {
        let token = UserDataStorage.getToken();
        if (token) {
            trace("You are already logged into 8base account");
            return token;
        }

        token = await getConnector().login("");

        debug("receive token = " + token);
        debug("save token...");

        UserDataStorage.saveToken(token);

        return token;
    }
}