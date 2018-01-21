import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace } from "../../../common";
import { CompileController, LambdaController, ArchiveController, ConnectionController } from "../../controllers";
import { CompileProject } from "../../compiling";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import { di } from "../../../DI";
import { IConnector } from "../../../interfaces";

export default class Deploy extends BaseCommand {

    private project: CompileProject;
    private config: ExecutionConfig;

    /**
     * 1. compile project
     * 2. ensure token
     * 3. zip files
     * 4. get temporary url
     * 5. upload zip to remote host
     */
    async run(): Promise<any> {

        await ConnectionController.autorizate();

        const build = await CompileController.compile(this.project);

        const connector = di.getObject(IConnector) as IConnector;

        const url = await connector.getTemporaryUrlToUpload();

        await connector.deploy(url, this.project, build);
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.project = await CompileController.initializeProject(config);
        this.config = config;
    }

    usage(): string {
        return "";
    }

    name(): string {
        return "deploy";
    }

    onSuccess(): string {
        return "deploy complete successfully";
    }

}