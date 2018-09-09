import { debug, StaticConfig } from "../common";
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
        if (!fs.existsSync(storagePath)) {
            debug("create new storage path = "  + storagePath);
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
    static setValues(data: { name: string, value: string} []) {
        const storage = Storage.getStorage();
        data.map(d => storage[d.name] = d.value);
        Storage.saveStorage(storage);
    }

    static getValue(name: string): string {
        const storage = Storage.getStorage();
        return storage ? storage[name] : null;
    }

    // static set idToken(token: string) {
    //     const storage = Storage.getStorage();
    //     storage.idToken = token;
    //     Storage.saveStorage(storage);
    // }

    // static get idToken(): string {
    //     const storage = Storage.getStorage();
    //     return storage ? storage.idToken : null;
    // }

    // static set account(accountId: string) {
    //     const storage = Storage.getStorage();
    //     storage.accountId = accountId;
    //     Storage.saveStorage(storage);
    // }

    // static get account(): string {
    //     return Storage.getStorage().accountId;
    // }

    // static set remoteAddress(address: string) {
    //     const storage = Storage.getStorage();
    //     storage.remoteAddress = address;
    //     Storage.saveStorage(storage);
    // }

    // static get remoteAddress(): string {
    //     const account = UserDataStorage.account;
    //     return account ? `${UserDataStorage.remoteAddressBase}/${account}` : UserDataStorage.remoteAddressBase;
    // }

    // private static get remoteAddressBase(): string {
    //     return Storage.getStorage().remoteAddress || StaticConfig.remoteAddress;
    // }



    static clearAll() {
        const storage = Storage.getStorage();
        delete storage.auth;
        delete storage.email;
        delete storage.accountId;
        delete storage.remoteCliEndpoint;
        Storage.saveStorage(storage);
    }

    static toString(): string {
        return Storage.toPrettyString(Storage.getStorage());
    }
}