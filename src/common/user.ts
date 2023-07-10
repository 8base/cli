import _ from 'lodash';

import { UserDataStorage } from './userDataStorage';
import { StorageParameters } from '../consts/StorageParameters';

export class User {
  private static storage = UserDataStorage;

  static isAuthorized() {
    const idToken = this.storage.getValue(StorageParameters.idToken);

    return !_.isEmpty(idToken);
  }
}
