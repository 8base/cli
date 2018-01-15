const IUserDataStorage = jest.genMockFromModule<any>("../../interfaces/IUserDataStorage").default;

let token: string;

class MockUserDataStorage extends IUserDataStorage {

    saveToken(token: string) {
        token = token;
    }

    getToken(): string {
        return token;
    }

}