import * as fs from "fs-extra";
import * as path from 'path';
import { debug, FunctionDefinition, ProjectDefinition, StaticConfig } from "../../common";
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

        const compiledFiles = await compiler.compile(StaticConfig.buildDir) as string[];
        debug("compiled files = " + compiledFiles);

        BuildController.makeFunctionHandlers(ProjectController.getFunctions(project));

        BuildController.saveHandler(StaticConfig.buildDir);

        ProjectController.saveMetaDataFile(project, StaticConfig.summaryDir);

        ProjectController.saveSchema(project, StaticConfig.summaryDir);

        return {
            build: StaticConfig.buildDir,
            summary: StaticConfig.summaryDir
        };
    }

    /**
     * Private functions
     */

    private static makeFunctionHandlers(functions: FunctionDefinition[]) {

        functions.forEach(func => {
            debug("process function = " + func.name);

            const targetFunctionPath = path.join(StaticConfig.buildDir, func.handler.value());

            if (!fs.existsSync(targetFunctionPath)) {
                throw new Error("target compiled file " + targetFunctionPath + " not exist");
            }

            const fullWrapperFuncPath = path.join(StaticConfig.buildDir, path.basename(func.handler.value()));

            debug("full function path = " + fullWrapperFuncPath);

            debug("read function wrapper");
            let wrapper = fs.readFileSync(StaticConfig.functionWrapperPath);
            const updatedWrapper = wrapper.toString().replace("__functionname__", func.handler.value() );
            debug("prepare wrapper complete");

            fs.writeFileSync(fullWrapperFuncPath, updatedWrapper);
            debug("write func wrapper compete = " + fullWrapperFuncPath);
        });
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

    private static prepare() {
        fs.mkdirpSync(StaticConfig.buildDir);
        fs.mkdirpSync(StaticConfig.summaryDir);
    }
}


