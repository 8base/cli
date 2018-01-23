import { CompileProject } from "../../engine";
import { debug, trace, ExecutionConfig, UserDataStorage } from "../../common";
import { di } from "../../DI";
import { IConnector } from "../../interfaces";

export class ConnectionController {

    static async upload(project: CompileProject, config: ExecutionConfig) {
        di.instance(IConnector).upload(project);
    }

    static async autorizate(user?: string, password?: string) {
        let token = UserDataStorage.getToken();
        if (token) {
            trace("You are already logged into 8base account");
            return token;
        }

        token = await di.getObject(IConnector).upload(user, password);

        debug("receive token = " + token);
        debug("save token...");

        UserDataStorage.saveToken(token);

        return token;
    }
}