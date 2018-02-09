
import { UserLoginData } from "../../common";

export class UserDataStorage {

    private static savedtoken: string;

    static saveToken(token: string) {
        this.savedtoken = token;
    }

    static get token(): string {
        return this.savedtoken;
    }

    static getData(): UserLoginData {
        return {
            accessToken: this.savedtoken,
            refreshToken: "refresh",
            idToken: this.savedtoken
        };
    }
}