import * as fs from "fs-extra";
import * as path from 'path';
import * as glob from "glob";
import { FunctionDefinition } from "../../interfaces/Extensions";
import { ProjectController } from "./projectController";
import { getCompiler } from "../compilers";
import { Context } from "../../common/context";


export class BuildController {

    /**
     * @param files files contain function from config yml file
     * @param buildDir output build directory
     * @return list of compiled files
     */
    static async compile(context: Context): Promise<{ build: string, summary: string, compiledFiles: string[] }> {

        BuildController.clean(context);

        const files = ProjectController.getFunctionSourceCode(context);

        BuildController.prepare(context);

        context.logger.debug("resolve compilers");
        const compiler = getCompiler(files, context);

        const compiledFiles = await compiler.compile(context.storage.static.buildDir);
        context.logger.debug("compiled files = " + compiledFiles);

        BuildController.makeFunctionHandlers(context.project.extensions.functions, context);

        ProjectController.saveMetaDataFile(context.project, context.storage.static.summaryDir);

        ProjectController.saveSchema(context.project, context.storage.static.summaryDir);

        return {
            build: context.storage.static.buildDir,
            summary: context.storage.static.summaryDir,
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

            const mask = path.join(context.storage.static.buildDir, func.pathToFunction.replace(ext, ".*"));

            if (glob.sync(mask).length !== 1) {
                throw new Error("target compiled file " + func.pathToFunction + " not exist");
            }

            BuildController.makeFunctionWrapper(func.name, func.pathToFunction.replace(ext, ""), context);
        });
    }

    private static makeFunctionWrapper(name: string, functionPath: string, context: Context) {

        const fullWrapperFuncPath = path.join(context.storage.static.buildDir, name.concat(context.storage.static.FunctionHandlerExt));

        context.logger.debug("full function path = " + fullWrapperFuncPath);

        fs.writeFileSync(

            fullWrapperFuncPath,

            fs.readFileSync(context.storage.static.functionWrapperPath)
                .toString()
                .replace("__functionname__", functionPath)
                .replace("__remote_server_endpoint__", context.storage.user.getValue("remoteAddress"))
        );

        context.logger.debug("write func wrapper compete");
    }

    private static clean(context: Context) {
        fs.removeSync(context.storage.static.buildRootDir);
    }

    private static prepare(context: Context) {
        fs.mkdirpSync(context.storage.static.buildDir);
        fs.mkdirpSync(context.storage.static.summaryDir);
    }
}


