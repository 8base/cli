import { trace, debug, StaticConfig } from "../../../common";
import { getFileProvider } from "./providers";
import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../common";
import * as _ from "lodash";
import { install } from "./installer";


import { InvalidArgument } from "../../../errors";


export default class Init extends BaseCommand {
    onSuccess(): string {
        return "Initialization repository with name \"" + this.repositoryName + "\" complete successfully";
    }

    private repositoryParameterName = 'r';
    private repositoryName: string;

    usage(): string {
        return "-r <repository_name>";
    }

    name(): string {
        return "init";
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        debug("start initiailie init command");

        this.repositoryName = config.getParameter('r');

        if (!_.isString(this.repositoryName)) {
            throw new InvalidArgument('repository name');
        }

        debug("initialize success: initilize repository = " + this.repositoryName);
    }

    /**
     * @returns path to installed repository
     */
    async run() {
        try {
            let files = await getFileProvider().provide();
            debug("files provided count = " + files.size);

            files.set(StaticConfig.packageFileName,
                this.replaceServiceName(files.get(StaticConfig.packageFileName)));

            debug("try to install files");
            return install(StaticConfig.rootExecutionDir, this.repositoryName, files);
        } catch(err) {
            return Promise.reject(err);
        }
    }

    private replaceServiceName(packageFile: string) {
        let packagedata = JSON.parse(packageFile);
        packagedata.name = this.repositoryName;
        return JSON.stringify(packagedata, null, 2);
    }
}
