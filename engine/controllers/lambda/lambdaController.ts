import * as path from 'path';
import { trace, debug, StaticConfig, ExecutionConfig } from "../../../common";
import { CompileProject,  FunctionDefinition } from "../../compiling";


export class LambdaController {

    static async prepareAwsLambda(project: CompileProject) {
        // TODO
        // at moment uploaded function must be description as aws standart. no like graphcool
    }
}