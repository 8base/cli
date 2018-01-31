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

        const files = ProjectController.getFunctionHandlers(project);

        BuildController.prepare();

        debug("resolve compilers");
        const compiler = resolveCompiler(files);

        const compiledFiles = await compiler.compile(StaticConfig.compileDir) as string[];
        debug("compiled files = " + compiledFiles);

        BuildController.prepareFunctionHandlers(compiledFiles, ProjectController.getFunctions(project), StaticConfig.buildDir);

        return {
            build: StaticConfig.buildDir,
            summary: StaticConfig.summaryDir
        };
    }

    private static prepareFunctionHandlers(compiledFiles: string[], functions: FunctionDefinition[], outDir: string) {

        const compiledFilesMap = _.transform(compiledFiles, (res, file: string, index: number) => {
            const name = path.basename(file, path.extname(file));
            res[name] = file;
        }, {});

        debug("compiled file map " + JSON.stringify(compiledFilesMap, null, 2));

        let summarySchema = "";
        let summaryFuncInfo = <any>[];

        functions.forEach(func => {
            const funcname = BuildController.processFunction(func, compiledFilesMap, outDir);

            debug("concat shema = " + func.schema);
            const schemaPath = path.join(StaticConfig.rootExecutionDir, func.schema);

            if (!fs.existsSync(schemaPath)) {
                throw new Error("Schema path \"" + schemaPath + "\" not present");
            }

            summarySchema += fs.readFileSync(schemaPath) + "\n";

            summaryFuncInfo.push({
                name: func.name,
                type: func.type.toString(),
                handler: func.name + ".handler"
            });
        });

        debug("process functions complete");

        // write base handler
        const handlerFile = path.join(outDir, path.basename(StaticConfig.functionHandlerPath));
        fs.copyFileSync(StaticConfig.functionHandlerPath, handlerFile);


        // write summary schema
        const graphqlFilePath = path.join(StaticConfig.summaryDir, 'schema.graphql');
        fs.writeFileSync(graphqlFilePath, summarySchema);


        // write summary function data
        const summaryFile = path.join(StaticConfig.summaryDir, '__summary__functions.json');
        fs.writeFileSync(summaryFile, JSON.stringify(summaryFuncInfo, null, 2));
    }

    static generateBuildName(): string {
        return `build_${Date.now()}`;
    }

    private static clean() {
        fs.removeSync(StaticConfig.buildRootDir);
    }

    private static processFunction(func: FunctionDefinition, compiledFiles: any, outDir: string) {
        // TODO separate function!

        debug("process function = " + func.name);
        const nameNoExt = path.basename(func.handler.code, path.extname(func.handler.code));

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


