import * as path from 'path';

export class ExecutionConfig {

    private commandIndex = 2;

    private parameters: Array<string>;
    private cmd: string;

    constructor(parameters: Array<string>) {
        if (parameters.length < 2) {
            throw new Error("Invalid parameters");
        }
        this.parameters = parameters;
        this.cmd = parameters[this.commandIndex];
    }

    get command() {
        return this.cmd;
    }

//    getParameter(name: string): string {
//        return this.parameters.get(name);
//    }

    get commandsDir() {
        return path.join(__dirname, '../engine/commands');
    }
}