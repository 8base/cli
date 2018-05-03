import { BaseCommand } from "../base";
import { ExecutionConfig, debug, StaticConfig, ProjectDefinition } from "../../../common";
import { BuildController, ProjectController, ArchiveController, GraphqlController } from "../../../engine";

import * as _ from "lodash";


export default class Compile extends BaseCommand {

    private project: ProjectDefinition;

    private archive = false;

    private schemaValidate: boolean;

    async run(): Promise<any>   {
        if (this.schemaValidate) {
            GraphqlController.validateSchema(this.project);
        }

        const buildDir = await BuildController.compile(this.project);
        debug("build dir = " + buildDir.build);

        if (this.archive) {
            await ArchiveController.archive(
                    [ { source: buildDir.build, dist: "" }, { source: StaticConfig.modules, dist: "node_modules" } ],
                    StaticConfig.buildRootDir,
                    "build");

            await ArchiveController.archive(
                    [{ source: buildDir.summary, dist: "" }],
                    StaticConfig.buildRootDir,
                    "summary");
        }
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.schemaValidate = config.isParameterPresent("validate_schema");
        this.project = await ProjectController.initialize(config);
        this.archive = config.isParameterPresent('a');
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