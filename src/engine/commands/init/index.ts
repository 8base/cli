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
import { ExtensionType, SyntaxType } from '../../../interfaces/Extensions';
import { Interactive } from '../../../common/interactive';
import { DEFAULT_ENVIRONMENT_NAME, DEFAULT_REMOTE_ADDRESS } from '../../../consts/Environment';
import { Workspace } from '../../../interfaces/Common';

const CREATE_WORKSPACE_MUTATION = `
  mutation WorkspaceCreate($data: WorkspaceCreateMutationInput!) {
    workspaceCreate(data: $data) {
      id
    }
  }
`;

const isEmptyDir = async (path: string): Promise<boolean> => {
  let files = [];

  try {
    files = await fs.readdir(path);
  } catch (e) {}

  return files.length === 0;
};

export default {
  command: 'init',

  handler: async (params: any, context: Context) => {
    const { functions, empty, syntax, mocks, silent } = params;

    let { workspaceId, host } = params;

    const [, projectName] = _.castArray(params._);

    const { errors = [] } = validatePackageName(projectName);

    if (errors.length > 0) {
      throw new Error(
        translations.i18n.t('init_invalid_project_name', {
          validationMessages: errors.join(', '),
        }),
      );
    }

    const project = projectName
      ? {
          fullPath: path.join(context.config.rootExecutionDir, projectName),
          name: projectName,
        }
      : {
          fullPath: context.config.rootExecutionDir,
          name: path.basename(context.config.rootExecutionDir),
        };

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
        const [type, name] = declaration.split(':');

        if (!(type in ExtensionType)) {
          throw new Error(translations.i18n.t('init_invalid_function_type', { type }));
        }

        if (!name) {
          throw new Error(translations.i18n.t('init_undefined_function_name'));
        }
      });
    }

    if (!workspaceId) {
      const workspaces = await context.getWorkspaces();

      ({ workspaceId } = await Interactive.ask({
        name: 'workspaceId',
        type: 'select',
        message: translations.i18n.t('init_select_workspace'),
        choices: [
          {
            title: '<New Workspace>',
            value: 'NEW_WORKSPACE',
          },
          ...workspaces.map((workspace: any) => ({
            title: workspace.name,
            value: workspace.id,
          })),
        ],
      }));

      if (workspaceId === 'NEW_WORKSPACE') {
        const { workspaceName } = await Interactive.ask({
          name: 'workspaceName',
          type: 'text',
          message: translations.i18n.t('init_workspace_name_labal'),
        });

        if (!workspaceName) {
          throw new Error(translations.i18n.t('init_prevent_new_workspace'));
        } else {
          const { workspaceCreate } = await context.request(CREATE_WORKSPACE_MUTATION, {
            data: {
              name: workspaceName,
            },
          });

          workspaceId = workspaceCreate.id;
        }
      }

      if (!workspaceId) {
        throw new Error(translations.i18n.t('init_prevent_select_workspace'));
      }

      const workspace = _.find<Workspace>(await context.getWorkspaces(), { id: workspaceId });
      if (!workspace) {
        throw new Error(context.i18n.t('workspace_with_id_doesnt_exist', { id: workspaceId }));
      }

      host = workspace.apiHost;
    }

    context.spinner.start(`Initializing new project ${chalk.hex(Colors.yellow)(project.name)}`);

    context.logger.debug('start initialize init command');

    context.logger.debug(`initialize success: initialize repository: ${project.name}`);

    let files = getFileProvider().provide(context);
    context.logger.debug('files provided count = ' + files.size);

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
    if (!empty && Array.isArray(params.functions)) {
      await Promise.all(
        params.functions.map(async (declaration: string) => {
          const [type, name] = declaration.split(':');

          await ProjectController.generateFunction(context, {
            type: <ExtensionType>type,
            name,
            mocks,
            syntax,
            projectPath: projectName,
            silent: true,
          });
        }),
      );
    }

    await context.createWorkspaceConfig(
      {
        workspaceId,
        environmentName: DEFAULT_ENVIRONMENT_NAME,
        apiHost: host || DEFAULT_REMOTE_ADDRESS,
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
        default: ['resolver:resolver', 'task:task', 'webhook:webhook', 'trigger:trigger'],
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
      })
      .option('host', {
        describe: translations.i18n.t('init_workspace_host_describe'),
        type: 'string',
        default: DEFAULT_REMOTE_ADDRESS,
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
