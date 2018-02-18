import { BaseCommand } from "../base";
import { ExecutionConfig, UserDataStorage, trace } from "../../../common";
import { ProjectController, GraphqlController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import * as path from "path";

export default class Use extends BaseCommand {

    private accountId: string;
    private email: string;

    private remote: string;

    async run(): Promise<any> {
        if (_.isNil(this.accountId) && _.isNil(this.email) && _.isNil(this.remote)) {
            return trace(UserDataStorage.toString());
        }

        if (this.accountId) {
            UserDataStorage.account = this.accountId;
        }
        if (this.email) {
            UserDataStorage.email = this.email;
        }

        if (this.remote) {
            UserDataStorage.remoteCliAddress = this.remote;
        }
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.accountId = config.getParameter("account");
        this.email = config.getParameter("email");
        this.remote = config.getParameter("remote");
    }

    usage(): string {
        return `
            no parameters - print config
            --account <account_id> set account (optional)
            --email <email> set email (optional)
            --remote <address> set remote cli endpoint (optional)`;
    }

    name(): string {
        return "config";
    }

    onSuccess(): string {
        let res = "";
        if (this.accountId) {
            res += "use account " + this.accountId + "\n";
        }
        if (this.email) {
            res += "use email " + this.email + "\n";
        }
        if (this.remote) {
            res += "use remote cli endpoint " + this.remote + "\n";
        }
        return res;
    }

}