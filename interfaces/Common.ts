export interface SessionInfo {
  idToken: string;
  refreshToken: string;
  workspaces: { name: string, id: string }[];
}