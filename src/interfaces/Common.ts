export interface SessionInfo {
  idToken: string;
  refreshToken?: string;
}

export type EnvironmentInfo = {
  id: string;
  name: string;
};

export type IFunctionCheck = {
  version: string;
};

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
  readonly customAuthorization?: string;
  readonly customWorkspaceId?: string;
  readonly customEnvironment?: string;
  readonly address?: string;
  readonly nodeVersion?: string;
}

export interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly apiHost: string;
}
