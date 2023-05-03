import yargs from 'yargs';
import * as fs from 'fs-extra';

import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { GraphqlActions } from '../../../consts/GraphqlActions';
import { ProjectController } from '../../controllers/projectController';

type InvokeParams = {
  name: string;
  'data-json'?: string;
  'data-path'?: string;
  mock?: string;
};
export default {
  command: 'invoke <name>',
  handler: async (params: InvokeParams, context: Context) => {
    context.initializeProject();

    context.spinner.start(context.i18n.t('invoke_in_progress'));

    let args = null;

    if (params.mock) {
      args = await ProjectController.getMock(context, params.name, params.mock);
    } else if (params['data-path']) {
      args = (await fs.readFile(params['data-path'])).toString();
    } else if (params['data-json']) {
      args = params['data-json'];
    }

    let resultResponse = null;
    let resultError = null;

    try {
      resultResponse = await context.request(GraphqlActions.invoke, {
        data: { functionName: params.name, inputArgs: args },
      });
    } catch (e) {
      resultError = e;
    }

    context.spinner.stop();

    context.logger.info('Result:');

    if (resultError) {
      context.logger.info(
        JSON.stringify(
          {
            data: {
              [params.name]: null,
            },
            errors: resultError.response.errors,
          },
          null,
          2,
        ),
      );

      throw new Error(translations.i18n.t('invoke_returns_error', { name: params.name }));
    } else {
      context.logger.info(
        JSON.stringify(
          {
            data: JSON.parse(resultResponse?.invoke.responseData),
          },
          null,
          2,
        ),
      );
    }
  },
  describe: translations.i18n.t('invoke_describe'),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('invoke_usage'))
      .positional('name', {
        describe: translations.i18n.t('invoke_function_name_describe'),
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
