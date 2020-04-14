import chalk from 'chalk';
import errorCodes from '@8base/error-codes';
import * as _ from 'lodash';

import { Translations } from '../../common/translations';
import { Context } from '../../common/context';
import { Colors } from '../../consts/Colors';

const NON_PROJECT_COMMANDS = ['init', 'login', 'logout', 'configure', 'plugin list', 'p list', 'whoami', 'environment list'];

const ERROR_CODES_TO_PRINT_MESSAGES = [errorCodes.BillingFeatureAccessErrorCode]

const hasWorkspaceNotFoundError = (response: any) => {
  const errors = _.get(response, 'errors', []);

  return _.some(errors, { code: errorCodes.EntityNotFoundErrorCode, details: { workspaceId: 'Workspace not found' } });
};

export class CommandController {
  static parseError = (error: any) => {
    if (
      error.response &&
      error.response.errors &&
      error.response.errors.length > 0 &&
      error.response.errors[0].message
    ) {
      const internalError = error.response.errors[0];
      if (ERROR_CODES_TO_PRINT_MESSAGES.some(m => m===internalError.code)) {
        return internalError.message;
      }

      if (internalError.details) {
        const keys = Object.keys(internalError.details);
        if (keys.length > 0) {
          return internalError.details[keys[0]];
        }
      }
      return internalError.message;
    }

    return error.message;
  };

  static wrapHandler = (handler: Function, translations: Translations) => {
    return async (params: any) => {
      const command = params._[0];

      const context = new Context(params, translations);

      const start = Date.now();

      try {
        if (NON_PROJECT_COMMANDS.indexOf(command) === -1 && NON_PROJECT_COMMANDS.indexOf(params._.join(' ')) === -1) {
          if (!context.isProjectDir()) {
            throw new Error(translations.i18n.t('non_8base_project_dir'));
          }
        }

        await handler(params, context);

        context.spinner.stop();

        const time = Date.now() - start;

        context.logger.info(
          `${chalk.hex(Colors.green)(command)} done. Time: ${chalk.hex(Colors.green)(
            time.toLocaleString('en-US'),
          )} ms.`,
        );
      } catch (ex) {
        context.spinner.stop();

        if (hasWorkspaceNotFoundError(_.get(ex, 'response', {}))) {
          context.logger.error(translations.i18n.t('workspace_not_found'));
        } else {
          context.logger.error(`${CommandController.parseError(ex)}`);
        }

        const time = Date.now() - start;

        context.logger.error(`Time: ${chalk.hex(Colors.red)(time.toLocaleString('en-US'))} ms.`);
      }
    };
  };
}
