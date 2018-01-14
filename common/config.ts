import * as path from 'path';
import * as parseArgs from "minimist";
import { trace } from '../common';
import * as _ from 'lodash';
import { InvalidArgument } from '../errors/invalidArgument';
import * as fs from "fs";

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

class StaticData {
    templatePath: string;

    private definePathToTemplate(): string {
        // TODO think about
        const p = path.join(StaticConfig.rootProjectDir, "../../template");
        return fs.existsSync(p) ? p : path.join(StaticConfig.rootProjectDir, "../template");
    }

    constructor() {
        this.templatePath = this.definePathToTemplate();
    }
}

export class StaticConfig {

    private static staticData = new StaticData();

    static get templatePath(): string {
        return this.staticData.templatePath;
    }

    static get rootProjectDir(): string {
        return __dirname;
    }

    static get rootExecutionDir(): string {
        return process.cwd();
    }

    static get commandsDir() {
        return path.join(StaticConfig.rootProjectDir, '../engine/commands');
    }

    static get homePath() {
        return process.env.USERPROFILE;
    }
}