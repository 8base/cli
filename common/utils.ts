import { trace, debug } from "../common";
import * as path from "path";

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
        });
        return targetDirectory;
    }
}
