import { BaseCommand } from "../base";
import { ExecutionConfig, debug, UserDataStorage, trace } from "../../../common";
import { InvalidArgument } from "../../../errors";
import { ConnectionController } from "../../controllers";
import * as _ from "lodash";

export default class Login extends BaseCommand {
    private user: string;
    private password: string;
    private config: ExecutionConfig;

    async run(): Promise<any> {
        return await ConnectionController.autorizate(this.user, this.password);
    }

    async init(config: ExecutionConfig): Promise<any> {
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