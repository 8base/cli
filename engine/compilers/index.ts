import { ICompiler } from "../../interfaces/ICompiler";
import { TypescriptCompiler } from "./tsCompiler";
import * as _ from "lodash";

export function getCompiler(files: string[]): ICompiler {
    return new TypescriptCompiler(files);
}