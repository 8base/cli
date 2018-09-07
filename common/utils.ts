import { debug } from "../common";
import * as path from "path";
import 'isomorphic-fetch';
import * as request from "request";

export class Utils {
    static undefault (m: any) {
        return m.default ? m.default : m;
    }

    static trycatch(cmd: any, error?: string): any {
        try {
            return cmd();
        } catch(err) {
            debug(err);
            throw new Error(error ? error : err);
        }
    }

    static installFiles(targetDirectory: string, files: Map<string, string>, fs: any): string {
        files.forEach((data, name) => {
            const fullName = path.join(targetDirectory, name);
            const fullPath = path.dirname(fullName);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath);
            }

            fs.writeFileSync(fullName, data);
            debug("install file = " + fullName);
        });
        return targetDirectory;
    }

    static async upload(url: any, filepath: any): Promise<any> {
        const data = fs.readFileSync(filepath);
        debug("start upload file....");
        return new Promise<any>((resolve, reject) => {
            request({
                method: "PUT",
                url: url,
                body: data,
                headers: {
                    'Content-Length': data.length
                }
            },
            (err: any, res: any, body: any) => {
                if (err) {
                    return reject(err);
                }
                if (res && res.statusCode !== 200 ) {
                    return reject(new Error(res.body));
                }
                debug("upload file \"" + filepath + "\" success");
                resolve(path.basename(filepath));
            });
        });
    }
}
