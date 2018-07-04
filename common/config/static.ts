import * as fs from "fs";
import * as path from "path";
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

    static get remoteAddress(): string {
        return this.staticData.remoteAddress;
    }

    static get serviceConfigFileName(): string {
        return path.join(this.staticData.executionDir, "8base.yml");
    }

    static get packageFileName(): string {
        return "package.json";
    }

    static get modules(): string {
        return path.join(this.staticData.executionDir, "node_modules");
    }

    static get functionWrapperPath(): string {
        return this.staticData.functionWrapperPath;
    }

    static get applicationId(): string {
        return "mockApp";
    }

    /**
     * Compiler paths
     */

    static buildRootDir = path.join(StaticConfig.rootExecutionDir, '.build');

    static buildDir = path.join(StaticConfig.buildRootDir, '/dist');

    static FunctionHandlerExt = ".js";

    static summaryDir = path.join(StaticConfig.buildRootDir, '/summary');

    static supportedCompileExtension = new Set<string>([".ts", ".js"]);
}