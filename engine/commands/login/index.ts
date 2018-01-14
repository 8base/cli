import { BaseCommand } from "../base";
import { ExecutionConfig, debug, UserDataStorage } from "../../../common";
import { InvalidArgument } from "../../../errors/invalidArgument";
import { getRemoteConnector } from "./remoteLogin";
import * as _ from "lodash";

export default class Login extends BaseCommand {
    private user: string;
    private password: string;

    async run(): Promise<any> {
        const remoteConnector = getRemoteConnector();
        debug("receive remote connector, try to login");

        const token = await remoteConnector.login(this.user, this.password);

        debug("receive token = " + token);
        debug("save token...");

        UserDataStorage.saveToken(token);

        debug("save token success");
    }

    init(config: ExecutionConfig) {
        this.user = config.getParameter('u');
        this.password = config.getParameter('p');

        if (_.isNil(this.user)) {
            throw new InvalidArgument("user");
        }

        if (_.isNil(this.password)) {
            throw new InvalidArgument("password");
        }
    }

    usage(): string {
        return " -u <username> -p <password>";
    }

    name(): string {
        return "login";
    }

    onSuccess(): string {
        return "login complete successfully";
    }

}