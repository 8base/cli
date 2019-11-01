import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import * as ejs from "ejs";
import * as mkdirp from "mkdirp";
import * as changeCase from "change-case";
import * as _ from "lodash";

import { StaticConfig } from "../../config";
import { InvalidConfiguration } from "../../errors";
import { GraphqlController } from "../../engine/controllers/graphqlController";
import { ExtensionsContainer, ExtensionType, GraphQLFunctionType, TriggerDefinition, FunctionDefinition, TriggerType, TriggerOperation, ResolverDefinition, SyntaxType } from "../../interfaces/Extensions";
import { ProjectDefinition } from "../../interfaces/Project";
import { Context, ProjectConfig } from "../../common/context";
import { translations } from "../../common/translations";

type FunctionDeclarationOptions = {
  operation?: string,
  method?: string,
  path?: string,
  type?: string,
  schedule?: string,
};

type FunctionGeneratationOptions = {
  type: ExtensionType,
  name: string,
  mocks: boolean,
  syntax: SyntaxType,
  projectPath?: string,
  silent?: boolean,
};

type MockGeneratationOptions = {
  name: string,
  functionName: string,
  projectPath?: string,
  silent?: boolean,
};

const generateFunctionDeclaration = (
  { type, name, mocks, syntax }: FunctionGeneratationOptions,
  dirPath: string,
  options: FunctionDeclarationOptions,
) => {
  let declaration = {
    type,
    handler: {
      code: `${dirPath}/handler.${syntax}`,
    },
  };

  if (type === ExtensionType.resolver) {
    declaration = _.merge(declaration, {
      schema: `${dirPath}/schema.graphql`,
    });
  } else if (type === ExtensionType.task && options.schedule) {
    declaration = _.merge(declaration, {
      schedule: options.schedule,
    });
  } else if (type === ExtensionType.trigger) {
    declaration = _.merge(declaration, {
      type: `trigger.${ options.type || "before" }`,
      operation: options.operation || "Users.create",
    });
  } else if (type === ExtensionType.webhook) {
    declaration = _.merge(declaration, {
      path: options.path || "/webhook",
      method: options.method || "POST",
    });
  }

  return declaration;
};

export class ProjectController {

  /**
   * public functions
   */

  static initialize(context: Context): ProjectDefinition {

    const name = path.basename(context.config.rootExecutionDir);
    context.logger.debug("start initialize project \"" + name + "\"");

    context.logger.debug("load main yml file");
    const config = ProjectController.loadConfigFile(context);

    context.logger.debug("load extensions");
    const extensions = ProjectController.loadExtensions(config);

    const gqlSchema = GraphqlController.loadSchema(ProjectController.getSchemaPaths(extensions));

    context.logger.debug("load functions count = " + extensions.functions.length);

    context.logger.debug("resolve function graphql types");
    const functionGqlTypes = GraphqlController.defineGqlFunctionsType(gqlSchema);
    extensions.resolvers = ResolverUtils.resolveGqlFunctionTypes(extensions.resolvers, functionGqlTypes);

    context.logger.debug("initialize project complete");
    return {
      extensions,
      name,
      gqlSchema,
    };
  }

  static getFunctionSourceCode(context: Context): string[] {
    return _.map(context.project.extensions.functions, f => path.join(context.config.rootExecutionDir, f.pathToFunction));
  }

  static saveSchema(project: ProjectDefinition, outDir: string) {
    const graphqlFilePath = path.join(outDir, "schema.graphql");
    fs.writeFileSync(graphqlFilePath, project.gqlSchema);
  }

  static saveProject(project: ProjectDefinition, outDir: string) {
    const projectObject = {
      name: project.name,
      functions: project.extensions.functions
    };

    const projectFilePath = path.join(outDir, "project.json");
    return fs.writeFileSync(projectFilePath, JSON.stringify(projectObject, null, 2));
  }

