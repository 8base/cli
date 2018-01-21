import { BaseCommand } from "../base";
import { ExecutionConfig, debug, UserDataStorage, trace } from "../../../common";
import { CompileController, LambdaController, ArchiveController } from "../../controllers";
import { CompileProject } from "../../compiling";
import { RemoteConnector } from "../../connectors";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";

export default class Deploy extends BaseCommand {

    private project: CompileProject;
    private config: ExecutionConfig;

    /**
     * 1. compile project
     * 2. ensure token
     * 3. zip files
     * 4. get temporary url
     * 5. upload zip to remote host
     */
    async run(): Promise<any> {

        if (!UserDataStorage.isTokenExist()) {
            // TODO autorization!
        }

        await CompileController.compile(this.project);

        await LambdaController.prepareAwsLambda();

        await ArchiveController.archive();

        await RemoteConnector.upload();
    }

    async init(config: ExecutionConfig): Promise<any> {
        this.project = await CompileController.initializeProject(config);
        this.config = config;
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