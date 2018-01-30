import * as fs from "fs";
import * as path from "path";
import { debug } from "../tracer";
import { PredefineData } from "./predefineData";


export class StaticConfig {

    private static staticData = new PredefineData();

    static get templatePath(): string {
        return this.staticData.templatePath;
    }

    static get rootProjectDir(): string {
        return this.staticData.projectDir;
    }

    static get rootExecutionDir(): string {
        return this.staticData.executionDir;
    }

    static get commandsDir(): string {
        return this.staticData.commandsPath;
    }

    static get homePath() {
        return process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
    }

    static get remoteServerCliEndPoint(): string {
        return "http://localhost:3000/cli"; // TODO
    }

    static get serviceConfigFileName(): string {
        return "8base.yml";
    }

    static get packageFileName(): string {
        return "package.json";
    }

    static get lambdaHandlerPath(): string {
        return path.join(StaticConfig.rootProjectDir, "/common/lambdaHandler.js");
    }
    /**
     * Compiler paths
     */

    static buildRootDir = path.join(StaticConfig.rootExecutionDir, '.build');

    static buildDir = path.join(StaticConfig.buildRootDir, '/dist');

    static supportedCompileExtension = new Set<string>([".ts", ".js"]);
}