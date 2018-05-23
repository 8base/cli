import { BaseCommand } from "../base";
import { ExecutionConfig, UserDataStorage } from "../../../common";
import * as path from "path";

export default class Clear extends BaseCommand {

    private auth: boolean;
    private email: boolean;
    private all: boolean;


    async run(): Promise<any> {
        if (this.all) {
            return UserDataStorage.clearAll();
        }

        if (this.auth) {
            UserDataStorage.auth = null;
            return;
        }
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.all = config.isParameterPresent("all");
        this.auth = config.isParameterPresent("auth");
    }

    usage(): string {
        return `
            --all - clear all config data
            --auth - clear auth data`;
    }

    name(): string {
        return "clear";
    }

    onSuccess(): string {
        if (this.all) {
            return "all data has been cleared";
        }

        if (this.auth) {
            return "auth data has been cleared";
        }
    }

}