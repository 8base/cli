import * as fs from "fs-extra";
import * as path from 'path';
import { debug, StaticConfig, UserDataStorage, Utils } from "../../common";
import { resolveCompiler } from "../../engine";
import * as glob from "glob";
import { FunctionDefinition } from "../../interfaces/Extensions";
import { ProjectDefinition } from "../../interfaces/Project";
import { ProjectController } from "./projectController";

const { Client } = require("@8base/api-client");

export class BuildController {

    /**
     * @param files files contain function from config yml file
     * @param buildDir output build directory
     * @return list of compiled files
     */
    static async compile(project: ProjectDefinition): Promise<any> {

        BuildController.clean();

        const files = ProjectController.getFunctionSourceCode(project);

        BuildController.prepare();

        debug("resolve compilers");
        const compiler = resolveCompiler(files);

        const compiledFiles = await compiler.compile(StaticConfig.buildDir);
        debug("compiled files = " + compiledFiles);

        BuildController.makeFunctionHandlers(project.extensions.functions);

        ProjectController.saveMetaDataFile(project, StaticConfig.summaryDir);

        ProjectController.saveSchema(project, StaticConfig.summaryDir);

        return {
            build: StaticConfig.buildDir,
            summary: StaticConfig.summaryDir
        };
    }

    static async deploy(archiveBuildPath: string, archiveSummaryPath: string) {

        const client = new Client();

        console.log(client.request);
        // const data = await cliConnector.prepareDeploy();

        // await Utils.upload(data.summaryDataUrl, archiveSummaryPath);
        // debug("upload summary data complete");

        // await Utils.upload(data.buildUrl, archiveBuildPath);
        // debug("upload source code complete");

        // await cliConnector.deploy(data.build, UserDataStorage.applicationId);
    }

    /**
     * Private functions
     */

    private static makeFunctionHandlers(functions: FunctionDefinition[]) {

        functions.forEach(func => {
            debug("process function = " + func.name);

            const ext = path.parse(func.pathToFunction).ext;

            const mask = path.join(StaticConfig.buildDir, func.pathToFunction.replace(ext, ".*"));

            if (glob.sync(mask).length !== 1) {
                throw new Error("target compiled file " + func.pathToFunction + " not exist");
            }

            BuildController.makeFunctionWrapper(func.name, func.pathToFunction.replace(ext, ""));
        });
    }

    private static makeFunctionWrapper(name: string, functionPath: string) {

        const fullWrapperFuncPath = path.join(StaticConfig.buildDir, name.concat(StaticConfig.FunctionHandlerExt));

        debug("full function path = " + fullWrapperFuncPath);

        fs.writeFileSync(

            fullWrapperFuncPath,

            fs.readFileSync(StaticConfig.functionWrapperPath)
                .toString()
                .replace("__functionname__", functionPath)
                .replace("__remote_server_endpoint__", UserDataStorage.remoteAddress)
        );

        debug("write func wrapper compete");
    }

    private static clean() {
        fs.removeSync(StaticConfig.buildRootDir);
    }

    private static prepare() {
        fs.mkdirpSync(StaticConfig.buildDir);
        fs.mkdirpSync(StaticConfig.summaryDir);
    }
}


