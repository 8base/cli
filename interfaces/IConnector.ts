export abstract class IConnector {

    abstract async login(user?: string, password?: string): Promise<string>;

    abstract async upload(sourceFilePath: string): Promise<any>;

    abstract async invoke(): Promise<any>;
}