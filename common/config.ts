import * as path from 'path';
import * as parseArgs from "minimist";
import { trace } from '../common';
import * as _ from 'lodash';

export class ExecutionConfig {

    private parameters = new Map<string, string>();
    private cmd: string;
    private cmdParameterIndex = 0;

    constructor(parameters: Array<string>) {        
        this.cmd = parameters[this.cmdParameterIndex];

        if (_.isNil(this.cmd)) {
            throw new Error("command type not present");
        }

        _.map(parseArgs(parameters), (value, key) => this.parameters.set(key, value));
    }

    get command() {
        return this.cmd;
    }

    getParameter(name: string): string {
        return this.parameters.get(name);
    }
}

export class StaticConfig {

    static get rootProjectDir(): string {
        return __dirname;
    }

    static get rootExecutionDir(): string {
        return process.cwd();
    }

    static get commandsDir() {
        return path.join(StaticConfig.rootProjectDir, '../engine/commands');
    }
}