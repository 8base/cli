import * as path from "path";
import * as ts from 'typescript';



export default class TypescriptCompiler {
    buildDir: string;
    definitionDir: string;

    //
    // async getFileNames() {
    //   return globby(['**/*.js', '**/*.ts', '!node_modules', '!**/node_modules'], {cwd: this.buildDir})
    // }

      /**
       * 1. determine ts, js, c++, python, java files.
       * 2. get provider for each extension
       * 3. resolve dependence
       * 4. determine set of functions from yml
       * 5. compile all
       * 6. determine schema files
       */

      /*
      debug('starting compile', fileNames)

      const program = ts.createProgram(fileNames, this.config)
      debug('created program')

      const emitResult = program.emit()
      debug('emitted')

      const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

      allDiagnostics.forEach(diagnostic => {
        if (!diagnostic.file) {
          console.log(diagnostic)
        }
        const {line, character} = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!)
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        console.log(`${diagnostic.file!.fileName} (${line + 1},${character + 1}): ${message}`)
      })

      if (emitResult.emitSkipped) {
        throw new Error('Typescript compilation failed')
      }

      return emitResult.emittedFiles
      */


    get config(): ts.CompilerOptions {
      return {
        ...baseCompilerOptions,
        lib: ['lib.es2017.d.ts'],
        rootDir: this.definitionDir,
        outDir: this.buildDir,
        typeRoots: [
          path.join('this-folder', 'does-not-exist'),
          path.join(__dirname, '../../../../node_modules/@types'),
          path.join(__dirname, '../../../../../../node_modules/@types'),
          path.join(this.definitionDir,  'typings'),
          path.join(this.definitionDir,  'node_modules/@types'),
        ]
      };
    }
  }

  export const baseCompilerOptions = {
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