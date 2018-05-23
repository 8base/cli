import * as archiver from "archiver";
import { debug } from '../../common';
import * as fs from "fs";
import * as readdir from "recursive-readdir";
import * as path from "path";

export class ArchiveController {

    static async archive(sourceDirectories: { source: string, dist?: string } [], outDir: string, buildName: string, filters?: string[]): Promise<string> {
        const fullPath = path.join(outDir, buildName + '.zip');

        sourceDirectories.map(p => debug("archive source path = " + p));
        debug("archive dest path = " + fullPath);

        return new Promise<string>((resolve, reject) => {
            const zip = archiver("zip", { zlib: { level: 8 } });
            const write = fs.createWriteStream(fullPath);

            zip.pipe(write);

            sourceDirectories.forEach((directory) => {
                debug("archive files from directory = " + directory.source);
                zip.directory(directory.source, directory.dist ? directory.dist : "");
            });

            zip.on('error', (err: any) => {
                debug('Error while zipping build: ' + err);
                reject();
            });

            zip.on('finish', (err: any) => {
                debug('finish');
            });

            zip.on('close', (err: any) => {
                debug('close');
            });

            zip.on('end', (err: any) => {
                debug('end');
                resolve(fullPath);
            });

            zip.finalize(); // ?????
        });
    }
}