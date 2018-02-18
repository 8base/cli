import { ExecutionConfig } from "../../common";

abstract class DisplayInfo {
    abstract usage(): string;
    abstract name(): string;
    abstract onSuccess(): string;
}

export abstract class BaseCommand extends DisplayInfo {
    /**
     * @returns in case of success - command complete information
     *          in case of error - Error
     */
    abstract async run(): Promise<any>;

    description(): string {
        return "    Command \"" + this.name() + "\" " + this.usage();
    }

    async init(config: ExecutionConfig): Promise<any> {
        await this.baseInit(config);
        await this.commandInit(config);
    }

    protected abstract async commandInit(config: ExecutionConfig): Promise<any>;

    private baseInit(config: ExecutionConfig) {
        this._config = config;
    }

    protected get config(): ExecutionConfig {
        return this._config;
    }

    private _config: ExecutionConfig;
}