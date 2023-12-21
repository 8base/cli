#!/usr/bin/env node

import yargs from 'yargs';
import latestVersion from 'latest-version';
import chalk from 'chalk';

import { StaticConfig } from './config';
import { Utils } from './common/utils';
import { translations, Translations } from './common/translations';
import { Context } from './common/context';

const pkg = require('../package.json');

const start = async (translations: Translations, context: Context) => {
  if (!Utils.currentLocalNodeVersionIsProjectVersion(context)) {
    context.logger.info(
      context.i18n.t('nodeversion_deprecation_advice', {
        projectversion: context.projectConfig.settings.nodeVersion,
        localversion: process.version.slice(1, 3),
      }),
    );
  }
  const argv = await yargs
    .scriptName('8base')
    .usage(translations.i18n.t('8base_usage'))
    .commandDir(StaticConfig.commandsDir, {
      extensions: ['js'],
      recurse: true,
      visit: Utils.commandDirMiddleware(StaticConfig.commandsDir),
    })
    .alias('version', 'v')
    .option('v', {
      global: false,
    })
    .option('debug', {
      alias: 'd',
      describe: 'Turn on debug logs',
      type: 'boolean',
    })
    .recommendCommands()
    .strict()
    .fail((msg, err) => {
      // certain yargs validations throw strings :P
      const actual = err || new Error(msg);

      // ValidationErrors are already logged, as are package errors
      if (actual.name !== 'ValidationError') {
        if (/Did you mean/.test(actual.message)) {
          console.error('Unknown command');
        }

        console.error(actual.message);
      }

      process.exit(0);
    })
    .detectLocale(false)
    .help()
    .alias('help', 'h')
    .updateStrings({
      'Examples:': 'EXAMPLES',
      'Commands:': 'COMMANDS',
      'Options:': 'OPTIONS',
      'Positionals:': 'POSITIONALS',
    })
    .wrap(yargs.terminalWidth()).argv;

  if (!argv._[0]) {
    yargs.showHelp();
  }
};

translations
  .init()
  .then(async (translations: Translations) => {
    try {
      const last = await latestVersion(pkg.name);

      if (pkg.version !== last && process.env.SKIP_VERSION_CHECK !== 'true') {
        // eslint-disable-next-line no-console
        console.log(chalk.yellow(translations.i18n.t('8base_new_version', { last })));
      }
    } catch (e) {}

    await start(translations);
  })
  .catch(err => console.error(err.message));
