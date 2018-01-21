import { BaseCommand } from "../base";
import { ExecutionConfig, debug, UserDataStorage, trace } from "../../../common";
import { CompileController,  } from "../../controllers";
import { CompileProject } from "../../compiling";
import { InvalidArgument } from "../../../errors";
import * as _ from "lodash";

export default class Compile extends BaseCommand {

    private project: CompileProject;
    private config: ExecutionConfig;

    async run(): Promise<any> {

        await CompileController.compile(this.project);

    }

    async init(config: ExecutionConfig): Promise<any> {
        debug("init compile command");
        this.project = await CompileController.initializeProject(config);

        this.config = config;
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