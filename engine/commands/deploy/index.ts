import { BaseCommand } from "../base";
import { ExecutionConfig, debug, StaticConfig, ProjectDefinition } from "../../../common";
import { ProjectController, BuildController, ArchiveController, RemoteActionController, GraphqlController } from "../../../engine";
import * as path from "path";

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

        const archiveBuildPath = await ArchiveController.archive(
                [ { source: buildDir.build }, { source: StaticConfig.modules, dist: "node_modules" } ],
                StaticConfig.buildRootDir,
                "build");

        const archiveSummaryPath = await ArchiveController.archive(
            [{ source: buildDir.summary }],
            StaticConfig.buildRootDir,
            "summary");

        await RemoteActionController.deploy(
            archiveBuildPath,
            archiveSummaryPath,
            BuildController.generateBuildName());

        debug("deploy success");
    }

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.schemaValidate = config.isParameterPresent("validate_schema");
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