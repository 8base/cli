export interface ProjectDefinition {
    service: string;
    datamodel: string | string[];
    schema?: string;
    subscriptions?: SubscriptionMap;
    custom?: any;
    secret?: string;
    disableAuth?: boolean;
    seed?: Seed;
    cluster?: string;
    stage: string;
  }

  export interface Seed {
    ['import']?: string;
    run?: string;
  }

  export interface SubscriptionMap {
    [subscriptionName: string]: SubscriptionDefinition;
  }

  export interface SubscriptionDefinition {
    query: string;
    webhook: FunctionHandlerWebhookSource;
  }

  export type FunctionHandlerWebhookSource =
    | string
    | FunctionHandlerWebhookWithHeaders;

  export interface FunctionHandlerWebhookWithHeaders {
    url: string;
    headers?: Headers;
  }

  export interface Headers {
    [key: string]: string;
  }
