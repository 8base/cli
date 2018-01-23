import { ICompiler } from "../../../interfaces/ICompiler";
import { TypescriptCompiler } from "./typescript";
import * as _ from "lodash";

export function resolveCompiler(files: string[]): ICompiler {
    return new TypescriptCompiler(files);
}