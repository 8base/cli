import { CompileProject } from "../engine";

export abstract class IConnector {

    abstract async login(user?: string, password?: string): Promise<string>;

    abstract async getTemporaryUrlToUpload(): Promise<string>;

    abstract async deploy(url: string, project: CompileProject, sourceFile: string);

    abstract async invoke(): Promise<any>;
}