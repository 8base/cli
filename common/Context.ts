import { UserDataStorage } from "./userDataStorage";
import { StaticConfig } from ".";
import { ProjectDefinition } from "../interfaces/Project";
import _ = require("lodash");
import { ProjectController } from "../engine/controllers/projectController";
import { StorageParameters } from "../consts/StorageParameters";
import * as winston from "winston";
import { Utils } from "./utils";
import * as i18next       from "i18next";
import * as Ora from "ora";

const { Client } = require("@8base/api-client");

export class Translations {
  i18n: i18next.i18n;
  async init(): Promise<Translations> {
    await Utils.initTranslations(i18next);
    this.i18n = i18next.cloneInstance({initImmediate: false});
    return this;
  }
}

export class Context {

  private _project: ProjectDefinition = null;

  logger: winston.Logger;

  i18n: i18next.i18n;

  spinner = new Ora({
    color: "white",
    text: "\n"
  });

  constructor(params: any, translations: Translations) {
    this.logger = winston.createLogger({
      level: params.d ? "debug" : 'info',
      format: winston.format.cli(),
      transports: [
        new winston.transports.Console({ format: winston.format.cli() }),
      ]
    });

    this.i18n = translations.i18n;
  }

  get storage(): { static: typeof StaticConfig, user: typeof UserDataStorage } {
    return {
      static: StaticConfig,
      user: UserDataStorage
    };
  }

  request(query: string, variables: any = null, isLoginRequred = true): Promise<any> {

    const remoteAddress = this.storage.user.getValue(StorageParameters.serverAddress) || this.storage.static.remoteAddress;
    this.logger.debug(`remote address: ${remoteAddress}`);

    const client = new Client(remoteAddress);

    this.logger.debug(`query: ${query}`);
    this.logger.debug(`vaiables: ${JSON.stringify(variables)}`);

    const refreshToken = this.storage.user.getValue(StorageParameters.refreshToken);
    if (refreshToken) {
      this.logger.debug("set refresh token");
      client.setRefreshToken(refreshToken);
    }

    const idToken = this.storage.user.getValue(StorageParameters.idToken);
    if (idToken) {
      this.logger.debug("set id token");
      client.setIdToken(idToken);
    }

    const workspace = this.storage.user.getValue(StorageParameters.activeWorkspace);
    const workspaceId = workspace ? workspace.account : null;

    if (workspaceId) {
      this.logger.debug("set workspace id = " + workspaceId);
      client.setAccountId(workspaceId);
    }

    if (isLoginRequred && (_.isEmpty(idToken) || _.isEmpty(idToken) || _.isEmpty(workspaceId))) {
      throw new Error("You are logout");
    }

    return client.request(query, variables);
  }

  get project(): ProjectDefinition {
    if (_.isNil(this._project)) {
      this._project = ProjectController.initialize(this);
    }
    return this._project;
  }
}