const IUserDataStorage = jest.genMockFromModule<any>('../../interfaces/IUserDataStorage').default;

let token: string;

class MockUserDataStorage implements IUserDataStorage {



    saveToken(token: string) {
        token = token;
    }

    getToken(): string {
        return token;
    }

}