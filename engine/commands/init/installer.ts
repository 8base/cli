import * as path from "path";
import * as fs from "fs";
import { trace } from "../../../common";

export function installFiles(targerDirectory: string, files: Map<string, string>) {
    files.forEach((data, name) => {
        const fullName = path.join(targerDirectory, name);
        const fullPath = path.dirname(fullName);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath);
        }

        fs.writeFileSync(fullName, data);
    });
}