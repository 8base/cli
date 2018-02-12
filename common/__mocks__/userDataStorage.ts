
import { UserLoginData } from "../../common";

export class UserDataStorage {

    private static data = {} as any;

    static set auth(data: UserLoginData) {
        this.data.auth = data;
    }

    static set email(email: string) {
        this.data.email = email;
    }

    static get email(): string {
        return this.data.email;
    }

    static getData(): UserLoginData {
        return this.data.auth;
    }
}