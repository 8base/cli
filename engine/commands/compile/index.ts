import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig } from "../../../common";
import { CompileController, ProjectController, ProjectDefinition } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";

export default class Compile extends BaseCommand {

    private config: ExecutionConfig;

    private project: ProjectDefinition;

    async run(): Promise<any> {
        const files = ProjectController.getFunctionFiles(this.project);

        const result = await CompileController.compile(files, StaticConfig.buildDir);

        debug("result file = " + result);
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.config = config;
        this.project = await ProjectController.initialize(config);
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