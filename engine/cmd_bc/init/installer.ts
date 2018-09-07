import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";

import { trace, Utils } from "../../../common";

export function install(targetDirectory: string, repositoryName: string, files: Map<string, string>): string {
    const fullPath = path.join(targetDirectory, repositoryName);

    trace("\nStart initialize repository with name \"" + repositoryName + "\" into path " + fullPath);

    Utils.trycatch(_.bind(fs.mkdirSync, fs, fullPath), "Repository \"" + repositoryName + "\" already exist");

    return Utils.installFiles(fullPath, files, fs);
}