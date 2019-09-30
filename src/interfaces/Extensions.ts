export enum ExtensionType {
  resolver = "resolver",
  trigger = "trigger",
  webhook = "webhook",
  task = "task"
}

export enum SyntaxType {
  js = "js",
  ts = "ts",
}

export enum DeployModeType {
  full = "FULL",
  plugins = "ONLY_PLUGINS",
  project = "ONLY_PROJECT",
}

export enum GraphQLFunctionType {
  Mutation = "Mutation",
  Query = "Query",
}

export enum TriggerOperation {
  create = "create",
  update = "update",
  delete = "delete"
}

export enum TriggerType {
  before = "before",
  after = "after"
}

export interface BaseDefinition {
  name: string;
  functionName: string;
}

export interface ResolverDefinition extends BaseDefinition {
  gqlType: GraphQLFunctionType;

  gqlSchemaPath: string;
}

export interface TaskDefinition extends BaseDefinition {}

export interface ScheduleDefinition extends BaseDefinition {
  scheduleExpression: string;
}

export interface TriggerDefinition extends BaseDefinition {
  type: string;
  operation: string;
  tableName: string;
}

export interface FunctionDefinition {
  readonly name: string;

  readonly handler: string;

  readonly pathToFunction: string;
}

export interface WebhookDefinition extends BaseDefinition {
  httpMethod: string;
  path: string;
}

export interface ExtensionsContainer {
  resolvers: ResolverDefinition[];
  tasks: TaskDefinition[];
  schedules: ScheduleDefinition[];

  functions: FunctionDefinition[];
  triggers: TriggerDefinition[];
  webhooks: WebhookDefinition[];
}