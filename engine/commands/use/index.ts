import { BaseCommand } from "../base";
import { ExecutionConfig, UserDataStorage } from "../../../common";
import { ProjectController, GraphqlController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import * as path from "path";

export default class Use extends BaseCommand {

    private accountId: string;

    async run(): Promise<any> {
        UserDataStorage.saveAccount(this.accountId);
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.accountId = config.getParameter("a");
    }

    usage(): string {
        return `-a <account_id> set account id to use`;
    }

    name(): string {
        return "use";
    }

    onSuccess(): string {
        return "use account = " + this.accountId;
    }

}