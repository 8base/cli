
abstract class IRemoteConnector {
    abstract async login(user: string, password: string): Promise<string>;
}

class MockConnector extends IRemoteConnector {
    async login(user: string, password: string): Promise<string> {
        return "mocktocen";
    }
}

export function getRemoteConnector(): IRemoteConnector {
    return new MockConnector();
}