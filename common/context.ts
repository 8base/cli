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
import { Colors } from "../consts/Colors";
import { SessionInfo } from "../interfaces/Common";
import { Utils } from "./utils";
import { log } from "util";
import { GraphqlActions } from "../consts/GraphqlActions";

const { Client } = require("@8base/api-client");
const pkg = require('../../package.json');

export class Context {

  private _project: ProjectDefinition = null;

  version: string;

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
          return `${chalk.hex(Colors.blue)(info.level)} [${Date.now()}]: ${info.message}`;
        }
        return `${chalk.hex(Colors.red)(info.level)}: ${info.message}`;
      }),
      transports: [new winston.transports.Console()]
    });

    this.i18n = translations.i18n;
    this.version = pkg.version;
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

  setSessionInfo(data: SessionInfo) {
    if (!data) {
      this.logger.debug("set session info empty data");
      return;
    }

    this.logger.debug("set session info...");
    if (_.isString(data.idToken)) {
      this.logger.debug(`id token ${data.idToken.substr(0, 10)}`);
    }

    if (_.isString(data.refreshToken)) {
      this.logger.debug(`refresh token: ${data.refreshToken.substr(0, 10)}`);
    }

    this.storage.setValues([
      {
        name: StorageParameters.refreshToken,
        value: data.refreshToken
      },
      {
        name: StorageParameters.idToken,
        value: data.idToken
      },
    ]);
  }

  async chooseWorkspace(workspaceId?: string) {

    const data = await this.request(GraphqlActions.listWorkspaces, null, false);

    this.storage.setValues([
      {
        name: StorageParameters.workspaces,
        value: data.workspacesList.items
      }
    ]);

    const workspaces = this.storage.getValue(StorageParameters.workspaces);

    if (_.isEmpty(workspaces)) {
      throw new Error(this.i18n.t("logout_error"));
    }

    const selectedWorkspaceId = workspaceId ? workspaceId : (await Utils.promptWorkspace(workspaces, this)).id;

    const activeWorkspace = workspaces.find((workspace: any) => workspace.id === selectedWorkspaceId);
    if (!activeWorkspace) {
      throw new Error("Workspace " + selectedWorkspaceId + " is absent");
    }

    this.storage.setValues([
      {
        name: StorageParameters.activeWorkspace,
        value: selectedWorkspaceId
      }
    ]);

    this.logger.info(`Workspace ${chalk.hex(Colors.yellow)(activeWorkspace.name)} is active`);
    this.logger.info(`\nAPI endpoint URL: https:\/\/api.8base.com/${activeWorkspace.id}\n`);
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

    const workspaceId = this.storage.getValue(StorageParameters.activeWorkspace);

    if (workspaceId) {
      this.logger.debug(this.i18n.t("debug:set_workspace_id", { workspaceId }));
      client.setWorkspaceId(workspaceId);
    }

    if (isLoginRequired && (_.isEmpty(idToken) || _.isEmpty(refreshToken))) {
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

  initializeProject() {
    this.project;
  }

  get project(): ProjectDefinition {
    if (_.isNil(this._project)) {
      this._project = ProjectController.initialize(this);
    }
    return this._project;
  }
}
