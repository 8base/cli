import * as archiver from "archiver";
import { debug } from '../../common';
import * as fs from "fs";
import * as readdir from "recursive-readdir";
import * as path from "path";

export class ArchiveController {


    static async archive(sourcePath: string, targetFile: string, filters: string[]) {
        const zip = archiver("zip", {});
        const write = fs.createWriteStream(targetFile);

        zip.pipe(write);

        zip.on('error', (err: any) => {
            debug('Error while zipping build: ' + err);
        });

        const files = await readdir(sourcePath, filters);

        files.forEach((file: any) => {
            debug("archive files = " + file);
            zip.file(file, { name: path.basename(file) });
        });

        zip.finalize();

        return targetFile;
    }
}