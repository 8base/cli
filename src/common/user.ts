import * as path from "path";
import * as _ from "lodash";
import { UserDataStorage } from "./userDataStorage";
import { StorageParameters } from "../consts/StorageParameters";

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
