
import { AccountLoginData } from "../../common";

export class UserDataStorage {

    private static savedtoken: string;

    static saveToken(token: string) {
        this.savedtoken = token;
    }

    static get token(): string {
        return this.savedtoken;
    }

    static getData(): AccountLoginData {
        return {
            accountId: "1",
            token: this.savedtoken
        };
    }
}