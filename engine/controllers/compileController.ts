import * as fs from "fs-extra";
import * as path from 'path';
import { debug } from "../../common";
import { getCompiler } from "../compilers";


export class CompileController {

    static async compile(files: string[], buildDir: string): Promise<any> {

        this.prepareForCompile(buildDir);

        debug("resolve compilers");
        const compiler = getCompiler(files);

        const createdFiles = await compiler.compile(buildDir) as string[];
        debug("new files created count = " + createdFiles.length);

        return buildDir;
    }

    static generateBuildName(): string {
        return `build_${Date.now()}`;
    }

    static clean(buildDir: string) {
        fs.removeSync(buildDir);
    }

    private static prepareForCompile(buildDir: string) {
        fs.removeSync(buildDir);
        fs.mkdirpSync(buildDir);
    }
}


