import * as fs from "fs";
import * as path from 'path';
import { debug } from "../../common";
import { PredefineData } from "./predefineData";


export class StaticConfig {

    private static staticData = new PredefineData();

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