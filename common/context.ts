import { UserDataStorage } from "./userDataStorage";
import { StaticConfig } from "../config";
import { ProjectDefinition } from "../interfaces/Project";
import _ = require("lodash");
import { ProjectController } from "../engine/controllers/projectController";
import { StorageParameters } from "../consts/StorageParameters";
import * as winston from "winston";
import * as i18next       from "i18next";
import * as Ora from "ora";
import { Translations } from "./translations";
import { TransformableInfo } from "logform";
import chalk from "chalk";

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
      level: params.d ? "debug" : "info",
      format: winston.format.printf((info: TransformableInfo) => {
        if (info.level === "info") {
          return info.message;
        }
        if (info.level === "debug") {
          return `${chalk.blueBright(info.level)}: ${info.message}`;
        }
        return `${chalk.redBright(info.level)}: ${info.message}`;
      }),
      transports: [new winston.transports.Console()]
    });

    this.i18n = translations.i18n;
  }

  get serverAddress(): string {
    return this.storage.getValue(StorageParameters.serverAddress) || this.config.remoteAddress;
  }

  get storage(): typeof UserDataStorage {
    return UserDataStorage;
  }

  get config(): typeof StaticConfig {
    return StaticConfig;
  }

  async request(query: string, variables: any = null, isLoginRequired = true): Promise<any> {

    const remoteAddress = this.serverAddress;
    this.logger.debug(this.i18n.t("debug:remote_address", { remoteAddress }));


    const client = new Client(remoteAddress);

    this.logger.debug(`query: ${query}`);
    this.logger.debug(`variables: ${JSON.stringify(variables)}`);

    const refreshToken = this.storage.getValue(StorageParameters.refreshToken);
    if (refreshToken) {
      this.logger.debug(this.i18n.t("debug:set refresh token"));
      client.setRefreshToken(refreshToken);
    }

    const idToken = this.storage.getValue(StorageParameters.idToken);
    if (idToken) {
      this.logger.debug(this.i18n.t("debug:set_id_token"));
      client.setIdToken(idToken);
    }

    const workspace = this.storage.getValue(StorageParameters.activeWorkspace);
    const workspaceId = workspace ? workspace.account : null;

    if (workspaceId) {
      this.logger.debug(this.i18n.t("debug:set_workspace_id", { workspaceId }));
      client.setAccountId(workspaceId);
    }

    const email = this.storage.getValue(StorageParameters.email);
    if (email) {
      this.logger.debug(this.i18n.t("debug:set_email", { email }));
      client.setEmail(email);
    }

    if (isLoginRequired && (_.isEmpty(idToken) || _.isEmpty(refreshToken) || _.isEmpty(workspaceId))) {
      throw new Error(this.i18n.t("logout_error"));
    }

    this.logger.debug(this.i18n.t("debug:start_request"));
    const result = await client.request(query, variables);
    this.logger.debug(this.i18n.t("debug:request_complete"));

    if (client.idToken !== idToken) {
      this.logger.debug(this.i18n.t("debug:reset_id_token"));
      this.storage.setValues([{
        name: StorageParameters.idToken,
        value: client.idToken
      }]);
    }

    if (client.refreshToken !== refreshToken) {
      this.logger.debug(this.i18n.t("debug:reset_refresh_token"));
      this.storage.setValues([{
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