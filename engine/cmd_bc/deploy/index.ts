import { BaseCommand } from "../base";
import { ExecutionConfig, debug, StaticConfig } from "../../../common";
import * as path from "path";
import { GraphqlController } from "../../controllers/graphqlController";
import { ProjectDefinition } from "../../../interfaces/Project";
import { ProjectController } from "../../controllers/projectController";
import { BuildController } from "../../controllers/buildController";
import { archive } from "../../utils/archive";

export default class Deploy extends BaseCommand {

    private project: ProjectDefinition;

    private schemaValidate: boolean;

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

        if (this.schemaValidate) {
            GraphqlController.validateSchema(this.project);
        }

        const buildDir = await BuildController.compile(this.project);
        debug("build dir = " + buildDir);

        const archiveBuildPath = await archive(
                [ { source: buildDir.build }, { source: StaticConfig.modules, dist: "node_modules" } ],
                StaticConfig.buildRootDir,
                "build");

        const archiveSummaryPath = await archive(
            [{ source: buildDir.summary }],
            StaticConfig.buildRootDir,
            "summary");

        await BuildController.deploy(
            archiveBuildPath,
            archiveSummaryPath);

        debug("deploy success");
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.schemaValidate = config.isParameterPresent("validate_schema");
        this.project = await ProjectController.initialize();

        console.log(JSON.stringify(this.project, null, 2));
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