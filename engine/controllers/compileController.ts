import * as fs from "fs-extra";
import * as path from 'path';
import { debug } from "../../common";
import * as _ from 'lodash';
import { resolveCompiler } from "../../engine";


export class CompileController {

    static async compile(files: string[], buildDir: string): Promise<any> {
        const distPath = path.join(buildDir, '/dist');

        this.prepareForCompile(buildDir, distPath);

        debug("resolve compilers");
        const compiler = resolveCompiler(files);

        const createdFiles = await compiler.compile(buildDir) as string[];
        debug("new files created count = " + createdFiles.length);

        return distPath;
    }

    private static prepareForCompile(buildDir: string, distPath: string) {
        fs.removeSync(buildDir);
        fs.mkdirpSync(distPath);
    }
}


