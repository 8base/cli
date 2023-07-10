import yargs from 'yargs';
import * as path from 'node:path';
import _ from 'lodash';
import AdmZip from 'adm-zip';

import { StaticConfig } from '../../../../config';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectController } from '../../../controllers/projectController';
import { Utils } from '../../../../common/utils';
import { DEFAULT_ENVIRONMENT_NAME } from '../../../../consts/Environment';

type PluginInstallParams = {
  name: string;
};

type ProjectType = { name: string; gitHubUrl: string };

const PLUGINS_LIST_QUERY = `
  query PluginsList {
    pluginsList {
      items {
        name
        gitHubUrl
      }
    }
  }
`;

export default {
  command: 'install <name>',

  handler: async (params: PluginInstallParams, context: Context) => {
    const { name } = params;

    let plugins = _.get(
      await context.request<any, { pluginsList: { items: ProjectType[] } }>(PLUGINS_LIST_QUERY, undefined, {
        customWorkspaceId: StaticConfig.pluginsWorkspaceId,
        customEnvironment: DEFAULT_ENVIRONMENT_NAME,
      }),
      ['pluginsList', 'items'],
    );

    const plugin = _.find<ProjectType>(plugins, { name });

    if (!plugin) {
      throw new Error(
        context.i18n.t('plugin_install_cant_find', {
          name,
        }),
      );
    }

    let zip: AdmZip;
    try {
      zip = await Utils.downloadArchive(`${plugin.gitHubUrl}/archive/master.zip`);
    } catch (e) {
      throw new Error(
        context.i18n.t('plugin_install_cant_download', {
          name,
        }),
      );
    }

    const zipEntries = zip.getEntries();

    zipEntries.forEach(zipEntry => {
      if (!zipEntry.isDirectory) {
        let targetPath = zipEntry.entryName.replace(/^[^\/]+\//, '');

        const filePath = `plugins/${name}/${targetPath}`;

        targetPath = targetPath.replace(/\/?[^\/]+$/, '');

        targetPath = path.resolve(`./plugins/${name}/${targetPath}`);

        zip.extractEntryTo(zipEntry.entryName, targetPath, false, true);

        context.logger.info(
          context.i18n.t('project_created_file', {
            path: filePath,
          }),
        );
      }
    });

    ProjectController.addPluginDeclaration(
      context,
      _.camelCase(name),
      {
        name,
        path: `plugins/${name}/${StaticConfig.projectConfigFilename}`,
      },
      '.',
    );

    context.logger.info(
      context.i18n.t('plugin_successfully_install', {
        name,
      }),
    );
  },

  describe: translations.i18n.t('plugin_install_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('plugin_install_usage')).positional('name', {
      describe: translations.i18n.t('plugin_install_name_describe'),
      type: 'string',
    }),
};
