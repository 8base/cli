import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { ProjectController, CompileController, LambdaController, ArchiveController, RemoteActionController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import * as path from "path";

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

        const account = await RemoteActionController.autorizate();

        const files = ProjectController.getFunctionHandlers(this.project);

        CompileController.clean(StaticConfig.buildRootDir);
        await CompileController.compile(files, StaticConfig.buildDir);

        const functions = ProjectController.getFunctions(this.project);
        await LambdaController.prepareFunctionHandlers(StaticConfig.buildDir, functions);

        const buildPath = await ArchiveController.archive(StaticConfig.buildDir, StaticConfig.buildRootDir);

        await RemoteActionController.deployBuild(buildPath, CompileController.generateBuildName(), account.accountId);

        debug("deploy success");
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