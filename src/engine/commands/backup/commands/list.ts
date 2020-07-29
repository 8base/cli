import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { table } from 'table';
import { GraphqlActions } from '../../../../consts/GraphqlActions';

const BACKUP_HEADER = ['Name', 'Size (Mb)'];

export default {
  command: 'list',
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    const res = await context.request(GraphqlActions.backupList);
    context.logger.info(table([BACKUP_HEADER, ...res.system.backups.items.map((i: any) => [i.name, i.size])]));
  },

  describe: translations.i18n.t('backup_list_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('backup_list_usage')),
};
