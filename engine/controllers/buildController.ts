import * as fs from "fs-extra";
import * as path from 'path';
import { debug, FunctionDefinition, ProjectDefinition, StaticConfig } from "../../common";
import * as _ from 'lodash';
import { resolveCompiler, ProjectController } from "../../engine";


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

        const compiledFiles = await compiler.compile(StaticConfig.compileDir) as string[];
        debug("compiled files = " + compiledFiles);

        BuildController.prepareFunctionHandlers(compiledFiles, ProjectController.getFunctions(project), StaticConfig.buildDir);

        BuildController.saveHandler(StaticConfig.buildDir);

        ProjectController.saveFunctionMetaData(project, StaticConfig.summaryDir);

        ProjectController.saveSchema(project, StaticConfig.summaryDir);

        return {
            build: StaticConfig.buildDir,
            summary: StaticConfig.summaryDir
        };
    }

    /**
     * Private functions
     */

    private static prepareFunctionHandlers(compiledFiles: string[], functions: FunctionDefinition[], outDir: string) {

        const compiledFilesMap = _.transform(compiledFiles, (res, file: string, index: number) => {
            const name = path.basename(file, path.extname(file));
            res[name] = file;
        }, {});

        debug("compiled file map " + JSON.stringify(compiledFilesMap, null, 2));

        functions.forEach(func => BuildController.processFunction(func, compiledFilesMap, outDir));
    }

    private static saveHandler(outDir: string) {
        const handlerFile = path.join(outDir, path.basename(StaticConfig.functionHandlerPath));
        fs.copyFileSync(StaticConfig.functionHandlerPath, handlerFile);
    }

    static generateBuildName(): string {
        return `build_${Date.now()}`;
    }

    private static clean() {
        fs.removeSync(StaticConfig.buildRootDir);
    }

    private static processFunction(func: FunctionDefinition, compiledFiles: any, outDir: string) {
        // TODO separate function! too hard

        debug("process function = " + func.name);
        const nameNoExt = path.basename(func.handler.value(), path.extname(func.handler.value()));

        const compiledSource = compiledFiles[nameNoExt];

        if (!compiledSource) {
            throw new Error("compile error!");
        }

        debug("found compiled source for name " + nameNoExt);

        const funcName = func.name + ".js"; // ?
        const fullFuncPath = path.join(outDir, funcName);

        debug("full function path = " + fullFuncPath);

        const handlerFuncName = func.name + "-handler.js";
        const fullFuncHandlerPath = path.join(outDir, handlerFuncName);

        debug("read function wrapper");
        let wrapper = fs.readFileSync(StaticConfig.functionWrapperPath);
        wrapper = wrapper.toString().replace("__functionname__", handlerFuncName);
        debug("prepare wrapper complete");

        fs.writeFileSync(fullFuncPath, wrapper);
        debug("write func wrapper compete = " + fullFuncPath);

        fs.copyFileSync(compiledSource, fullFuncHandlerPath);
        debug("write func handler compete = " + fullFuncHandlerPath);
    }

    private static prepare() {
        fs.mkdirpSync(StaticConfig.buildDir);
        fs.mkdirpSync(StaticConfig.summaryDir);
        fs.mkdirpSync(StaticConfig.compileDir);
    }
}


