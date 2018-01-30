
class UserDataStorage {

    private static token: string;

    static saveToken(token: string) {
        this.token = token;
    }

    static getToken(): string {
        return this.token;
    }
}