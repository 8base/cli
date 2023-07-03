import * as fs from 'fs-extra';
import yargs from 'yargs';
import * as _ from 'lodash';
import 'isomorphic-fetch';

import { Context } from '../../../common/context';
import { Utils } from '../../../common/utils';
import { translations } from '../../../common/translations';
import { GraphqlActions } from '../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../common/configuraion';

type IntrospectionParams = { file: string };

export default {
  command: 'introspection',
  handler: async (params: IntrospectionParams, context: Context) => {
    await ProjectConfigurationState.expectConfigured(context);

    context.spinner.start(translations.i18n.t('introspection_in_progress'));

    const data = await context.request(GraphqlActions.introspection);
    const introspectionUrl = data?.system?.introspection?.url;

    if (!introspectionUrl) {
      throw new Error(translations.i18n.t('introspection_fetch_failed'));
    }

    const introspectionRequest = await Utils.checkHttpResponse(fetch(introspectionUrl, { method: 'GET' }));
    const introspectionContent = await introspectionRequest.text();

    await fs.writeFile(params.file, introspectionContent);

    context.spinner.stop();
  },

  describe: translations.i18n.t('introspection_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('introspection_usage')).option('file', {
      alias: 'f',
      describe: translations.i18n.t('introspection_file_describe'),
      type: 'string',
      demandOption: translations.i18n.t('introspection_file_required_option_error'),
      requiresArg: true,
    }),
};
