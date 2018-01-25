export class ServerConnector {

        async login(user: string, password: string): Promise<string> {
            return "mocktoken";
        }
    }