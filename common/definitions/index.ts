export * from "./project";

export class CompileDefinitions {

}

export class LabmdaDefinitions {

}

export interface UserLoginData {

    accessToken: string;

    refreshToken: string;

    idToken: string;
}

export interface RefreshTokenDataReq {
    email: string;

    refreshToken: string;
}