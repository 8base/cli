export abstract class ICompiler {
  abstract compile(buildDir: string): Promise<string[]>;
}
