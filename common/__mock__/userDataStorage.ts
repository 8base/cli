
class UserDataStorage {

    private static token: string;

    static saveToken(token: string) {
        this.token = token;
    }

    static getToken(): string {
        return this.token;
    }

    static isTokenExist(): boolean {
        return !!this.token;
    }
}