import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { getConnector, ProjectController, CompileController, LambdaController, ArchiveController, ConnectionController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";


export default class Deploy extends BaseCommand {

    private project: ProjectDefinition;

    private config: ExecutionConfig;

    /**
     * 1. ensure token
     * 2. compile project
     * 3. define function to compile
     * 4. compile it
     * 5. prepare labmda
     * 6. zip all
     * 7. upload zip to remote host
     */

    async run(): Promise<any> {

        await ConnectionController.autorizate();

        const files = ProjectController.getFunctionFiles(this.project);
        const funcNames = ProjectController.getFunctionNames(this.project);

        const distPath = await CompileController.compile(files, StaticConfig.buildDir);

        await LambdaController.prepareLambdaHandlers(distPath, funcNames);


        const resultArchive = await ArchiveController.archive(StaticConfig.buildDir, StaticConfig.zipPath, ["*.zip"]);

        const connector = getConnector();

        await connector.upload(resultArchive);

        await connector.updateConfiguration();
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