import yargs from 'yargs';
import * as path from 'path';
import * as _ from 'lodash';
import AdmZip from 'adm-zip';
import gqlRequest from 'graphql-request';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectController } from '../../../controllers/projectController';
import { Utils } from '../../../../common/utils';

type PluginInstallParams = {
  name: string;
};

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

type ProjectType = { name: string; gitHubUrl: string };

export default {
  command: 'install <name>',

  handler: async (params: PluginInstallParams, context: Context) => {
    const { name } = params;

    let plugins = _.get(
      await gqlRequest<{ pluginsList: { items: ProjectType[] } }>(
        'https://api.8base.com/ck16gpwki001f01jgh4kvd54j',
        PLUGINS_LIST_QUERY,
      ),
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

    let data: Buffer;
    try {
      const { response, error } = await Utils.checkHttpResponse(
        fetch(`${plugin.gitHubUrl}/archive/master.zip`, { method: 'GET' }),
      );
      if (error) {
        throw error;
      }
      data = Buffer.from(await response.arrayBuffer());
    } catch (e) {
      throw new Error(
        context.i18n.t('plugin_install_cant_download', {
          name,
        }),
      );
    }

    const zip = new AdmZip(data);

    const zipEntries = zip.getEntries();

    zipEntries.forEach((zipEntry: any) => {
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
        path: `plugins/${name}/8base.yml`,
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
