import { AccountLoginData } from "../common";

export abstract class ICliConnector {

    abstract async login(user?: string, password?: string): Promise<AccountLoginData>;

    abstract async getDeployUrl(sourceFilePath: string): Promise<any>;

    abstract async registrateShema(build: string): Promise<any>;

    abstract async invoke(): Promise<any>;
}