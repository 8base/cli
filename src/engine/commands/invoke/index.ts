import * as yargs from 'yargs';

import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { GraphqlActions } from '../../../consts/GraphqlActions';
import { Utils } from '../../../common/utils';
import { InvokeParams, resolveInvocationArgs } from './util';

export default {
  command: 'invoke <name>',

  handler: async (params: InvokeParams, context: Context) => {
    const { name: functionName } = params;
    context.initializeProject();

    context.spinner.start(context.i18n.t('invoke_in_progress'));

    const args = resolveInvocationArgs(context, params);

    try {
      const resultResponse = await context.request(GraphqlActions.invoke, {
        data: { functionName, inputArgs: args },
      });

      context.spinner.stop();
      context.logger.info('Result:');
      context.logger.info(Utils.jsonPrettify({ data: JSON.parse(resultResponse.invoke.responseData) }));
    } catch (e) {
      context.spinner.stop();
      context.logger.info('Result:');
      context.logger.info(Utils.jsonPrettify({ data: { [functionName]: null }, errors: e.response.errors }));

      throw new Error(translations.i18n.t('invoke_returns_error', { name: functionName }));
    }
  },
  describe: translations.i18n.t('invoke_describe'),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('invoke_usage'))
      .positional('name', {
        describe: translations.i18n.t('invokelocal_name_describe'),
        type: 'string',
      })
      .option('data-json', {
        alias: 'j',
        describe: translations.i18n.t('invoke_data_json_describe'),
        type: 'string',
      })
      .option('data-path', {
        alias: 'p',
        describe: translations.i18n.t('invoke_data_path_describe'),
        type: 'string',
      })
      .option('mock', {
        alias: 'm',
        describe: translations.i18n.t('invoke_mock_describe'),
        type: 'string',
      });
  },
};
