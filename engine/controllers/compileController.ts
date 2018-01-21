import * as path from 'path';
import { trace, debug, StaticConfig, ExecutionConfig } from "../../common";
import { CompileProject, resolveFunctionCode, FunctionDefinition, resolveCompiler } from "../compiling";
import * as _ from 'lodash';
import {  } from 'src/engine';

// const debug = require('debug')('ts-builder')

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
    static async compile(project: CompileProject) {

        let functions = project.functions;

        debug("resolve function code");
        functions = resolveFunctionCode(functions);

        debug("resolve compilers");
        const compiler = resolveCompiler(functions);

        compiler.compile();

        debug("compile complete");
    }

    static async initializeProject(config: ExecutionConfig): Promise<CompileProject> {
        let project = new CompileProject();
        await project.initialize();
        return project;
    }

}


