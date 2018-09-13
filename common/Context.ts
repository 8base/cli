import { UserDataStorage } from "./userDataStorage";
import { StaticConfig } from ".";
import { ProjectDefinition } from "../interfaces/Project";
import _ = require("lodash");
import { ProjectController } from "../engine/controllers/projectController";
import { StorageParameters } from "../consts/StorageParameters";
import * as winston from "winston";
import * as i18next       from "i18next";
import * as Ora from "ora";
import { Translations } from "./Translations";

const { Client } = require("@8base/api-client");


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

  async request(query: string, variables: any = null, isLoginRequred = true): Promise<any> {

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

    const email = this.storage.user.getValue(StorageParameters.email);
    if (email) {
      this.logger.debug("set email id = " + email);
      client.setEmail(email);
    }

    if (isLoginRequred && (_.isEmpty(idToken) || _.isEmpty(refreshToken) || _.isEmpty(workspaceId))) {
      throw new Error("You are logout");
    }

    this.logger.debug("start request" );
    const result = await client.request(query, variables);
    this.logger.debug("request complete");

    if (client.idToken !== idToken) {
      this.logger.debug("reset id token");
      this.storage.user.setValues([{
        name: StorageParameters.idToken,
        value: client.idToken
      }]);
    }

    if (client.refreshToken !== refreshToken) {
      this.logger.debug("reset refresh token");
      this.storage.user.setValues([{
        name: StorageParameters.refreshToken,
        value: client.refreshToken
      }]);
    }

    return result;
  }

  get project(): ProjectDefinition {
    if (_.isNil(this._project)) {
      this._project = ProjectController.initialize(this);
    }
    return this._project;
  }
}