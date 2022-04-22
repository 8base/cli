export const StorageParameters = {
  serverApiAddress: 'server-address',
  authDomain: 'auth-domain',
  authClientId: 'auth-client-id',
  idToken: 'id-token',
  refreshToken: 'refresh-token',
};

export type StorageParametersType =
  | typeof StorageParameters.serverApiAddress
  | typeof StorageParameters.authDomain
  | typeof StorageParameters.authClientId
  | typeof StorageParameters.idToken
  | typeof StorageParameters.refreshToken;
