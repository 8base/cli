export enum ExtensionType {
    resolver = "resolver",
    trigger = "trigger",
    webhook = "webhook"
}

/*
    Resolvers
*/

export enum GraphQLFunctionType {
    Mutation = "Mutation",
    Query = "Query",
}

export interface BaseDefinition {
    name: string;
    functionName: string;
}

export interface ResolverDefinition extends BaseDefinition {

    gqlType: GraphQLFunctionType;

    gqlschemaPath: string;
}

/*
    Triggers
*/

export enum TriggerType {
    before = "Before",
    after = "After"
}

export interface TriggerDefinition extends BaseDefinition {

    // Before After
    type: string;

    // Create Delete Update
    operation: string;
    tableName: string;
}

export enum TriggerOperation {
    create = "Create",
    update = "Update",
    delete = "Delete"
}

/*
    Functions
*/

export interface FunctionDefinition {
    readonly name: string;

    readonly handler: string;

    readonly pathToFunction: string;
}

/*
    Webhooks
*/

export interface WebhookDefinition extends BaseDefinition {
    httpMethod: string;
    path: string;
}


export interface ExtensionsContainer {
    resolvers: ResolverDefinition[];
    functions: FunctionDefinition[];
    triggers: TriggerDefinition[];
    webhooks: WebhookDefinition[];
}