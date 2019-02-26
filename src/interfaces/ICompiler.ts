
export abstract class ICompiler {

    async abstract compile(buildDir: string): Promise<string[]>;
}