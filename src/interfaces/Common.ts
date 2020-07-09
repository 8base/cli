export interface SessionInfo {
  idToken: string;
  refreshToken?: string;
}

export type EnvironmentInfo = {
  name: string;
  id: string;
};

export type BuildDirectory = string;
