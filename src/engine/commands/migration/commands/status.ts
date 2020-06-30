import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from "../../../../consts/GraphqlActions";
import { ProjectConfigurationState } from "../../../../common/configuraion";
import chalk from "chalk";
import { Colors } from "../../../../consts/Colors";
import { table } from "table";
import _ = require('lodash');

export default {
  command: 'status',

  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    const { output } = params;
    const { environment } = context.workspaceConfig;
    const { system } = await context.request(GraphqlActions.migrationStatus, { environmentId: environment.id, output });
    const { status, migrations } = system.ciStatus;
    context.logger.info(`${chalk.hex(Colors.green)('Status:')}: '${status}'`);
    if (migrations && !_.isEmpty(migrations))
      context.logger.info(table([["migrations"], ... migrations.map((m:any)=> ([m])) ]));
  },

  describe: translations.i18n.t('migration_status_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('migration_status_usage'))
};
