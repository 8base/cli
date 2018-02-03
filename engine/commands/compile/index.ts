import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { BuildController, ProjectController, ArchiveController, GraphqlController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";


export default class Compile extends BaseCommand {

    private config: ExecutionConfig;

    private project: ProjectDefinition;

    private archive = false;

    private schemaValidate: boolean;

    async run(): Promise<any> {
        if (this.schemaValidate) {
            GraphqlController.validateSchema(this.project);
        }

        const buildDir = await BuildController.compile(this.project);
        debug("build dir = " + buildDir.build);

        if (this.archive) {
            await ArchiveController.archive(
                    buildDir.build,
                    StaticConfig.buildRootDir,
                    "build");

            await ArchiveController.archive(
                    buildDir.summary,
                    StaticConfig.buildRootDir,
                    "summary");
        }
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.schemaValidate = config.isParameterPresent("validate_schema");
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