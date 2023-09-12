export abstract class ICompiler {
  // @ts-ignore
  abstract async compile(buildDir: string): Promise<string[]>;
}
