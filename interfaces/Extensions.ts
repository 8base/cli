import { UserDataStorage } from "../common";
import * as url from "url";

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

export interface ResolverDefinition {
    name: string;

    functionName: string;
    gqlType: GraphQLFunctionType;

    gqlschemaPath: string;
}

/*
    Triggers
*/

export enum TriggerStageType {
    before = "Before",
    after = "After"
}

export interface TriggerStage {
    /* pre post */
    stageName: string;

    functionName: string;
}

export interface TriggerDefinition {
    name: string;
    table: string;
    stages: TriggerStage[];
}

export enum TriggerType {
    create = "Create",
    update = "Update",
    delete = "Delete"
}

/*
    Functions
*/

export class FunctionDefinition {
    readonly name: string;

    readonly handler: string;

    readonly pathToFunction: string;
}

/*
    Webhooks
*/

export interface WebhookDefinition {
    name: string;
    functionName: string;
    httpMethod: string;
    path: string;
}


export interface ExtensionsContainer {
    resolvers: ResolverDefinition[];
    functions: FunctionDefinition[];
    triggers: TriggerDefinition[];
    webhooks: WebhookDefinition[];
}