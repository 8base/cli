const IRemoteConnector = jest.genMockFromModule<any>('../../../../interfaces/IRemoteConnector').default;

export class RemoteConnector extends IRemoteConnector {

        async login(user: string, password: string): Promise<string> {
            return "mocktoken";
        }
    }