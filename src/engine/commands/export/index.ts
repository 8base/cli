import * as fs from 'fs-extra';
import yargs from 'yargs';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { exportTables } from '@8base/api-client';

export default {
  command: 'export',
  handler: async (params: { file: string; workspace?: string }, context: Context) => {
    context.spinner.start(context.i18n.t('export_in_progress'));

    if (params.workspace) {
      await context.checkWorkspace(params.workspace);
    }

    const gqlRequest = context.request.bind(context);

    const tables = await exportTables((query, variables) => gqlRequest(query, variables, true, params.workspace));

    const exportResult = {
      tables,
      version: context.version,
    };

    await fs.writeFile(params.file, JSON.stringify(exportResult, null, 2));

    context.spinner.stop();
  },

  describe: translations.i18n.t('export_describe'),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('export_usage'))
      .option('file', {
        alias: 'f',
        describe: translations.i18n.t('export_file_describe'),
        type: 'string',
        demandOption: translations.i18n.t('export_file_required_option_error'),
        requiresArg: true,
      })
      .option('workspace', {
        alias: 'w',
        describe: translations.i18n.t('export_workspace_describe'),
        type: 'string',
        requiresArg: true,
      });
  },
};
