export * from "./project";

export class CompileDefinitions {

}

export class LabmdaDefinitions {

}

export interface UserLoginData {

    email: string;

    accessToken: string;

    refreshToken: string;

    tokenId: string;
}

export interface RefreshTokenDataReq {
    email: string;

    refreshToken: string;
}

export interface RefreshTokenDataResp {

    token: string;
}