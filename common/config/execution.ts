
import * as parseArgs from "minimist";
import { debug } from '../../common';
import * as _ from 'lodash';
import { InvalidArgument } from '../../errors/invalidArgument';


export class ExecutionConfig {

    private mockOptions: any;
    private parameters = new Map<string, string>();
    private cmd: string;
    private cmdParameterIndex = 0;

    constructor(parameters: Array<string>, mockOptions?: any) {
        this.cmd = parameters[this.cmdParameterIndex];

        if (_.isNil(this.cmd)) {
            throw new InvalidArgument("command");
        }

        _.map(parseArgs(parameters), (value, key) => this.parameters.set(key, value));

        this.mockOptions = _.isNil(mockOptions) ? {} : mockOptions;
    }

    get command() {
        return this.cmd;
    }

    getParameter(name: string): string {
        return this.parameters.get(name);
    }

    get mock() {
        return this.mockOptions;
    }
}

