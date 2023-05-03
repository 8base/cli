import yargs from 'yargs';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { Utils } from '../../../common/utils';
import { BuildController } from '../../controllers/buildController';
import { Colors } from '../../../consts/Colors';
import { InvokeLocalError } from '../../../errors/invokeLocal';
import { ProjectController } from '../../controllers/projectController';

const getLocalFunction = async (functionName: string, context: Context) => {
  const { compiledFiles } = await BuildController.compile(context);

  const functionInfo = context.project.extensions.functions.find(r => r.name === functionName);

  if (!functionInfo) {
    throw new Error(`Function ${chalk.hex(Colors.yellow)(functionName)} not present.`);
  }

  const safeFunctionPath = functionInfo.pathToFunction.substring(0, functionInfo.pathToFunction.lastIndexOf('.'));

  const functionPath = compiledFiles.find((f: any) => f.search(safeFunctionPath) > 0);

  context.logger.debug(`Function full path: ${functionPath}`);

  const { result, error } = Utils.safeExecution(() => require(functionPath));

  if (error) {
    throw new InvokeLocalError(error.message, functionInfo.name, functionPath);
  }

  return Utils.undefault(result);
};

export default {
  command: 'invoke-local <name>',
  handler: async (params: any, context: Context) => {
    context.initializeProject();

    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

    context.spinner.start(context.i18n.t('invoke_local_in_progress'));

    const functionToCall = await getLocalFunction(params.name, context);

    let args = null;

    if (params.m) {
      args = await ProjectController.getMock(context, params.name, params.m);
    } else if (params.p) {
      args = await fs.readFile(params.p);
    } else if (params.j) {
      args = params.j;
    }

    let resultResponse = null;
    let resultError = null;

    const ctx = {
      api: {
        gqlRequest: context.request.bind(context),
      },
      invokeFunction: async (functionName: string, args: any) => {
        const functionToCall = await getLocalFunction(functionName, context);

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
      workspaceId: context.workspaceId,
    };

    try {
      resultResponse = await functionToCall(JSON.parse(args), ctx);
    } catch (e) {
      resultError = e;
    }

    await BuildController.clearBuild(context);

    context.spinner.stop();

    context.logger.info('Result:');

    if (resultError) {
      context.logger.info(
        JSON.stringify(
          {
            data: {
              [params.name]: null,
            },
            errors: [
              {
                message: String(resultError.message),
                path: [params.name],
                locations: [
                  {
                    line: 2,
                    column: 5,
                  },
                ],
                code: null,
                details: null,
              },
            ],
          },
          null,
          2,
        ),
      );

      throw new Error(translations.i18n.t('invoke_local_returns_error', { name: params.name }));
    } else {
      context.logger.info(JSON.stringify(resultResponse, null, 2));
    }
  },
  describe: translations.i18n.t('invoke_local_describe'),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('invoke_local_usage'))
      .positional('name', {
        describe: translations.i18n.t('invoke_local_function_name_describe'),
        type: 'string',
      })
      .option('data-json', {
        alias: 'j',
        describe: translations.i18n.t('invoke_local_data_json_describe'),
        type: 'string',
      })
      .option('data-path', {
        alias: 'p',
        describe: translations.i18n.t('invoke_local_data_path_describe'),
        type: 'string',
      })
      .option('mock', {
        alias: 'm',
        describe: translations.i18n.t('invoke_local_mock_describe'),
        type: 'string',
      });
  },
};
