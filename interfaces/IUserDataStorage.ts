
export default interface IUserDataStorage {
    saveToken(token: string): any;
    getToken(): string;
}