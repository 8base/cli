import { debug, trace, StaticConfig, ExecutionConfig, UserLoginData } from "../common";
import * as path from "path";
import * as fs from "fs";

class Storage {
    private static storageFileName = ".8baserc";

    /**
     *  path to storage file is persistent
     */
    private static get pathToStorage(): string {
        return path.join(StaticConfig.homePath, this.storageFileName);
    }

    /**
     * Fucntion check exist and create storage file.
     *
     * @returns path to instanced repository file
     */
    private static checkStorageExist() {
        const storagePath = this.pathToStorage;
        debug("storage instance by path = " + storagePath);
        if (!fs.existsSync(storagePath)) {
            debug("create new storage");
            fs.writeFileSync(storagePath, "{}");
        }
    }

    private static parseStorageData(): any {
        return JSON.parse(fs.readFileSync(this.pathToStorage).toString());
    }

    static getStorage() {
        this.checkStorageExist();
        return this.parseStorageData();
    }

    static saveStorage(storage: any) {
        fs.writeFileSync(this.pathToStorage, this.toPrettyString(storage));
    }

    static toPrettyString(storage: any) {
        return JSON.stringify(storage, null, 2);
    }
}

export class UserDataStorage {

    /**
     * Function is not thread safe !
     * @param token - user token
     */
    static saveAuth(data: UserLoginData) {
        const storage = Storage.getStorage();
        storage.auth = data;
        debug("data to save = " + Storage.toPrettyString(storage));
        Storage.saveStorage(storage);
    }

    static saveAccount(accountId: string) {
        const storage = Storage.getStorage();
        storage.accountId = accountId;
        debug("data to save = " + Storage.toPrettyString(storage));
        Storage.saveStorage(storage);
    }

    static getData(): UserLoginData {
        const storage = Storage.getStorage();
        return storage.auth ? storage.auth : null;
    }

    static get token(): string {
        const storage = Storage.getStorage();
        return storage.auth ? storage.auth.token : null;
    }

    static get refreshToken(): string {
        const storage = Storage.getStorage();
        return storage.auth ? storage.auth.refreshToken : null;
    }

    static get accountId(): string {
        return Storage.getStorage().accountId;
    }
}