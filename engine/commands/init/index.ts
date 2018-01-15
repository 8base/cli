import { trace, debug, StaticConfig } from "../../../common";
import { getFileProvider } from "./providers";
import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../common";
import * as _ from "lodash";
import { install } from "./installer";


import { InvalidArgument } from "../../../errors/invalidArgument";


export default class Init extends BaseCommand {
    onSuccess(): string {
        return "Initialization repository with name \"" + this.repositoryName + "\" is complete successfully";
    }

    private repositoryParameterName = 'r';
    private repositoryName: string;
    private config: ExecutionConfig;

    usage(): string {
        return "-r <repository_name>";
    }

    name(): string {
        return "init";
    }

    init(config: ExecutionConfig) {
        debug("start initiailie init command");

        this.repositoryName = config.getParameter('r');

        if (!_.isString(this.repositoryName)) {
            throw new InvalidArgument('repository name');
        }

        this.config = config;

        debug("initialize success: initilize repository = " + this.repositoryName);
    }

    /**
     * @returns path to installed repository
     */
    async run() {
        try {
            let files = await getFileProvider().provide();

            debug("try to install files");
            return install(StaticConfig.rootExecutionDir, this.repositoryName, files);
        } catch(err) {
            return Promise.reject(err);
        }
    }
}
