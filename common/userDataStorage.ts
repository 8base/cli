import { debug, trace, StaticConfig, ExecutionConfig } from "../common";
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


interface IUserDataStorage {
    saveToken(token: string): any;
    getToken(): string;
}

class UserDataStorage implements IUserDataStorage {

    /**
     * Function is not thread safe !
     * @param token - user token
     */
    saveToken(token: string) {
        const storage = Storage.getStorage();
        storage.token = token;
        debug("data to save = " + Storage.toPrettyString(storage));
        Storage.saveStorage(storage);
    }

    getToken(): string {
        const storage = Storage.getStorage();
        debug("get storage data = " + Storage.toPrettyString(storage))
        return storage.token;
    }
}

class MockUserDataStorage implements IUserDataStorage {
    private config: ExecutionConfig;

    constructor(config: ExecutionConfig) {
        this.config = config;
    }

    saveToken(token: string) {
    }

    getToken(): string {
        return this.config.mock.token;
    }

}

export function getStorage(config: ExecutionConfig) {
    if (config.mock.login) {
        return new MockUserDataStorage(config);
    }
    return new UserDataStorage();
}