  static saveMetaDataFile(project: ProjectDefinition, outDir: string) {
    const summaryFile = path.join(outDir, "__summary__functions.json");
    fs.writeFileSync(summaryFile, JSON.stringify(
      {
        functions: project.extensions.functions.map(f => {
          return {
            name: f.name,
            handler: f.handler
          };
        }),
        resolvers: project.extensions.resolvers.map(
          r => {
            return {
              name: r.name,
              functionName: r.functionName,
              gqlType: r.gqlType
            };
          }
        ),
        triggers: project.extensions.triggers,
        webhooks: project.extensions.webhooks
      },
      null,
      2
    ));
  }

  static getSchemaPaths(extensions: ExtensionsContainer): string[] {
    return _.map(extensions.resolvers, f => {
      const p = path.join(StaticConfig.rootExecutionDir, f.gqlSchemaPath);
      if (!fs.existsSync(p)) {
        throw new Error("schema path \"" + p + "\" not present");
      }
      return p;
    });
  }

  /**
   * private functions
   */

  private static loadConfigFile(context: Context, projectPath?: string): any {
    const pathToYmlConfig = projectPath ? path.join(projectPath, "8base.yml") : StaticConfig.serviceConfigFileName;

    context.logger.debug("check exist yaml file = " + pathToYmlConfig);

    if (!fs.existsSync(pathToYmlConfig)) {
      throw new Error(context.i18n.t("8base_config_is_missing"));
    }

    try {
      return yaml.safeLoad(fs.readFileSync(pathToYmlConfig, "utf8"));
    }
    catch (ex) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, ex.message);
    }
  }

  private static saveConfigFile(context: Context, config: Object, projectPath?: string, silent?: boolean): any {
    const pathToYmlConfig = projectPath ? path.join(projectPath, "8base.yml") : StaticConfig.serviceConfigFileName;

    fs.writeFileSync(pathToYmlConfig, yaml.safeDump(config));

    if (!silent) {
      context.logger.info(context.i18n.t("project_updated_file", {
        path: pathToYmlConfig,
      }));
    }
  }

  private static loadExtensions(config: any): ExtensionsContainer {
    return _.reduce<any, ExtensionsContainer>(config.functions, (extensions, data, functionName) => {

      FunctionUtils.validateFunctionDefinition(data, functionName);

      extensions.functions.push({
        name: functionName,
        // TODO: create class FunctionDefinition
        handler: functionName + ".handler", // this handler generate in compile step
        pathToFunction: FunctionUtils.resolveHandler(functionName, data.handler)
      });

      switch (FunctionUtils.resolveFunctionType(data.type, functionName)) {
        case ExtensionType.resolver:
          extensions.resolvers.push({
            name: functionName,
            functionName: functionName,
            gqlSchemaPath: data.schema,
            gqlType: undefined
          });
          break;

        case ExtensionType.task:
          extensions.tasks.push({
            name: functionName,
            functionName: functionName,
          });
          break;


        case ExtensionType.trigger:
          if (_.isNil(data.operation)) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "operation field not present in trigger " + functionName);
          }

          const operation = data.operation.split("."); // TableName.TriggerType

          extensions.triggers.push({
            name: functionName,
            operation: TriggerUtils.resolveTriggerOperation(operation[1], functionName),
            tableName: operation[0],
            functionName,
            type: TriggerUtils.resolveTriggerType(data.type, functionName)
          });
          break;

        case ExtensionType.webhook:
          if (!data.method) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Parameter 'method' is missing in webhook '" + functionName + "'");
          }

          extensions.webhooks.push({
            name: functionName,
            functionName,
            httpMethod: data.method,
            path: data.path ? data.path : functionName
          });
          break;

        default:
          break;
      }

      if (data.schedule) {
        extensions.schedules.push({
          name: functionName,
          functionName,
          scheduleExpression: data.schedule
        });
      }

      return extensions;
    }, {
      resolvers: [],
      tasks: [],
      functions: [],
      webhooks: [],
      triggers: [],
      schedules: []
    });
  }

  static addPluginDeclaration(context: Context, name: string, declaration: Object, projectPath?: string, silent?: boolean) {
    let config = ProjectController.loadConfigFile(context, projectPath);

    const plugins = config.plugins || [];

    if (_.some(plugins, { name })) {
      throw new Error(context.i18n.t("plugins_with_name_already_defined", { name }));
    }

    config.plugins = [...plugins, declaration];

    ProjectController.saveConfigFile(context, config, projectPath, silent);
  }

  static addFunctionDeclaration(context: Context, name: string, declaration: Object, projectPath?: string, silent?: boolean) {
    let config = ProjectController.loadConfigFile(context, projectPath) || { functions: {} };

    if (_.has(config, ["functions", name])) {
      throw new Error(context.i18n.t("function_with_name_already_defined", { name }));
    }

    config = _.set(config, ["functions", name], declaration);

    ProjectController.saveConfigFile(context, config, projectPath, silent);
  }

  static generateFunction(
    context: Context,
    { type, name, mocks, syntax, projectPath = ".", silent }: FunctionGeneratationOptions,
    options: FunctionDeclarationOptions = {}
  ) {
    const dirPath = `src/${type}s/${name}`;

    ProjectController.addFunctionDeclaration(
      context,
      name,
      generateFunctionDeclaration({ type, name, syntax, mocks }, dirPath, options),
      projectPath,
      silent,
    );

    const functionTemplatePath = path.resolve(context.config.functionTemplatesPath, type);

    processTemplate(
      context,
      { dirPath: path.join(projectPath, dirPath), templatePath: functionTemplatePath },
      { syntax, mocks, silent },
      { functionName: name, type },
    );

    if (!silent) {
      context.logger.info("");

      context.logger.info(context.i18n.t("generate_function_grettings", {
        name,
      }));
    }
  }

  static getMock(context: Context, functionName: string, mockName: string) {
    let config = ProjectController.loadConfigFile(context, ".") || { functions: {} };

    if (!_.has(config, ["functions", functionName])) {
      throw new Error(context.i18n.t("function_with_name_not_defined", { name: functionName }));
    }

    const type = _.get(config, ["functions", functionName]).type.match(/^\w+/)[0];

    const mockPath = `src/${type}s/${functionName}/mocks/${mockName}.json`;

    if (!fs.existsSync(mockPath)) {
      throw new Error(context.i18n.t("mock_with_name_not_defined", { functionName, mockName }));
    }

    return fs.readFileSync(mockPath).toString();
  }

  static generateMock(
    context: Context,
    { name, functionName, projectPath = ".", silent }: MockGeneratationOptions,
  ) {
    let config = ProjectController.loadConfigFile(context, projectPath) || { functions: {} };

    if (!_.has(config, ["functions", functionName])) {
      throw new Error(context.i18n.t("function_with_name_not_defined", { name: functionName }));
    }

    const fn = _.get(config, ["functions", functionName]);

    const type = fn.type.match(/^\w+/)[0];

    const mockPath = `src/${type}s/${functionName}/mocks/${name}.json`;

    if (fs.existsSync(mockPath)) {
      throw new Error(context.i18n.t("mock_with_name_already_defined", { mockName: name, functionName }));
    }

    const dirPath = `src/${type}s/${functionName}/mocks`;

    processTemplate(
      context,
      { dirPath: path.join(projectPath, dirPath), templatePath: context.config.mockTemplatePath },
      { silent },
      { mockName: name },
    );

    if (!silent) {
      context.logger.info("");

      context.logger.info(context.i18n.t("generate_mock_grettings", {
        name,
      }));
    }
  }
}

