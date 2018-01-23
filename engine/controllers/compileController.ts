import * as fs from 'fs-extra';
import * as path from 'path';
import { trace, debug, StaticConfig, ExecutionConfig } from "../../common";
import { CompileProject, resolveCompiler } from "../compiling";
import * as _ from 'lodash';

export class CompileController {

    static async compile(files: string[], buildDir = StaticConfig.buildDir): Promise<any> {

        this.prepareForCompile(buildDir);

        debug("resolve compilers");
        const compiler = resolveCompiler(files);

        const createdFiles = await compiler.compile(buildDir) as string[];
        debug("new files created count = " + createdFiles.length);

        return createdFiles;
    }

    private static prepareForCompile(buildDir: string) {
        fs.removeSync(buildDir);
        fs.mkdirpSync(path.join(buildDir, '/dist'));
    }
}


