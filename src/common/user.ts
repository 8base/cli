import * as _ from 'lodash';
import { StorageParameters } from '../consts/StorageParameters';
import { UserDataStorage } from './userDataStorage';

type Workspace = {
  name: string;
  id: string;
};

export class User {
  private static storage = UserDataStorage;

  static isAuthorized() {
    const idToken = this.storage.getValue(StorageParameters.idToken);

    return !_.isEmpty(idToken);
  }
}
