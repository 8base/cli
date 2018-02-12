let sessionData = {} as any;

export class ServerConnector {

        async login(session: string, user: string, password: string): Promise<any> {
            sessionData[session] = {
                complete: true,
                success: true,
                accessToken: "accesstesttoken",
                idToken: "testidtoken",
                refreshToken: "refreshToken"
            };
        }

        async getUserLoginToken(session: string): Promise<any> {
            return sessionData[session];
        }
    }