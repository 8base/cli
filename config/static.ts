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

    static get webClientAddress(): string {
        return this.staticData.webClientAddress;
    }

    static get serviceConfigFileName(): string {
        return path.join(this.staticData.executionDir, "8base.yml");
    }

    static get packageFileName(): string {
        return "package.json";
    }

    static get functionWrapperPath(): string {
        return this.staticData.functionWrapperPath;
    }

    /**
     * Compiler paths
     */

    // static buildRootDir = '.build';

    static buildRootFolder = '.build';
    static buildDistFolder = '/dist';
    static modulesFolder = 'node_modules';

    static buildRootDirPath = path.join(StaticConfig.rootExecutionDir, StaticConfig.buildRootFolder);

    static buildDistPath = path.join(StaticConfig.buildRootDirPath, StaticConfig.buildDistFolder);
    static summaryDir = path.join(StaticConfig.buildRootDirPath, '/summary');

    static compiledPath = path.join(StaticConfig.buildRootDirPath, '/compiled');

    static FunctionHandlerExt = ".js";


    static supportedCompileExtension = new Set<string>([".ts", ".js"]);
}