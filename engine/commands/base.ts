import { ExecutionConfig } from "../../engine";

export abstract class BaseCommand {
    /*async*/ abstract run(): Promise<any>;

    usage(): string {
        return "command " + this.name() + " " + this.usageSpecific();
    }

    protected abstract usageSpecific(): string;
    abstract init(config: ExecutionConfig): any;
    abstract name(): string;
}