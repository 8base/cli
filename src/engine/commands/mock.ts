import * as yargs from 'yargs';

import { Context } from '../../common/context';
import { translations } from '../../common/translations';
import { ExtensionType, SyntaxType } from '../../interfaces/Extensions';
import { ProjectController } from '../controllers/projectController';

type ResolverParams = {
  name: string;
  mockName: string;
  silent: boolean;
};

export default {
  command: 'mock <name>',

  handler: async (params: ResolverParams, context: Context) => {
    let { name, mockName, silent } = params;

    ProjectController.generateMock(context, {
      name: mockName,
      silent,
      functionName: name,
    });
  },

  describe: translations.i18n.t('generate_mock_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_mock_usage'))
      .option('silent', {
        describe: translations.i18n.t('silent_describe'),
        default: false,
        type: 'boolean',
      })
      .option('mockName', {
        alias: 'm',
        describe: translations.i18n.t('generate_mock_name_describe'),
        default: 'request',
        type: 'string',
      }),
};
