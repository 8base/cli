import * as path from "path";
import * as _ from "lodash";

import { trace, ExecutionConfig, Utils } from "../../../common";

interface IInstaller {
    install(targetDirectory: string, repositoryName: string, files: Map<string, string>): any;
}

function installFiles(targetDirectory: string, files: Map<string, string>, fs: any): string {
    files.forEach((data, name) => {
        const fullName = path.join(targetDirectory, name);
        const fullPath = path.dirname(fullName);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath);
        }

        fs.writeFileSync(fullName, data);
    });
    return targetDirectory;
}

class InstallToDirectory implements IInstaller {
    install(targetDirectory: string, repositoryName: string, files: Map<string, string>) {
        const fs = require('fs');

        const fullPath = path.join(targetDirectory, repositoryName);

        trace("\nStart initialize repository with name \"" + repositoryName + "\" into path " + fullPath);

        Utils.trycatch(_.bind(fs.mkdirSync, fs, fullPath), "Repository \"" + repositoryName + "\" already exist");

        return installFiles(fullPath, files, fs);
    }
}

class InstallToMemory implements IInstaller {
    install(targetDirectory: string, repositoryName: string, files: Map<string, string>) {
        return installFiles(path.join("/", repositoryName), files, require('memfs'));
    }
}

export function install(targetDirectory: string, repositoryName: string, files: Map<string, string>, config: ExecutionConfig): string {
    return (config.mock.fs ? new InstallToMemory() : new InstallToDirectory()).install(targetDirectory, repositoryName, files);
}