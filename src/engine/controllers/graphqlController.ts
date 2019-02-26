import * as _ from "lodash";
import * as fs from "fs";
import { parse, FieldDefinitionNode } from "graphql";
import { ObjectTypeExtensionNode } from "graphql/language/ast";
import { GraphQLFunctionType } from "../../interfaces/Extensions";
import { ProjectDefinition } from "../../interfaces/Project";
import { makeExecutableSchema } from "graphql-tools";
import { rootGraphqlSchema } from "../../consts/RootSchema";


export class GraphqlController {

  static loadSchema(schemaPaths: string[], predefineSchema: string = ""): string {
    return _.reduce<string, string>(schemaPaths, (res: string, file: string): string => {
      res += fs.readFileSync(file);
      return res;
    }, predefineSchema);
  }

  /**
   *
   * @param project
   * @return { functionName: "Query/Mutation" }
   */
  static defineGqlFunctionsType(gqlSchema: string): {[functionName: string]: GraphQLFunctionType} {
      // bad solution, I think
      // parse graphql file and get function type for all each function
    if (!gqlSchema) {
      return;
    }
    const parsedSchema = parse(gqlSchema);
    return _.transform(parsedSchema.definitions, (res: any, data: any) => {
      switch(data.kind) {
        case "ObjectTypeExtension": {
          const extension = data as ObjectTypeExtensionNode;
          const graphqlType = data.name.value;
          const extendedFieldNames = GraphqlController.processFields(extension.fields);
          extendedFieldNames.forEach(field => res[field] = graphqlType);
        }
      }
    }, {});
  }


    /**
     *
     * @param project
     */

  static validateSchema(project: ProjectDefinition) {
        // TODO: add mutations and queries
    makeExecutableSchema({
      typeDefs: project.gqlSchema + rootGraphqlSchema(),
      resolvers: {
        Mutation: {},
        Query: {}
      }
    });
  }

    /**
     * private functions
     */

  private static processFields(fields: FieldDefinitionNode[]): string[] {
    return _.transform(fields, (res: any[], f: any) => {
      res.push(f.name.value);
    }, []);
  }
}