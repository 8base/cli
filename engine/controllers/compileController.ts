import * as fs from 'fs-extra';
import * as path from 'path';
import { trace, debug, StaticConfig, ExecutionConfig } from "../../common";
import { CompileProject, resolveFunctionCode, FunctionDefinition, resolveCompiler } from "../compiling";
import * as _ from 'lodash';

export class CompileController {

    /**
     *
     * 1. determine functions from yml config
     * 2. resolve functions code
     * 3. determine ts, js, c++, python, java files.
     * 4. get compiler for each extension
     * 5. compile
     * 6. determine schema files
     *
     * @param project
     */
    static async compile(project: CompileProject): Promise<any> {

        this.prepareForCompile();

        let functions = project.functions;

        debug("resolve function code");
        functions = resolveFunctionCode(functions);

        debug("resolve compilers");
        const compiler = resolveCompiler(functions, StaticConfig.buildDir);

        const createdFiles = await compiler.compile() as string[];
        debug("new files created count = " + createdFiles.length);

        debug("compile complete");
    }

    static async initializeProject(config: ExecutionConfig): Promise<CompileProject> {
        let project = new CompileProject();
        await project.initialize();
        return project;
    }

    private static prepareForCompile() {
        fs.removeSync(StaticConfig.dotBuildDir);
        fs.mkdirpSync(StaticConfig.buildDir);
    }
}


