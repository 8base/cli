interface IProvider {
    /*async*/ provide(): Promise<Map<string, string>>;
}

class StaticFileProvider implements IProvider {

    async provide(): Promise<Map<string, string>> {
        return new Map<string, string>([["olo", "koko"]]);
    }
}

export async function provideFiles() {
    return new StaticFileProvider().provide();
}