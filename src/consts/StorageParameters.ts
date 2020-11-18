export const StorageParameters = {
  serverAddress: 'server-address',
  webAddress: 'web-address',
  authDomain: 'auth-domain',
  authClientId: 'auth-client-id',
  idToken: 'id-token',
  refreshToken: 'refresh-token',
};

export type StorageParametersType =
  | typeof StorageParameters.serverAddress
  | typeof StorageParameters.authDomain
  | typeof StorageParameters.authClientId
  | typeof StorageParameters.idToken
  | typeof StorageParameters.refreshToken;
