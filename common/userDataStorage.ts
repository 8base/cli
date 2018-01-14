import { trace, StaticConfig } from "../common";
import * as path from "path";
import * as fs from "fs";

export class UserDataStorage {
    private static storageFileName = ".8baserc";

    private static checkStorageExist() {
        const storagePath = path.join(StaticConfig.homePath, this.storageFileName);
        if (!fs.existsSync(storagePath)) {
            fs.writeFileSync(storagePath, "");
        }
        return storagePath;
    }

    static saveToken(token: string) {
        const storage = this.checkStorageExist();
        // read file as json
    }
}