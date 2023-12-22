import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as ejs from 'ejs';
import * as _ from 'lodash';

import { StaticConfig } from '../../config';
import { InvalidConfiguration } from '../../errors';
import { GraphqlController } from './graphqlController';
import {
  ExtensionsContainer,
  ExtensionType,
  GraphQLFunctionType,
  ResolverDefinition,
  SyntaxType,
  TriggerOperation,
  TriggerType,
  WebhookMethod,
} from '../../interfaces/Extensions';
import { ProjectDefinition } from '../../interfaces/Project';
import { Context, Plugin, ProjectConfig } from '../../common/context';

type FunctionDeclarationOptions = {
  operation?: TriggerOperation;
  method?: WebhookMethod;
  path?: string;
  type?: TriggerType;
  schedule?: string;
};

type FunctionGenerationOptions = {
  type: ExtensionType;
  name: string;
  mocks: boolean;
  syntax: SyntaxType;
  projectPath?: string;
  silent?: boolean;
  extendType?: string;
};

type MockGenerationOptions = {
  name: string;
  functionName: string;
  projectPath?: string;
  silent?: boolean;
};

type PluginGenerationOptions = {
  name: string;
  syntax?: SyntaxType;
  projectPath?: string;
  silent?: boolean;
};

const generateFunctionDeclaration = (
  { type, name, syntax }: FunctionGenerationOptions,
  dirPath: string,
  options: FunctionDeclarationOptions,
) => {
  switch (type) {
    case ExtensionType.resolver:
      return {
        type,
        handler: {
          code: `${dirPath}/handler.${syntax}`,
        },
        schema: `${dirPath}/schema.graphql`,
      };

    case ExtensionType.task: {
      const declaration = {
        type,
        handler: {
          code: `${dirPath}/handler.${syntax}`,
        },
      };
      if (options.schedule) {
        _.assign(declaration, {
          schedule: options.schedule,
        });
      }
      return declaration;
    }

    case ExtensionType.trigger:
      return {
        handler: {
          code: `${dirPath}/${options.type}.${syntax}`,
        },
        type: `trigger.${options.type}`,
        operation: `${name}.${options.operation}`,
      };

    case ExtensionType.webhook:
      return {
        type,
        handler: {
          code: `${dirPath}/handler.${syntax}`,
        },
        path: options.path || '/webhook',
        method: options.method || 'POST',
      };
  }
};

export class ProjectController {
  /**
   * public functions
   */

  static initialize(context: Context): ProjectDefinition {
    const name = path.basename(context.config.rootExecutionDir);
    context.logger.debug(`start initialize project "${name}"`);

    const { extensions, gqlSchema } = ProjectController.getProjectData(context);

    context.logger.debug('initialize plugins structure');
    const pluginPaths = this.loadConfigFile(context).plugins;

    if (pluginPaths) {
      pluginPaths.map((plugin: { path: string }) => {
        const pluginDir = path.dirname(path.join(context.config.rootExecutionDir, plugin.path));
        ProjectController.getProjectData(context, pluginDir);
      });
    }
    context.logger.debug(`load functions count = ${extensions.functions.length}`);

    context.logger.debug('resolve function graphql types');
    const functionGqlTypes = GraphqlController.defineGqlFunctionsType(gqlSchema);
    extensions.resolvers = ResolverUtils.resolveGqlFunctionTypes(extensions.resolvers, functionGqlTypes);

    context.logger.debug('initialize project complete');
    return {
      extensions,
      name,
      gqlSchema,
    };
  }

  static getProjectData(
    context: Context,
    projectPath?: string,
  ): {
    gqlSchema: string;
    extensions: ExtensionsContainer;
  } {
    context.logger.debug('load main yml file');
    const config = ProjectController.loadConfigFile(context, projectPath);

    context.logger.debug('load extensions');
    const extensions = ProjectController.loadExtensions(config, projectPath);

    const gqlSchema = GraphqlController.loadSchema(ProjectController.getSchemaPaths(extensions, projectPath));

    return { extensions, gqlSchema };
  }

