import { ICompiler } from "../../../interfaces/ICompiler";
import * as fs from "fs";
import { StaticConfig } from "../../../config";
import * as path from "path";

export class TypescriptCompiler implements ICompiler {

    async compile(buildDir: string): Promise<string[]> {
        const hello = path.join(StaticConfig.buildDir, "hello.js");
        const hello2 = path.join(StaticConfig.buildDir, "hello2.js");

        fs.writeFileSync(hello, `
            const handler = require('./handler');
            const filename = "hello-handler.js";
            module.exports.handler = (event, context, callback) => {
                return handler(event, context, callback, filename);
            };
        `);

        fs.writeFileSync(hello2, `
            const handler = require('./handler');
            const filename = "hello2-handler.js";
            module.exports.handler = (event, context, callback) => {
                return handler(event, context, callback, filename);
            };
        `);

        return [hello, hello2];
    }

}