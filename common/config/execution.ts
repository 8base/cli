
import * as parseArgs from "minimist";
import { debug } from '../../common';
import * as _ from 'lodash';
import { InvalidArgument } from '../../errors';


export class ExecutionConfig {

    private mockOptions: any;
    private parameters = new Map<string, string>();
    private cmd: string;
    private cmdParameterIndex = 0;

    constructor(parameters: Array<string>) {
        this.cmd = parameters[this.cmdParameterIndex];
        if (_.isNil(this.cmd)) {
            throw new InvalidArgument("command");
        }

        _.map(parseArgs(parameters), (value, key) => this.parameters.set(key, value));
    }

    get command() {
        return this.cmd;
    }

    getParameter(name: string): any {
        const res = this.parameters.get(name);
        return _.isNil(res) || _.isEmpty(res) ? null : res;
    }

    isParameterPresent(name: string): boolean {
        return !!this.parameters.get(name);
    }
}

