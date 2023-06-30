import * as _ from 'lodash';
import yargs from 'yargs';
import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import tree from 'tree-node-cli';
import validatePackageName from 'validate-npm-package-name';

import { getFileProvider } from './providers';
import { install } from './installer';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { Colors } from '../../../consts/Colors';
import { ProjectController } from '../../controllers/projectController';
import { ExtensionType, SyntaxType, TriggerOperation, TriggerType } from '../../../interfaces/Extensions';
import { Interactive } from '../../../common/interactive';
import { DEFAULT_ENVIRONMENT_NAME } from '../../../consts/Environment';
import { StaticConfig } from '../../../config';

type InitParams = {
  name: string;
  functions: string[];
  empty: boolean;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
  workspaceId?: string;
  host: string;
};

const isEmptyDir = async (path: string): Promise<boolean> => {
  let files = [];

  try {
    files = await fs.readdir(path);
  } catch (e) {}

  return files.length === 0;
};

export default {
  command: 'init [name]',

  handler: async (params: InitParams, context: Context) => {
    const { name, functions, empty, syntax, mocks, silent } = params;

    let { workspaceId, host } = params;

    const projectName = name || path.basename(context.config.rootExecutionDir);
    const fullPath = name ? path.join(context.config.rootExecutionDir, projectName) : context.config.rootExecutionDir;

    const { errors = [] } = validatePackageName(projectName);

    if (errors.length > 0) {
      throw new Error(
        translations.i18n.t('init_invalid_project_name', {
          validationMessages: errors.join(', '),
        }),
      );
    }

    const project = { fullPath, name: projectName };

    if (!(await isEmptyDir(project.fullPath))) {
      const { confirm } = await Interactive.ask({
        name: 'confirm',
        type: 'confirm',
        message: translations.i18n.t('init_confirm_not_empty_dir'),
        initial: false,
      });

      if (!confirm) {
        throw new Error(translations.i18n.t('init_canceled'));
      }
    }

    if (!empty && Array.isArray(functions)) {
      functions.forEach(declaration => {
        const [type, name, triggerOperation, triggerType] = declaration.split(':');

        if (!(type in ExtensionType)) {
          throw new Error(translations.i18n.t('init_invalid_function_type', { type }));
        }

        if (!name) {
          throw new Error(translations.i18n.t('init_undefined_function_name'));
        }

        if (type === ExtensionType.trigger && !(triggerOperation in TriggerOperation && triggerType in TriggerType)) {
          throw new Error(translations.i18n.t('init_incorrect_trigger'));
        }
      });
    }

    if (!workspaceId) {
      const workspaces = await context.getWorkspaces();

      ({ workspaceId } = await Interactive.ask({
        name: 'workspaceId',
        type: 'select',
        message: translations.i18n.t('init_select_workspace'),
        choices: workspaces.map(workspace => ({
          title: workspace.name,
          value: workspace.id,
        })),
      }));

      if (!workspaceId) {
        throw new Error(translations.i18n.t('init_prevent_select_workspace'));
      }

      const workspace = _.find(await context.getWorkspaces(), { id: workspaceId });
      if (!workspace) {
        throw new Error(context.i18n.t('workspace_with_id_doesnt_exist', { id: workspaceId }));
      }

      host = workspace.apiHost;
    }

    context.spinner.start(`Initializing new project ${chalk.hex(Colors.yellow)(project.name)}`);

    context.logger.debug('start initialize init command');

    context.logger.debug(`initialize success: initialize repository: ${project.name}`);

    let files = getFileProvider().provide(context);
    context.logger.debug(`files provided count = ${files.size}`);

    files.set(
      context.config.packageFileName,
      replaceServiceName(files.get(context.config.packageFileName), project.name),
    );

    context.logger.debug('try to install files');
    install(project.fullPath, files, context);

    context.spinner.stop();

    /* Creating new project message */
    const chalkedName = chalk.hex(Colors.yellow)(project.name);

    if (!silent) {
      context.logger.info(`Building a new project called ${chalkedName} 🚀`);
    }

    /* Generate project files before printing tree */
    if (!empty && Array.isArray(functions)) {
      await Promise.all(
        functions.map(async (declaration: string) => {
          const [type, functionName, triggerOperation, triggerType] = declaration.split(':');

          await ProjectController.generateFunction(
            context,
            {
              type: <ExtensionType>type,
              name: functionName,
              mocks,
              syntax,
              projectPath: name,
              silent: true,
            },
            { type: <TriggerType>triggerType, operation: <TriggerOperation>triggerOperation },
          );
        }),
      );
    }

    await context.createWorkspaceConfig(
      {
        workspaceId,
        environmentName: DEFAULT_ENVIRONMENT_NAME,
        apiHost: host || StaticConfig.apiAddress,
      },
      project.fullPath,
    );

    if (!silent) {
      const fileTree = tree(project.fullPath, {
        allFiles: true,
        exclude: [/node_modules/, /\.build/],
      });

      /* Print out tree of new project */
      context.logger.info(project.name);
      context.logger.info(fileTree.replace(/[^\n]+\n/, ''));

      /* Print project created message */
      context.logger.info(`🎉 Project ${chalkedName} was successfully created 🎉`);
    }
  },
  describe: translations.i18n.t('init_describe'),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('init_usage'))
      .positional('name', {
        describe: translations.i18n.t('init_name_describe'),
        type: 'string',
      })
      .option('functions', {
        alias: 'f',
        describe: translations.i18n.t('init_functions_describe'),
        type: 'array',
        default: ['resolver:resolver', 'task:task', 'webhook:webhook', 'trigger:Users:create:before'],
      })
      .option('empty', {
        alias: 'e',
        describe: translations.i18n.t('init_empty_describe'),
        default: false,
        type: 'boolean',
      })
      .option('mocks', {
        alias: 'x',
        describe: translations.i18n.t('generate_mocks_describe'),
        default: true,
        type: 'boolean',
      })
      .option('syntax', {
        alias: 's',
        describe: translations.i18n.t('generate_syntax_describe'),
        default: 'ts',
        type: 'string',
        choices: Object.values(SyntaxType),
        requiresArg: true,
      })
      .option('silent', {
        describe: translations.i18n.t('silent_describe'),
        default: false,
        type: 'boolean',
      })
      .option('workspaceId', {
        alias: 'w',
        describe: translations.i18n.t('init_workspace_id_describe'),
        type: 'string',
        requiresArg: true,
      })
      .option('host', {
        describe: translations.i18n.t('init_workspace_host_describe'),
        type: 'string',
        default: StaticConfig.apiAddress,
        requiresArg: true,
      })
      .example(translations.i18n.t('init_no_dir_example_command'), translations.i18n.t('init_example_no_dir'))
      .example(translations.i18n.t('init_with_dir_example_command'), translations.i18n.t('init_example_with_dir'));
  },
};

const replaceServiceName = (packageFile: string, repositoryName: string) => {
  let packageData = JSON.parse(packageFile);
  packageData.name = repositoryName;
  return JSON.stringify(packageData, null, 2);
};
