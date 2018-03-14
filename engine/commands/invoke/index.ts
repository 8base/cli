import { trace, debug, StaticConfig, ExecutionConfig } from "../../../common";
import { BaseCommand } from "../base";
import { RemoteActionController } from "../../controllers";
import * as _ from "lodash";
import { InvalidArgument } from '../../../errors';
import * as fs from "fs";
import { getCliConnector } from "../../connectors";


export default class Invoke extends BaseCommand {

    private functionName: string;

    private args: any;

    private async: boolean;

    private response: any;

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.functionName = config.getParameter("f");
        this.async = config.isParameterPresent("async");

        if (_.isNil(this.functionName)) {
            throw new InvalidArgument("function name");
        }

        this.args = config.getParameter("data");
        if (_.isNil(this.args)) {
            const p = config.getParameter("args_path");
            this.args = _.isNil(p) ? null : fs.readFileSync(p);
        }

        this.args = _.escape(JSON.stringify(JSON.parse(this.args)));
    }

    async run(): Promise<any> {
        this.response = await RemoteActionController.invoke(this.functionName, this.args, this.async);
    }

    onSuccess(): string {
        return "invoke function result = " + JSON.stringify(this.response, null, 2);
    }

    usage(): string {
        return `-f <function_name>
                --data <JSON> input arguments as JSON data
                --args_path <path_to_file> path to file with arguments`;
    }

    name(): string {
        return "invoke";
    }

}
