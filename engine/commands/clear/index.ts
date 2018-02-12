import { BaseCommand } from "../base";
import { ExecutionConfig, UserDataStorage } from "../../../common";
import { ProjectController, GraphqlController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import * as path from "path";

export default class Clear extends BaseCommand {

    async run(): Promise<any> {
        UserDataStorage.auth = null;
    }

    async init(config: ExecutionConfig): Promise<any> {
    }

    usage(): string {
        return `clear auth data`;
    }

    name(): string {
        return "clear";
    }

    onSuccess(): string {
        return "auth data has been cleared";
    }

}