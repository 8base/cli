
import * as path from "path";
import * as _ from "lodash";

import { trace, Utils } from "../../../../common";

export function install(targetDirectory: string, repositoryName: string, files: Map<string, string>): string {
    return Utils.installFiles(path.join("/", repositoryName), files, require('memfs'));
}