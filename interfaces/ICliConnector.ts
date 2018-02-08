import { UserLoginData, RefreshTokenDataReq, RefreshTokenDataResp } from "../common";


export abstract class ICliConnector {

    abstract async login(session: string, email?: string, password?: string): Promise<any>;

    abstract async getUserLoginToken(session: string): Promise<any>;

    abstract async reauth(data: RefreshTokenDataReq): Promise<RefreshTokenDataResp>;

    abstract async getDeployUrl(sourceFilePath: string): Promise<any>;

    abstract async deployShema(build: string): Promise<any>;

    abstract async invoke(): Promise<any>;
}