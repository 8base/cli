import * as fs from "fs-extra";
import * as path from 'path';
import * as glob from "glob";
import { FunctionDefinition } from "../../interfaces/Extensions";
import { ProjectController } from "./projectController";
import { getCompiler } from "../compilers";
import { Context } from "../../common/context";
import { StorageParameters } from "../../consts/StorageParameters";
import { Selectors } from "../../common/selectors";


export class BuildController {

    static async compile(context: Context): Promise<{ build: string, summary: string, compiledFiles: string[] }> {

        BuildController.clean(context);

        const files = ProjectController.getFunctionSourceCode(context);

        BuildController.prepare(context);

        context.logger.debug("resolve compilers");
        const compiler = getCompiler(files, context);

        const compiledFiles = await compiler.compile(context.config.buildDir);
        context.logger.debug("compiled files = " + compiledFiles);

        BuildController.makeFunctionHandlers(context.project.extensions.functions, context);

        ProjectController.saveMetaDataFile(context.project, context.config.summaryDir);

        ProjectController.saveSchema(context.project, context.config.summaryDir);

        return {
            build: context.config.buildDir,
            summary: context.config.summaryDir,
            compiledFiles
        };
    }

    /**
     * Private functions
     */

    private static makeFunctionHandlers(functions: FunctionDefinition[], context: Context) {

        functions.forEach(func => {
            context.logger.debug("process function = " + func.name);

            const ext = path.parse(func.pathToFunction).ext;

            const mask = path.join(context.config.buildDir, func.pathToFunction.replace(ext, ".*"));

            if (glob.sync(mask).length !== 1) {
                throw new Error("target compiled file " + func.pathToFunction + " not exist");
            }

            BuildController.makeFunctionWrapper(func.name, func.pathToFunction.replace(ext, ""), context);
        });
    }

    private static makeFunctionWrapper(name: string, functionPath: string, context: Context) {

        const fullWrapperFuncPath = path.join(context.config.buildDir, name.concat(context.config.FunctionHandlerExt));

        context.logger.debug("full function path = " + fullWrapperFuncPath);

        fs.writeFileSync(

            fullWrapperFuncPath,

            fs.readFileSync(context.config.functionWrapperPath)
                .toString()
                .replace("__functionname__", functionPath)
                .replace("__remote_server_endpoint__", Selectors.getServerAddress(context))
        );

        context.logger.debug("write func wrapper compete");
    }

    private static clean(context: Context) {
        fs.removeSync(context.config.buildRootDir);
    }

    private static prepare(context: Context) {
        fs.mkdirpSync(context.config.buildDir);
        fs.mkdirpSync(context.config.summaryDir);
    }
}


