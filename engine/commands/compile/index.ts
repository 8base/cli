import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { CompileController, ProjectController, ArchiveController, LambdaController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";

export default class Compile extends BaseCommand {

    private config: ExecutionConfig;

    private project: ProjectDefinition;

    private archive = false;

    async run(): Promise<any> {
        const files = ProjectController.getFunctionHandlers(this.project);

        CompileController.clean(StaticConfig.buildRootDir);

        const result = await CompileController.compile(files, StaticConfig.buildDir);

        await LambdaController.prepareFunctionHandlers(StaticConfig.buildDir, ProjectController.getFunctions(this.project));

        if (this.archive) {
            await ArchiveController.archive(
                    StaticConfig.buildDir,
                    StaticConfig.buildRootDir);
        }
        debug("result file = " + result);
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.config = config;
        this.project = await ProjectController.initialize(config);
        this.archive = !!config.getParameter('a');
    }

    usage(): string {
        return "";
    }

    name(): string {
        return "compile";
    }

    onSuccess(): string {
        return "compile complete successfully";
    }

}