import * as fs from "fs-extra";
import * as path from 'path';
import { StaticConfig, UserDataStorage } from "../../common";
import * as glob from "glob";
import { FunctionDefinition } from "../../interfaces/Extensions";
import { ProjectDefinition } from "../../interfaces/Project";
import { ProjectController } from "./projectController";
import { getCompiler } from "../compilers";
import { Context } from "../../common/Context";


export class BuildController {

    /**
     * @param files files contain function from config yml file
     * @param buildDir output build directory
     * @return list of compiled files
     */
    static async compile(context: Context): Promise<any> {

        BuildController.clean();

        const files = ProjectController.getFunctionSourceCode(context);

        BuildController.prepare();

        context.logger.debug("resolve compilers");
        const compiler = getCompiler(files, context);

        const compiledFiles = await compiler.compile(StaticConfig.buildDir);
        context.logger.debug("compiled files = " + compiledFiles);

        BuildController.makeFunctionHandlers(context.project.extensions.functions, context);

        ProjectController.saveMetaDataFile(context.project, StaticConfig.summaryDir);

        ProjectController.saveSchema(context.project, StaticConfig.summaryDir);

        return {
            build: StaticConfig.buildDir,
            summary: StaticConfig.summaryDir
        };
    }

    /**
     * Private functions
     */

    private static makeFunctionHandlers(functions: FunctionDefinition[], context: Context) {

        functions.forEach(func => {
            context.logger.debug("process function = " + func.name);

            const ext = path.parse(func.pathToFunction).ext;

            const mask = path.join(StaticConfig.buildDir, func.pathToFunction.replace(ext, ".*"));

            if (glob.sync(mask).length !== 1) {
                throw new Error("target compiled file " + func.pathToFunction + " not exist");
            }

            BuildController.makeFunctionWrapper(func.name, func.pathToFunction.replace(ext, ""), context);
        });
    }

    private static makeFunctionWrapper(name: string, functionPath: string, context: Context) {

        const fullWrapperFuncPath = path.join(StaticConfig.buildDir, name.concat(StaticConfig.FunctionHandlerExt));

        context.logger.debug("full function path = " + fullWrapperFuncPath);

        fs.writeFileSync(

            fullWrapperFuncPath,

            fs.readFileSync(StaticConfig.functionWrapperPath)
                .toString()
                .replace("__functionname__", functionPath)
                .replace("__remote_server_endpoint__", UserDataStorage.getValue("remoteAddress"))
        );

        context.logger.debug("write func wrapper compete");
    }

    private static clean() {
        fs.removeSync(StaticConfig.buildRootDir);
    }

    private static prepare() {
        fs.mkdirpSync(StaticConfig.buildDir);
        fs.mkdirpSync(StaticConfig.summaryDir);
    }
}


