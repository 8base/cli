const IRemoteConnector = jest.genMockFromModule<any>('../IRemoteConnector').default;

export class RemoteConnector extends IRemoteConnector {
    
        async checkToken(user: string, token: string): Promise<boolean> {
            return true;
        }
    
        async login(user: string, password: string): Promise<string> {
            return "mocktoken";
        }
    }