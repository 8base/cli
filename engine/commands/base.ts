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
    /*async*/ abstract run(): Promise<any>;

    description(): string {
        return "    Command \"" + this.name() + "\" " + this.usage();
    }

    abstract init(config: ExecutionConfig): any;
}