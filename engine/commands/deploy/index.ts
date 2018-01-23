import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig } from "../../../common";
import { ProjectController, CompileController, LambdaController, ArchiveController, ConnectionController, ProjectDefinition } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import { di } from "../../../DI";
import { IConnector } from "../../../interfaces";

export default class Deploy extends BaseCommand {

    private project: ProjectDefinition;

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

        const files = ProjectController.getFunctionFiles(this.project);

        const result = await CompileController.compile(files, StaticConfig.buildDir);

        await LambdaController.prepareAwsLambda(StaticConfig.buildDir);


        const resultArchive = await ArchiveController.archive(StaticConfig.buildDir, StaticConfig.zipPath, ["*.zip"]);


        const connector = di.instance(IConnector) as IConnector;

        await connector.upload(resultArchive);
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.config = config;
        this.project = await ProjectController.initialize(config);
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