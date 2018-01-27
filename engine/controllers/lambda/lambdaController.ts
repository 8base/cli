import * as path from 'path';
import { trace, debug, StaticConfig, ExecutionConfig } from "../../../common";


export class LambdaController {

    /**
     *
     * @param buildDir - directory of compiled project
     */
    static async prepareLambdaHandlers(buildDir: string, functionNames: string[]) {
        // TODO
        // at moment uploaded function must be description as aws standart. no like graphcool
    }
}