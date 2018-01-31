import { BaseCommand } from "../base";
import { ExecutionConfig, debug, trace, StaticConfig, ProjectDefinition } from "../../../common";
import { ProjectController, BuildController, ArchiveController, RemoteActionController } from "../../../engine";
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

        const buildDir = await BuildController.compile(this.project);
        debug("build dir = " + buildDir);

        const archiveBuildPath = await ArchiveController.archive(
                buildDir.build,
                StaticConfig.buildRootDir,
                "build");

        const archiveSummaryPath = await ArchiveController.archive(
            buildDir.summary,
            StaticConfig.buildRootDir,
            "summary");

        await RemoteActionController.deploy(
            archiveBuildPath,
            archiveSummaryPath,
            BuildController.generateBuildName(),
            account.accountId);

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