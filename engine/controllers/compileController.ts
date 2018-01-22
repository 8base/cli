import * as fs from 'fs-extra';
import * as path from 'path';
import { trace, debug, StaticConfig, ExecutionConfig } from "../../common";
import { CompileProject, resolveFunctionCode, FunctionDefinition, resolveCompiler } from "../compiling";
import * as _ from 'lodash';
import { LambdaController, ArchiveController } from "../controllers";

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

        debug("resolve compilers");
        const compiler = resolveCompiler(resolveFunctionCode(project.functions), StaticConfig.buildDir);

        const createdFiles = await compiler.compile() as string[];
        debug("new files created count = " + createdFiles.length);

        await LambdaController.prepareAwsLambda(project);

        return await ArchiveController.archive(StaticConfig.dotBuildDir, StaticConfig.zipPath, ["*.zip", "*.yml", "*.graphql"]);
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


