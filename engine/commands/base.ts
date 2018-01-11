import { ExecutionConfig } from "../../engine";

export abstract class BaseCommand {
    /*async*/ abstract run(): Promise<any>;

    description(): string {
        return "    Command " + this.name() + " " + this.usage();
    }

    protected abstract usage(): string;
    abstract init(config: ExecutionConfig): any;
    abstract name(): string;
}