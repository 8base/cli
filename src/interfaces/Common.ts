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

export enum CommitMode {
  FULL = 'FULL',
  ONLY_MIGRATIONS = 'ONLY_MIGRATIONS',
  ONLY_PROJECT = 'ONLY_PROJECT',
}

export interface RequestOptions {
  readonly isLoginRequired?: boolean;
  readonly customWorkspaceId?: string;
  readonly customEnvironment?: string;
}
