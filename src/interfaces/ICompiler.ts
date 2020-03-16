export abstract class ICompiler {
  abstract async compile(buildDir: string): Promise<string[]>;
}