type ProcessTemplateOptions = {
  syntax?: SyntaxType,
  silent?: boolean,
  mocks?: boolean,
};

const processTemplate = (
  context: Context,
  { dirPath, templatePath }: { dirPath: string, templatePath: string },
  { syntax, silent, mocks }: ProcessTemplateOptions,
  options?: Object,
) => {
  mkdirp.sync(dirPath);

  fs.readdirSync(templatePath).forEach(file => {
    if (file.indexOf(".") === -1) {
      if (file !== "mocks" || mocks) {
        processTemplate(context, {
          dirPath: path.join(dirPath, file),
          templatePath: path.join(templatePath, file),
        }, {
          syntax,
          silent,
          mocks,
        }, options);
      }

      return;
    }

    if ((new RegExp(`.${syntax === SyntaxType.js ? SyntaxType.ts : SyntaxType.js}.ejs$`)).test(file)) {
      return;
    }

    const data = fs.readFileSync(path.resolve(templatePath, file));

    const content = ejs.compile(data.toString())({
      ...options,
      changeCase,
    });

    let fileName = file.replace(/\.ejs$/, "");

    fileName = ejs.compile(fileName)({
      ...options,
      changeCase,
    });

    fs.writeFileSync(path.resolve(dirPath, fileName), content);

    if (!silent) {
      context.logger.info(context.i18n.t("project_created_file", {
        path: path.join(dirPath, fileName),
      }));
    }
  });
};

