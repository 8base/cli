import * as archiver from "archiver";
import { debug } from '../../common';
import * as fs from "fs";
import * as readdir from "recursive-readdir";
import * as path from "path";

export class ArchiveController {

    private static async createZip(files: any, targetFile: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const zip = archiver("zip", {});
            const write = fs.createWriteStream(targetFile);

            zip.pipe(write);

            files.forEach((file: any) => {
                debug("archive files = " + file);
                zip.file(file, { name: path.basename(file), prefix: "node" });
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
                resolve();
            });

            zip.finalize(); // ?????
        });
    }

    static async archive(sourcePaths: string[], outDir: string, buildName: string, filters?: string[]) {
        sourcePaths.map(p => debug("archive source path = " + p));

        const fullPath = path.join(outDir, buildName + '.zip');

        debug("archive dest path = " + fullPath);
        const files = ( await Promise.all( sourcePaths.map( async (p) => {
            return await readdir(p, filters);
        })))
            .reduce<string[]>((res, f) => {
                return res.concat(f);
            }, []);

        console.log("files count = " + files.length);
        await ArchiveController.createZip(files, fullPath);
        return fullPath;
    }
}