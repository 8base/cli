interface IFileProvider {
    /*async*/ provide(): Promise<Map<string, string>>;
}

class StaticFileProvider implements IFileProvider {

    async provide(): Promise<Map<string, string>> {
        return new Map<string, string>([["olo", "koko"], ["gfgf/fgfgf", "olololo"]]);
    }
}

export function getFileProvider(): IFileProvider {
    return new StaticFileProvider();
}