import { Context } from './context';
import { StorageParameters } from '../consts/StorageParameters';
import { Utils } from './utils';

export namespace Selectors {
  export const getServerAddress = (context: Context) =>
    Utils.trimLastSlash(context.storage.getValue(StorageParameters.serverAddress) || context.config.remoteAddress);
}
