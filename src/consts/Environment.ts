export const DEFAULT_ENVIRONMENT_NAME = 'Master';
export const DEFAULT_WORKSPACE_REGION = 'us-east-1';
export const DEFAULT_REMOTE_ADDRESS = 'https://api.8base.com';

export const REGIONS_ADDRESS_MAP: Record<string, string> = {
  [DEFAULT_WORKSPACE_REGION]: DEFAULT_REMOTE_ADDRESS,
  ['eu-west-2']: 'https://uk.api.8base.com',
};
