import { Context } from "../common/Context";

export type CommandHandler = (params: any, context: Context) => void;

export interface IBaseCommand {
    readonly name: string;
    readonly description: string;
    readonly handler: CommandHandler;
}