  static getFunctionSourceCode(context: Context): string[] {
    return _.map(context.project.extensions.functions, f =>
      path.join(context.config.rootExecutionDir, f.pathToFunction),
    );
  }

  static async saveSchema(project: ProjectDefinition, outDir: string) {
    const graphqlFilePath = path.join(outDir, 'schema.graphql');
    await fs.writeFile(graphqlFilePath, project.gqlSchema);
  }

  static async saveProject(project: ProjectDefinition, outDir: string) {
    const projectObject = {
      name: project.name,
      functions: project.extensions.functions,
    };

    const projectFilePath = path.join(outDir, 'project.json');
    await fs.writeJSON(projectFilePath, projectObject, { spaces: 2 });
  }

  static async saveMetaDataFile(project: ProjectDefinition, outDir: string) {
    const summaryFile = path.join(outDir, '__summary__functions.json');
    await fs.writeJSON(
      summaryFile,
      {
        functions: project.extensions.functions.map(f => {
          return {
            name: f.name,
            handler: f.handler,
          };
        }),
        resolvers: project.extensions.resolvers.map(r => {
          return {
            name: r.name,
            functionName: r.functionName,
            gqlType: r.gqlType,
          };
        }),
        triggers: project.extensions.triggers,
        webhooks: project.extensions.webhooks,
      },
      { spaces: 2 },
    );
  }

  static getSchemaPaths(extensions: ExtensionsContainer, projectPath?: string): string[] {
    const pathToWorkDir = projectPath || StaticConfig.rootExecutionDir;
    return _.map(extensions.resolvers, f => {
      const p = path.join(pathToWorkDir, f.gqlSchemaPath);
      if (!fs.existsSync(p)) {
        throw new Error(`schema path "${p}" is not present`);
      }
      return p;
    });
  }

  /**
   * private functions
   */

  private static loadConfigFile(context: Context, projectPath?: string): ProjectConfig {
    const pathToYmlConfig = projectPath ? path.join(projectPath, '8base.yml') : StaticConfig.serviceConfigFileName;

    context.logger.debug(`check exist yaml file = ${pathToYmlConfig}`);

    if (!fs.existsSync(pathToYmlConfig)) {
      throw new Error(context.i18n.t('8base_config_is_missing'));
    }

    try {
      return <ProjectConfig>yaml.load(fs.readFileSync(pathToYmlConfig, 'utf8'));
    } catch (ex) {
      throw new InvalidConfiguration(pathToYmlConfig, ex.message);
    }
  }

  private static saveConfigFile(context: Context, config: Object, projectPath?: string, silent?: boolean): void {
    const pathToYmlConfig = projectPath ? path.join(projectPath, '8base.yml') : StaticConfig.serviceConfigFileName;

    const dump = yaml.dump(config);
    fs.writeFileSync(pathToYmlConfig, dump);

    if (!silent) {
      context.logger.info(
        context.i18n.t('project_updated_file', {
          path: pathToYmlConfig,
        }),
      );
    }
  }

