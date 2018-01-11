import { trace, debug, StaticConfig } from "../../../common";
import { getFileProvider } from "./providers";
import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../engine";
import * as _ from "lodash";
import { installFiles } from "./installer";
import * as path from "path";
import * as fs from "fs";

export default class Init extends BaseCommand {

    private repositoryParameterName = 'r';
    private repositoryName: string;
    private config: ExecutionConfig;

    protected usage(): string {
        return "-r <string> - name of repository";
    }

    name(): string {
        return "init";
    }

    init(config: ExecutionConfig) {
        debug("start initiailie init command");

        this.repositoryName = config.getParameter('r');
        if (_.isNil(this.repositoryName)) {
            throw new Error("Repository name is empty");
        }

        this.config = config;

        debug("initialize success: initilize repository = " + this.repositoryName);
    }

    async run() {

        let files = await getFileProvider().provide();

        try {
            const fullPath = path.join(StaticConfig.root, this.repositoryName);

            trace("start initialize repository...");

            fs.mkdirSync(fullPath);

            installFiles(fullPath, files);
        } catch(err) {
            return Promise.reject(err);
        }
    }
}
