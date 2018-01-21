import { FunctionDefinition, SupportedCompileExtension } from "../definitions";
import * as _ from "lodash";
import * as fs from "fs";
// import { InvalidConfiguration } from "../../../../errors";
import { StaticConfig, debug } from "../../../common";
import * as path from "path";

export function resolveFunctionCode(functions: FunctionDefinition[]): FunctionDefinition[] {
    return _.transform(functions, (result, func) => {
        if (func.handler.code) {
            return func;
        }
        if (_.isNil(func.handler.path) || !fs.existsSync(func.handler.path)) {
        //    throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "unnable to determine function \"" + func.name + "\" source code");
        }

        if (!SupportedCompileExtension.has(path.extname(func.handler.path))) {
         //   throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "function \"" + func.name + "\" have unsupported file extension");
        }

        func.handler.code = fs.readFileSync(func.handler.path, 'utf8');
    }, functions);
}