  private static loadExtensions(config: ProjectConfig, projectPath?: string): ExtensionsContainer {
    return _.reduce(
      config.functions,
      (extensions, data, functionName) => {
        FunctionUtils.validateFunctionDefinition(data, functionName, projectPath);

        extensions.functions.push({
          name: functionName,
          // TODO: create class FunctionDefinition
          handler: `${functionName}.handler`, // this handler generate in compile step
          pathToFunction: FunctionUtils.resolveHandler(functionName, data.handler),
        });

        switch (FunctionUtils.resolveFunctionType(data.type, functionName)) {
          case ExtensionType.resolver:
            extensions.resolvers.push({
              name: functionName,
              functionName: functionName,
              gqlSchemaPath: data.schema,
              gqlType: undefined,
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
              throw new InvalidConfiguration(
                StaticConfig.serviceConfigFileName,
                `operation field not present in trigger ${functionName}`,
              );
            }

            const [tableName, operation] = data.operation.split('.');

            extensions.triggers.push({
              name: functionName,
              operation: TriggerUtils.resolveTriggerOperation(operation, functionName),
              tableName,
              functionName,
              type: TriggerUtils.resolveTriggerType(data.type, functionName),
            });
            break;

          case ExtensionType.webhook:
            if (!data.method) {
              throw new InvalidConfiguration(
                StaticConfig.serviceConfigFileName,
                `Parameter "method" is missing in webhook "${functionName}"`,
              );
            }

            extensions.webhooks.push({
              name: functionName,
              functionName,
              httpMethod: data.method,
              path: data.path ? data.path : functionName,
            });
            break;

          default:
            break;
        }

        if (data.schedule) {
          extensions.schedules.push({
            name: functionName,
            functionName,
            scheduleExpression: data.schedule,
          });
        }

        return extensions;
      },
      {
        resolvers: [],
        tasks: [],
        functions: [],
        webhooks: [],
        triggers: [],
        schedules: [],
      },
    );
  }

  static addPluginDeclaration(
    context: Context,
    name: string,
    declaration: Plugin,
    projectPath?: string,
    silent?: boolean,
  ) {
    let config = ProjectController.loadConfigFile(context, projectPath);

    const plugins = config.plugins || [];

    if (_.some(plugins, { name })) {
      throw new Error(context.i18n.t('plugins_with_name_already_defined', { name }));
    }

    config.plugins.push(declaration);

    ProjectController.saveConfigFile(context, config, projectPath, silent);
  }

  static async addFunctionDeclaration(
    context: Context,
    name: string,
    declaration: Object,
    projectPath?: string,
    silent?: boolean,
  ) {
    let config = ProjectController.loadConfigFile(context, projectPath) || {
      functions: {},
    };

    if (_.has(config, ['functions', name])) {
      throw new Error(context.i18n.t('function_with_name_already_defined', { name }));
    }

    config = _.set(config, ['functions', name], declaration);

    ProjectController.saveConfigFile(context, config, projectPath, silent);
  }

  static async generateFunction(
    context: Context,
    { type, name, mocks, syntax, extendType = 'Query', projectPath = '.', silent }: FunctionGenerationOptions,
    options: FunctionDeclarationOptions = {},
  ) {
    const dirPath = FunctionUtils.resolveFunctionDir(type, name, options);
    const functionName = FunctionUtils.resolveFunctionName(type, name, options);

    await ProjectController.addFunctionDeclaration(
      context,
      functionName,
      generateFunctionDeclaration({ type, name, syntax, mocks }, dirPath, options),
      projectPath,
      silent,
    );

    const functionTemplatePath = FunctionUtils.resolveTemplatePath(context, type, options);

    processTemplate(
      context,
      {
        dirPath: path.join(projectPath, dirPath),
        templatePath: functionTemplatePath,
      },
      { syntax, mocks, silent },
      { functionName, type, extendType, mockName: 'request' },
    );

    if (!silent) {
      context.logger.info('');

      context.logger.info(
        context.i18n.t('generate_function_success', {
          name,
        }),
      );
    }
  }

  static async generatePlugin(context: Context, { name, syntax, silent, projectPath = '.' }: PluginGenerationOptions) {
    const functionName = `${name}Resolver`;
    const extendType = _.upperFirst(`${name}Mutation`);
    const pluginPath = path.join('plugins', name);
    const functionPath = path.join(pluginPath, 'src', 'resolvers', functionName);
    const pluginTemplatePath = context.config.pluginTemplatePath;
    const resolverTemplatePath = path.resolve(context.config.functionTemplatesPath, ExtensionType.resolver);

    ProjectController.addPluginDeclaration(
      context,
      name,
      {
        name,
        path: path.join(pluginPath, '8base.yml'),
      },
      projectPath,
      silent,
    );

    processTemplate(
      context,
      {
        dirPath: path.join(projectPath, pluginPath),
        templatePath: pluginTemplatePath,
      },
      { syntax, silent },
      { name, syntax, functionName },
    );

    processTemplate(
      context,
      {
        dirPath: path.join(projectPath, functionPath),
        templatePath: resolverTemplatePath,
      },
      { syntax, mocks: false, silent },
      { functionName, type: ExtensionType.resolver, extendType },
    );

    if (!silent) {
      context.logger.info('');

      context.logger.info(
        context.i18n.t('generate_plugin_success', {
          name,
        }),
      );
    }
  }

  static async getMock(context: Context, functionName: string, mockName: string) {
    let config = ProjectController.loadConfigFile(context, '.') || {
      functions: {},
    };

    if (!_.has(config, ['functions', functionName])) {
      throw new Error(context.i18n.t('function_with_name_not_defined', { name: functionName }));
    }

    const fn = _.get(config, ['functions', functionName]);
    const mockDir = path.join(path.dirname(FunctionUtils.resolveHandler(functionName, fn.handler)), 'mocks');
    const mockPath = path.join(mockDir, `${mockName}.json`);

    if (!(await fs.exists(mockPath))) {
      throw new Error(context.i18n.t('mock_with_name_not_defined', { functionName, mockName }));
    }

    return fs.readFile(mockPath, { encoding: 'utf8' });
  }

  static async generateMock(
    context: Context,
    { name, functionName, projectPath = '.', silent }: MockGenerationOptions,
  ) {
    let config = ProjectController.loadConfigFile(context, projectPath) || {
      functions: {},
    };

    if (!_.has(config, ['functions', functionName])) {
      throw new Error(context.i18n.t('function_with_name_not_defined', { name: functionName }));
    }

    const fn = _.get(config, ['functions', functionName]);
    const mockDir = path.join(path.dirname(FunctionUtils.resolveHandler(functionName, fn.handler)), 'mocks');
    const mockPath = path.join(mockDir, `${name}.json`);

    if (await fs.exists(mockPath)) {
      throw new Error(
        context.i18n.t('mock_with_name_already_defined', {
          mockName: name,
          functionName,
        }),
      );
    }

    const type: ExtensionType = fn.type?.split('.')[0];
    const triggerType: TriggerType = fn.type?.split('.')[1];
    const triggerOperation: TriggerOperation = fn.operation?.split('.')[1];

    processTemplate(
      context,
      {
        dirPath: path.join(projectPath, mockDir),
        templatePath: path.join(
          FunctionUtils.resolveTemplatePath(context, type, { operation: triggerOperation, type: triggerType }),
          'mocks',
        ),
      },
      { silent },
      { mockName: name },
    );

    if (!silent) {
      context.logger.info('');

      context.logger.info(
        context.i18n.t('generate_mock_success', {
          name,
        }),
      );
    }
  }
}

type ProcessTemplateOptions = {
  syntax?: SyntaxType;
  silent?: boolean;
  mocks?: boolean;
};

const processTemplate = (
  context: Context,
  { dirPath, templatePath }: { dirPath: string; templatePath: string },
  { syntax, silent, mocks }: ProcessTemplateOptions,
  options?: Object,
) => {
  fs.ensureDirSync(dirPath);

  fs.readdirSync(templatePath).forEach(file => {
    if (file.indexOf('.') === -1) {
      if (file !== 'mocks' || mocks) {
        processTemplate(
          context,
          {
            dirPath: path.join(dirPath, file),
            templatePath: path.join(templatePath, file),
          },
          {
            syntax,
            silent,
            mocks,
          },
          options,
        );
      }

      return;
    }

    if (new RegExp(`.${syntax === SyntaxType.js ? SyntaxType.ts : SyntaxType.js}.ejs$`).test(file)) {
      return;
    }

    const data = fs.readFileSync(path.resolve(templatePath, file), { encoding: 'utf8' });

    const content = ejs.compile(data)({
      ...options,
      _,
    });

    let fileName = file.replace(/\.ejs$/, '');

    fileName = fileName.replace('request', _.get(options, 'mockName'));

    fs.writeFileSync(path.resolve(dirPath, fileName), content);

    if (!silent) {
      context.logger.info(
        context.i18n.t('project_created_file', {
          path: path.join(dirPath, fileName),
        }),
      );
    }
  });
};

namespace ResolverUtils {
  /**
   * @argument types project, { functionName: type }
   * Function resolve graphql type for each function.
   * we have to know function type (mutation, query) for compile schema on the server side
   */
  export function resolveGqlFunctionTypes(
    resolvers: ResolverDefinition[],
    types: { [functionName: string]: GraphQLFunctionType },
  ): ResolverDefinition[] {
    resolvers.forEach(func => {
      const type = types[func.name];
      if (_.isNil(type)) {
        throw new Error(`Cannot define graphql type for function "${func.name}"`);
      }
      func.gqlType = type;
    });
    return resolvers;
  }
}

namespace FunctionUtils {
  export function resolveHandler(name: string, handler: any): string {
    if (_.isString(handler?.code)) {
      return handler.code;
    }
    throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, `handler is invalid for function "${name}"`);
  }

