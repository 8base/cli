export abstract class ICliConnector {

    abstract async login(user?: string, password?: string): Promise<string>;

    abstract async getDeployUrl(sourceFilePath: string): Promise<any>;

    abstract async registrateShema(filename: string): Promise<any>;

    abstract async invoke(): Promise<any>;
}