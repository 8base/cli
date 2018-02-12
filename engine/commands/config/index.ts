import { BaseCommand } from "../base";
import { ExecutionConfig, UserDataStorage } from "../../../common";
import { ProjectController, GraphqlController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import * as path from "path";

export default class Use extends BaseCommand {

    private accountId: string;
    private email: string;

    async run(): Promise<any> {
        if (this.accountId) {
            UserDataStorage.account = this.accountId;
        }
        if (this.email) {
            UserDataStorage.email = this.email;
        }
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.accountId = config.getParameter("acount");
        this.email = config.getParameter("email");
    }

    usage(): string {
        return `
            --account <account_id> set account
            --email <email> set email`;
    }

    name(): string {
        return "config";
    }

    onSuccess(): string {
        return "use account = " + this.accountId;
    }

}