  export function validateFunctionDefinition(func: any, name: string, projectPath?: string) {
    const pathToWorkDir = projectPath || StaticConfig.rootExecutionDir;

    if (_.isNil(func.handler)) {
      throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, `handler is absent for function "${name}"`);
    }

    if (func.handler.code && !fs.existsSync(path.join(pathToWorkDir, func.handler.code))) {
      throw new InvalidConfiguration(
        StaticConfig.serviceConfigFileName,
        `unable to determine function "${name}" source code`,
      );
    }

    if (!StaticConfig.supportedCompileExtension.has(path.extname(func.handler.code))) {
      throw new InvalidConfiguration(
        StaticConfig.serviceConfigFileName,
        `function "${name}" has unsupported file extension`,
      );
    }
  }

  /**
   *
   * @param type "resolver", "trigger.before", "trigger.after", "task", "webhook"
   * @param functionName
   * @return FunctionType
   */
  export function resolveFunctionType(type: string, functionName: string): ExtensionType {
    const funcType = type?.split('.')[0];
    const resolvedType = (<any>ExtensionType)[funcType];
    if (_.isNil(resolvedType)) {
      throw new InvalidConfiguration(
        StaticConfig.serviceConfigFileName,
        `Invalid function type ${type} in function ${functionName}`,
      );
    }

    return <ExtensionType>resolvedType;
  }

  export const resolveFunctionName = (type: ExtensionType, name: string, options: FunctionDeclarationOptions) => {
    return type === ExtensionType.trigger ? _.camelCase(`${options.type}_${name}_${options.operation}`) : name;
  };

  export const resolveTemplatePath = (context: Context, type: string, options: FunctionDeclarationOptions) => {
    const pathParts = [type];

    if (type === ExtensionType.trigger) {
      pathParts.push(options.operation, options.type);
    }

    return path.resolve(context.config.functionTemplatesPath, ...pathParts);
  };

  export const resolveFunctionDir = (type: ExtensionType, name: string, options: FunctionDeclarationOptions) => {
    return type === ExtensionType.trigger ? `src/${type}s/${name}/${options.operation}` : `src/${type}s/${name}`;
  };
}

namespace TriggerUtils {
  export function resolveTriggerOperation(operation: string, funcName: string): TriggerOperation {
    if (!_.values<string>(TriggerOperation).includes(operation)) {
      throw new InvalidConfiguration(
        StaticConfig.serviceConfigFileName,
        `Invalid trigger operation ${operation} in function ${funcName}`,
      );
    }

    return <TriggerOperation>operation;
  }

  /**
   *
   * @param type "resolve", "trigger.before", "trigger.after", "subscription"
   * @param functionName
   * @return TriggerStageType
   */
  export function resolveTriggerType(type: string, functionName: string): TriggerType {
    const triggerType = type.split('.')[1];
    if (!_.values<string>(TriggerType).includes(triggerType)) {
      throw new InvalidConfiguration(
        StaticConfig.serviceConfigFileName,
        `Invalid trigger type ${type} in function ${functionName}`,
      );
    }

    return <TriggerType>triggerType;
  }
}
