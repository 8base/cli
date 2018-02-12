import { makeExecutableSchema } from "graphql-tools";

import * as rootSchema from "./rootSchema.graphql";
import * as rootQuerySchema  from "./query.graphql";
import * as rootMutationSchema from "./mutation.graphql";
import typesSchema from "./types";
import { generateDeployUrl, deploySchema } from "../resolvers";


export const resolvers = {
    Mutation: {

        generateDeployUrl: async (root: any, args: { build: string }, { account, token }: any) => {
            return generateDeployUrl(args.build, account.accountId.toString());
        },

        deploySchema: async (root: any, args: { build: string }, { account, token }: any) => {
            return deploySchema(args.build, account);
        }
    },
    Query : {}
};

const aggregatedSchemas = [
    rootSchema,
    rootQuerySchema,
    rootMutationSchema,
    ...typesSchema
];


export const cliExecutableSchema = makeExecutableSchema({
    typeDefs: aggregatedSchemas,
    resolvers
});