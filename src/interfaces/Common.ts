export interface SessionInfo {
  idToken: string;
  refreshToken?: string;
}

export type EnvironmentInfo = {
  id: string;
  name: string;
};

export type BuildDirectory = string;

export enum MigrateMode {
  FULL = 'FULL',
  SYSTEM = 'SYSTEM',
}
