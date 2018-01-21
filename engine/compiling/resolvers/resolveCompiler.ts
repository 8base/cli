import { FunctionDefinition } from "../definitions";
import { ICompiler } from "../../../interfaces/ICompiler";
import { TypescriptCompiler } from "../compilers";
import * as _ from "lodash";

export function resolveCompiler(functions: FunctionDefinition[]): ICompiler {
    return new TypescriptCompiler(getPaths(functions));
}


function getPaths(funcs: FunctionDefinition[]):string[] {
    return _.transform<FunctionDefinition, string>(funcs, (result, func) => {
        result.push(func.handler.path);
    },[]);
}