import { ICompiler } from "../../interfaces";
import { TypescriptCompiler } from "./tsCompiler";
import * as _ from "lodash";

export function resolveCompiler(files: string[]): ICompiler {
    return new TypescriptCompiler(files);
}