import * as _ from 'lodash';
import * as fs from 'fs';
import { FieldDefinitionNode, parse } from 'graphql';
import { ObjectTypeExtensionNode } from 'graphql/language/ast';
import { GraphQLFunctionType } from '../../interfaces/Extensions';

export class GraphqlController {
  static loadSchema(schemaPaths: string[], predefineSchema: string = ''): string {
    return _.reduce<string, string>(
      schemaPaths,
      (res: string, file: string): string => {
        res += fs.readFileSync(file);
        return res;
      },
      predefineSchema,
    );
  }

  /**
   *
   * @return { functionName: "Query/Mutation" }
   * @param gqlSchema
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
      (res: any, data: any) => {
        switch (data.kind) {
          case 'ObjectTypeExtension': {
            const extension = data as ObjectTypeExtensionNode;
            const graphqlType = data.name.value;
            const extendedFieldNames = GraphqlController.processFields(extension.fields);
            extendedFieldNames.forEach(field => (res[field] = graphqlType));
          }
        }
      },
      {},
    );
  }

  /**
   * private functions
   */

  private static processFields(fields: ReadonlyArray<FieldDefinitionNode>): string[] {
    return _.transform(
      fields,
      (res: any[], f: any) => {
        res.push(f.name.value);
      },
      [],
    );
  }
}