namespace ResolverUtils {

  /**
   * @argument types project, { functionName: type }
   * Function resolve graphql type for each function.
   * we have to know function type (mutation, query) for compile schema on the server side
   */
  export function resolveGqlFunctionTypes(resolvers: ResolverDefinition[], types: { [functionName: string]: GraphQLFunctionType }): ResolverDefinition[] {
    resolvers.forEach(func => {
      const type = types[func.name];
      if (_.isNil(type)) {
        throw new Error("Cannot define graphql type for function \"" + func.name + "\"");
      }
      func.gqlType = type;
    });
    return resolvers;
  }
}

namespace FunctionUtils {

  export function resolveHandler(name: string, handler: any): string {
    if (_.isString(handler.code)) {
      return handler.code;
    }
    throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "handler is invalid for function \"" + name + "\"");
  }

  export function validateFunctionDefinition(func: any, name: string) {
    if (_.isNil(func.handler)) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "handler is absent for function \"" + name + "\"");
    }

    if (func.handler.code && !fs.existsSync(path.join(StaticConfig.rootExecutionDir, func.handler.code))) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "unable to determine function \"" + name + "\" source code");
    }

    if (!StaticConfig.supportedCompileExtension.has(path.extname(func.handler.code))) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "function \"" + name + "\" have unsupported file extension");
    }
  }

  /**
   *
   * @param type "resolve", "trigger.before", "trigger.after", "subscription", "webhook"
   * @return FunctionType
   */
  export function resolveFunctionType(type: string, functionName: string): ExtensionType {
    const funcType = type.split(".")[0];
    const resolvedType = (<any>ExtensionType)[funcType];
    if (_.isNil(resolvedType)) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Invalid function type " + type + " in function " + functionName);
    }

    return <ExtensionType>resolvedType;
  }
}

namespace TriggerUtils {

  export function resolveTriggerOperation(operation: string, funcName: string): TriggerOperation {
    const resolvedOperation = (<any>TriggerOperation)[operation];
    if (_.isNil(resolvedOperation)) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Invalid trigger operation " + operation + " in function " + funcName);
    }

    return <TriggerOperation>resolvedOperation;
  }

  /**
   *
   * @param type "resolve", "trigger.before", "trigger.after", "subscription"
   * @return TriggerStageType
   */
  export function resolveTriggerType(type: string, functionName: string): TriggerType {
    const triggerType = type.split(".")[1];
    const resolvedType = (<any>TriggerType)[triggerType];
    if (_.isNil(resolvedType)) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Invalid trigger type " + type + " in function " + functionName);
    }

    return <TriggerType>resolvedType;
  }

}
