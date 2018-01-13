import { trace, debug, StaticConfig } from "../../../common";
import { getFileProvider } from "./providers";
import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../common";
import * as _ from "lodash";
import { installFiles } from "./installer";
import * as path from "path";
import * as fs from "fs";
import { Utils } from "../../../common";

export default class Init extends BaseCommand {
    onSuccess(): string {
        return "Initialization repository with name \"" + this.repositoryName + "\" is complete successfully";
    }

    private repositoryParameterName = 'r';
    private repositoryName: string;
    private config: ExecutionConfig;

    usage(): string {
        return "-r <string> - name of repository";
    }

    name(): string {
        return "init";
    }

    init(config: ExecutionConfig) {
        debug("start initiailie init command");

        this.repositoryName = config.getParameter('r');

        if (!_.isString(this.repositoryName)) {
            throw new Error("Repository name is empty");
        }

        this.config = config;

        debug("initialize success: initilize repository = " + this.repositoryName);
    }

    async run() {
        try {
            let files = await getFileProvider().provide();

            const fullPath = path.join(StaticConfig.rootExecutionDir, this.repositoryName);

            trace("\nStart initialize repository with name \"" + this.repositoryName + "\" into path " + fullPath);

            Utils.transformError(_.bind(fs.mkdirSync, fs, fullPath), "Repository \"" + this.repositoryName + "\" already exist");

            debug("try to install files");
            installFiles(fullPath, files);
        } catch(err) {
            return Promise.reject(err);
        }
    }
}
