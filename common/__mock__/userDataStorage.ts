
class UserDataStorage {

    private static savedtoken: string;

    static saveToken(token: string) {
        this.savedtoken = token;
    }

    static get token(): string {
        return this.savedtoken;
    }
}