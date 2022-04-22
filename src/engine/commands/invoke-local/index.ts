import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { Utils } from '../../../common/utils';
import { BuildController } from '../../controllers/buildController';
import { Colors } from '../../../consts/Colors';
import { InvokeLocalError } from '../../../errors/invokeLocal';
import { InvokeParams, resolveInvocationArgs } from '../invoke/util';

export default {
  command: 'invoke-local <name>',

  handler: async (params: InvokeParams, context: Context) => {
    const { name: functionName } = params;
    context.initializeProject();

    loadLocalDotenv();

    context.spinner.start(context.i18n.t('invokelocal_in_progress'));

    const functionToCall = await resolveLocalFunctionHandler(functionName, context);

    const args = resolveInvocationArgs(context, params);

    try {
      const ctx = mockFunctionContext(context);
      const responseData = await functionToCall(JSON.parse(args || '{}'), ctx);

      context.spinner.stop();
      context.logger.info('Result:');
      context.logger.info(Utils.jsonPrettify(responseData));
    } catch (e) {
      context.spinner.stop();
      context.logger.info('Result:');
      context.logger.info(Utils.jsonPrettify({ data: { [functionName]: null }, errors: [e.message] }));

      throw new Error(translations.i18n.t('invokelocal_returns_error', { name: functionName }));
    } finally {
      BuildController.clearBuild(context);
    }
  },
  describe: translations.i18n.t('invokelocal_describe'),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('invokelocal_usage'))
      .positional('name', {
        describe: translations.i18n.t('invokelocal_name_describe'),
        type: 'string',
      })
      .option('data-json', {
        alias: 'j',
        describe: translations.i18n.t('invokelocal_data_json_describe'),
        type: 'string',
      })
      .option('data-path', {
        alias: 'p',
        describe: translations.i18n.t('invokelocal_data_path_describe'),
        type: 'string',
      })
      .option('mock', {
        alias: 'm',
        describe: translations.i18n.t('invokelocal_mock_describe'),
        type: 'string',
      });
  },
};

const mockFunctionContext = (context: Context) => {
  const ctx = {
    api: {
      gqlRequest: context.request.bind(context),
    },
    invokeFunction: async (functionName: string, args: any) => {
      const functionToCall = await resolveLocalFunctionHandler(functionName, context);

      let result: any = null;

      try {
        result = await functionToCall(args, ctx);
      } catch (e) {
        return {
          completed: false,
          error: String(e),
          result,
        };
      }

      return {
        completed: true,
        error: null,
        result,
      };
    },
    workspaceId: context.workspaceConfig.workspaceId,
  };

  return ctx;
};

const resolveLocalFunctionHandler = async (functionName: string, context: Context): Promise<CallableFunction> => {
  const { compiledFiles } = await BuildController.compile(context);

  const functionInfo = context.project.extensions.functions.find(r => r.name === functionName);

  if (!functionInfo) {
    throw new Error(`Function ${chalk.hex(Colors.yellow)(functionName)} not present.`);
  }

  const safeFunctionPath = functionInfo.pathToFunction.substring(0, functionInfo.pathToFunction.lastIndexOf('.'));

  const functionPath = compiledFiles.find((f) => f.search(safeFunctionPath) > 0);

  context.logger.debug(`Function full path: ${functionPath}`);

  const { result, error } = Utils.safeExecution(() => require(functionPath));

  if (error) {
    throw new InvokeLocalError(error.message, functionInfo.name, functionPath);
  }

  return Utils.undefault(result);
};

const loadLocalDotenv = () => {
  const LOCAL_ENV_FILE = '.env.local';
  const envLocalPath = path.resolve(process.cwd(), LOCAL_ENV_FILE);

  if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    return;
  }

  console.warn(translations.i18n.t('invoke_local_warning_env_file'));
};
