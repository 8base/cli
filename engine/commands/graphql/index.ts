import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { ProjectController, GraphqlController } from "../../../engine";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";
import * as path from "path";


export default class Graphql extends BaseCommand {

    private project: ProjectDefinition;

    private config: ExecutionConfig;

    private validate: boolean;

    async run(): Promise<any> {
        if (this.validate) {
            debug("validate schemas");
            GraphqlController.validateSchema(this.project);
        }
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.validate = config.isParameterPresent("validate_schema");
        this.config = config;
        this.project = await ProjectController.initialize(config);
    }

    usage(): string {
        return "";
    }

    name(): string {
        return "graphql";
    }

    onSuccess(): string {
        return "graphql complete successfully";
    }

}