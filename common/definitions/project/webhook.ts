
export interface WebhookDefinition {
  name: string;
  functionName: string;
  httpMethod: string;
  path: string;
  appId: string;
}


export interface RelativeWebhookDefinition {
  name: string;
  httpMethod: string;
  accountRelativePath: string;
}

export interface ResolvedRelativeWebhookDefinition extends RelativeWebhookDefinition {
  resolvedAccountRelativePath: string;
}