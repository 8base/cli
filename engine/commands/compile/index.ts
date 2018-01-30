import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { CompileController, ProjectController, ArchiveController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";

export default class Compile extends BaseCommand {

    private config: ExecutionConfig;

    private project: ProjectDefinition;

    private archive = false;

    async run(): Promise<any> {
        const files = ProjectController.getFunctionFiles(this.project);

        CompileController.clean(StaticConfig.buildRootDir);

        const result = await CompileController.compile(files, StaticConfig.buildDir);

        if (this.archive) {
            await ArchiveController.archive(
                    StaticConfig.buildDir,
                    StaticConfig.buildRootDir,
                    CompileController.generateBuildName());
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