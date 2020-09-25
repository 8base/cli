import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { Interactive } from '../../../../common/interactive';
import { UserDataStorage } from '../../../../common/userDataStorage';
import { StorageParameters } from '../../../../consts/StorageParameters';
import { PredefineData } from '../../../../config/predefineData';
import { StaticConfig } from '../../../../config';
import logout from '../../logout';

export enum RegionModeType {
  us = 'us',
  uk = 'uk',
}

const AvailableRegions = [RegionModeType.uk, RegionModeType.us];

export default {
  command: 'region',

  handler: async (params: any, context: Context) => {
    let { region } = params;

    if (!region) {
      ({ region } = await Interactive.ask({
        name: 'region',
        type: 'select',
        message: translations.i18n.t('select_region'),
        choices: AvailableRegions.map((r: any) => ({ title: r, value: r })),
      }));
    }

    if (!AvailableRegions.includes(region)) {
      throw new Error(translations.i18n.t('prevent_project_region_select'));
    }

    const staticData = new PredefineData();
    if (region === RegionModeType.uk) {
      UserDataStorage.setValues([
        { name: StorageParameters.serverAddress, value: staticData.remoteAddressWithRegion(region) },
      ]);
      UserDataStorage.setValues([
        { name: StorageParameters.webAddress, value: staticData.webAddressWithRegion(region) },
      ]);
    } else if (region === RegionModeType.us) {
      UserDataStorage.setValues([{ name: StorageParameters.serverAddress, value: StaticConfig.remoteAddress }]);
      UserDataStorage.setValues([{ name: StorageParameters.webAddress, value: StaticConfig.webClientAddress }]);
    }

    context.cleanWorkspaceConfig();
  },

  describe: translations.i18n.t('project_region_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('project_region_usage')).option('region', {
      alias: 'r',
      describe: translations.i18n.t('project_region_param_describe'),
      type: 'string',
      choices: Object.values(RegionModeType),
    }),
};
