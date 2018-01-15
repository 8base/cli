import { BaseCommand } from "../base";
import { ExecutionConfig, debug, UserDataStorage, trace } from "../../../common";
import { InvalidArgument } from "../../../errors/invalidArgument";
import { RemoteConnector } from "./remoteConnector";
import * as _ from "lodash";

export default class Login extends BaseCommand {
    private user: string;
    private password: string;
    private config: ExecutionConfig;

    async run(): Promise<any> {
        const remoteConnector = new RemoteConnector();
        debug("receive remote connector, try to login");

        let storage = new UserDataStorage();
        let token = storage.getToken();
        if (token) {
            trace("You are already logged into 8base account");
            return token;
        }

        token = await remoteConnector.login(this.user, this.password);

        debug("receive token = " + token);
        debug("save token...");

        storage.saveToken(token);

        debug("save token success");
        return token;
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

        this.config = config;
    }

    usage(): string {
        return "-u <username> -p <password>";
    }

    name(): string {
        return "login";
    }

    onSuccess(): string {
        return "login complete successfully";
    }

}