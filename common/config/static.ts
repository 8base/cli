import * as fs from "fs";
import * as path from 'path';
import { debug } from "../../common";

class StaticData {
    templatePath: string;
    commandsPath: string;

    private definePathToTemplate(): string {
        return path.join(StaticConfig.rootProjectDir, "./template");
    }

    private defineCommandsPath(): string {
        return path.join(StaticConfig.rootProjectDir, "./engine/commands");
    }

    constructor() {
        this.templatePath = this.definePathToTemplate();
        this.commandsPath = this.defineCommandsPath();
    }
}

export class StaticConfig {

    private static staticData = new StaticData();

    static get templatePath(): string {
        return this.staticData.templatePath;
    }

    static get rootProjectDir(): string {
        return path.join(__dirname, "../../");
    }

    static get rootExecutionDir(): string {
        return process.cwd();
    }

    static get commandsDir(): string {
        return this.staticData.commandsPath;
    }

    static get homePath() {
        return process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
    }

    static get remoteServerEndPoint(): string {
        return "http://localhost:3000"; // TODO
    }

    static get loginPath(): string {
        return "/cli/login";
    }
}