import * as path from 'path';
import * as parseArgs from "minimist";
import { trace } from '../common';
import * as _ from 'lodash';

export class ExecutionConfig {

    private parameters = new Map<string, string>();
    private cmd: string;
    private cmdParameterName = 'c';

    constructor(parameters: Array<string>) {
        _.map(parseArgs(parameters), (value, key) => this.parameters.set(key, value));

        this.cmd = this.parameters.get(this.cmdParameterName);

        if (_.isNil(this.cmd)) {
            throw new Error("command type not present");
        }
    }

    get command() {
        return this.cmd;
    }

    getParameter(name: string): string {
        return this.parameters.get(name);
    }
}

export class StaticConfig {
    static get root(): string {
        return __dirname;
    }

    static get commandsDir() {
        return path.join(StaticConfig.root, '../engine/commands');
    }
}