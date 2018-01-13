import { trace, debug } from "../common";


export class Utils {
    static undefault (m: any) {
        return m.default ? m.default : m;
    }

    static transformError(cmd: any, error?: string): any {
        try {
            return cmd();
        } catch(err) {
            debug(err);
            throw new Error(error ? error : err);
        }
    }
}
