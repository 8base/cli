import * as path from 'path';
import * as fs from "fs";
import { trace, debug, StaticConfig, ExecutionConfig, FunctionDefinition } from "../../common";


export class LambdaController {

    /**
     *
     * @param buildDir - directory of compiled project
     */
    static async prepareFunctionHandlers(buildDir: string, functions: FunctionDefinition[]) {
        functions.forEach(func => {
            this.prepareEnvFile(buildDir, func);
            this.prepareFunctionHandler(buildDir, func);
        });
    }

    private static prepareFunctionHandler(buildDir: string, func: FunctionDefinition) {
        const handlerName = path.join(buildDir, func.name + "-handler.js");
        fs.writeFileSync(handlerName, "");
        fs.copyFileSync(StaticConfig.lambdaHandlerPath, handlerName);
    }

    private static prepareEnvFile(buildDir: string, func: FunctionDefinition) {
        const funcEnvFileName = path.join(buildDir, func.name + "-env.json");

        const envData = {
            type: func.type.toString()
        };

        fs.writeFileSync(funcEnvFileName, JSON.stringify(envData, null, 2));
    }
}