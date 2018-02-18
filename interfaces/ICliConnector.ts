import { UserLoginData, RefreshTokenDataReq } from "../common";


export abstract class ICliConnector {

    abstract async login(session: string, email?: string, password?: string): Promise<any>;

    abstract async getUserLoginToken(session: string): Promise<any>;

    abstract async reauth(data: RefreshTokenDataReq): Promise<UserLoginData>;

    abstract async getDeployUrl(sourceFilePath: string): Promise<any>;

    abstract async deployBuild(build: string): Promise<any>;

    abstract async invoke(functionName: string, args: string): Promise<string>;

    abstract async listFunctions(): Promise<string[]>;
}