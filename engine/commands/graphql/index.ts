import { BaseCommand } from "../base";
import { ExecutionConfig, debug, StaticConfig, ProjectDefinition } from "../../../common";
import { ProjectController, GraphqlController } from "../../../engine";
import * as _ from "lodash";
import * as path from "path";


export default class Graphql extends BaseCommand {

    private project: ProjectDefinition;

    private validate: boolean;

    private outDir = StaticConfig.summaryDir;

    async run(): Promise<any> {
        if (this.validate) {
            debug("validate schemas");
            GraphqlController.validateSchema(this.project);
        }

        ProjectController.saveSchema(this.project, this.outDir);

        ProjectController.saveMetaDataFile(this.project, this.outDir);
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.validate = config.isParameterPresent("validate_schema");
        this.project = await ProjectController.initialize(config);
        this.outDir = config.getParameter("o");
    }

    usage(): string {
        return `
            --validate_schema - check for schema syntax
            -o <outputpath> generate summary graphql schema and function metadata (optional)`;
    }

    name(): string {
        return "graphql";
    }

    onSuccess(): string {
        return "graphql complete successfully";
    }

}