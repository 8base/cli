import * as archiver from "archiver";
import { debug } from '../../common';
import * as fs from "fs";
import * as readdir from "recursive-readdir";
import * as path from "path";

export class ArchiveController {

    private static async createZip(files: any, targetFile: string) {
        return new Promise((resolve, reject) => {
            const zip = archiver("zip", {});
            const write = fs.createWriteStream(targetFile);

            zip.pipe(write);

            files.forEach((file: any) => {
                debug("archive files = " + file);
                zip.file(file, { name: path.basename(file) });
            });

            zip.on('error', (err: any) => {
                debug('Error while zipping build: ' + err);
                reject();
            });

            zip.on('finish', (err: any) => {
                resolve();
            });

            zip.on('close', (err: any) => {
                resolve();
            });

            zip.on('end', (err: any) => {
                resolve();
            });

            zip.finalize();
        });
    }

    static async archive(sourcePath: string, targetFile: string, filters: string[]) {
        const files = await readdir(sourcePath, filters);
        await ArchiveController.createZip(files, targetFile);
        return targetFile;
    }
}