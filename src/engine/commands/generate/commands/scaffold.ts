import yargs from 'yargs';

import { translations } from '../../../../common/translations';

export default {
  command: 'scaffold <tableName>',
  describe: translations.i18n.t('generate_scaffold_describe'),
  deprecated: translations.i18n.t('generate_scaffold_deprecated'),
  handler: () => {
    throw new Error(translations.i18n.t('generate_scaffold_deprecated'));
  },
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t('generate_scaffold_usage')).positional('tableName', {
      describe: translations.i18n.t('generate_scaffold_table_name'),
      type: 'string',
    });
  },
};
