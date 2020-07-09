export interface SessionInfo {
  idToken: string;
  refreshToken?: string;
}

export type EnvironmentInfo = {
  name: string;
};

export type BuildDirectory = string;
