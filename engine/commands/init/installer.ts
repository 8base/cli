import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";
import { Utils } from "../../../common/utils";
import { Context } from "../../../common/context";

export function install(targetDirectory: string, files: Map<string, string>, context: Context): string {

    const repositoryName: string = path.basename(targetDirectory);

    context.logger.debug(`Start initialize repository with name "${repositoryName}" into path "${targetDirectory}"`);

    Utils.safeExecution(_.bind(fs.mkdirSync, fs, targetDirectory));

    return Utils.installFiles(targetDirectory, files, fs, context);
}