import * as path from "path";
import * as ts from 'typescript';
import { ICompiler } from "../../interfaces/ICompiler";
import { StaticConfig, debug } from "../../common";

export class TypescriptCompiler implements ICompiler {

  private files: string[];

  constructor(files: string[]) {
    this.files = files;
  }

  async compile(buildDir: string): Promise<string[]> {
    debug("compile files count = " + this.files.length);
    const program = ts.createProgram(this.files, this.config(buildDir));

    const emitResult = program.emit();

    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
      if (!diagnostic.file) {
        debug(JSON.stringify(diagnostic, null, 2));
      }
      if (diagnostic.file) {
        const {line, character} = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        debug(`${diagnostic.file!.fileName} (${line + 1},${character + 1}): ${message}`);
      }
    });

    if (emitResult.emitSkipped) {
      throw new Error('Typescript compilation failed');
    }

    debug(path.join(StaticConfig.rootProjectDir, '../node_modules/@types'));
    debug(path.join(StaticConfig.rootProjectDir, './node_modules/@types'));
    return emitResult.emittedFiles;
  }

  private config(buildDir: string): ts.CompilerOptions {
    return {
      ...baseCompilerOptions,
      lib: ['lib.es2017.d.ts'],
      rootDir: StaticConfig.rootExecutionDir,
      outDir: buildDir,
      typeRoots: [
        path.join(StaticConfig.rootProjectDir, '../node_modules/@types'),
        path.join(StaticConfig.rootProjectDir, './node_modules/@types'),
        path.join(StaticConfig.rootExecutionDir,  'typings'),
        path.join(StaticConfig.rootExecutionDir,  'node_modules/@types'),
      ]
    };
  }
}

const baseCompilerOptions = {
  preserveConstEnums: true,
  strictNullChecks: true,
  sourceMap: false,
  target: ts.ScriptTarget.ES5,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  lib: ['lib.es2017.d.ts'],
  allowJs: true,
  listEmittedFiles: true,
  skipLibCheck: true,
  allowSyntheticDefaultImports: true
};