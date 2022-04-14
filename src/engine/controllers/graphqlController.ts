import * as _ from 'lodash';
import * as fs from 'fs';
import { parse } from 'graphql';
import { GraphQLFunctionType } from '../../interfaces/Extensions';
import { ProjectDefinition } from '../../interfaces/ProjectDefinition';
import { makeExecutableSchema } from 'graphql-tools';
import { rootGraphqlSchema } from '../../consts/RootSchema';
import { Context } from '../../common/context';

export class GraphqlController {
  static loadSchema(context: Context, schemaPaths: string[], predefineSchema = ''): string {
    return schemaPaths.reduce((res, filePath) => {
      try {
        const schemaFile = fs.readFileSync(filePath).toString();
        parse(schemaFile);
        return `${res}\n${schemaFile}`;
      } catch (e) {
        throw new Error(context.i18n.t('schema_file_parse_error', { errorMessage: e.toLocaleString(), filePath }));
      }
    }, predefineSchema);
  }

  /**
   *
   * @param gqlSchema
   * @return { functionName: "Query/Mutation" }
   */
  static defineGqlFunctionsType(gqlSchema: string): { [functionName: string]: GraphQLFunctionType } {
    // bad solution, I think
    // parse graphql file and get function type for all each function
    if (!gqlSchema) {
      return;
    }

    const parsedSchema = parse(gqlSchema);
    return _.transform(
      parsedSchema.definitions,
      (res, extension) => {
        switch (extension.kind) {
          case 'ObjectTypeExtension': {
            const graphqlType = extension.name.value;
            extension.fields.forEach(field => (res[field.name.value] = graphqlType as GraphQLFunctionType));
          }
        }
      },
      {},
    );
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
        Query: {},
      },
    });
  }
}
