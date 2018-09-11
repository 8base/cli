import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";

import { Utils, debug } from "../../../common";

export function install(targetDirectory: string, files: Map<string, string>): string {

    const repositoryName: string = path.basename(targetDirectory);

    debug("\nStart initialize repository with name \"" + repositoryName + "\" into path " + targetDirectory);

    Utils.safeExecution(_.bind(fs.mkdirSync, fs, targetDirectory));

    return Utils.installFiles(targetDirectory, files, fs);
}