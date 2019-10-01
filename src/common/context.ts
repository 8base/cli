import * as _ from "lodash";
import * as fs from "fs";
import * as i18next from "i18next";
import * as Ora from "ora";
import * as path from "path";
import * as winston from "winston";
import * as yaml from "yaml";
import chalk from "chalk";
import { Client } from "@8base/api-client";
import { TransformableInfo } from "logform";

import { UserDataStorage } from "./userDataStorage";
import { User } from "./user";
import { StaticConfig } from "../config";
import { ProjectDefinition } from "../interfaces/Project";
import { ProjectController } from "../engine/controllers/projectController";
import { StorageParameters } from "../consts/StorageParameters";
import { Translations } from "./translations";
import { Colors } from "../consts/Colors";
import { SessionInfo } from "../interfaces/Common";
import { Utils } from "./utils";
import { GraphqlActions } from "../consts/GraphqlActions";

const pkg = require("../../package.json");

export type WorkspaceConfig = {
  workspaceId: string,
};

type Plugin = { name: string, path: string };

export type ProjectConfig = {
  functions: Object,
  plugins?: Plugin[],
};

const WORKSPACE_CONFIG_FILENAME = ".workspace.json";
const PROJECT_CONFIG_FILENAME = "8base.yml";

export class Context {

  private _project: ProjectDefinition = null;

  version: string;

  logger: winston.Logger;

  i18n: i18next.i18n;

  spinner = Ora({
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

  get workspaceConfig(): WorkspaceConfig | null {
    const workspaceConfigPath = this.getWorkspaceConfigPath();

    if (this.hasWorkspaceConfig()) {
      return JSON.parse(String(fs.readFileSync(workspaceConfigPath)));
    }

    return null;
  }

  set workspaceConfig(value: WorkspaceConfig) {
    const workspaceConfigPath = this.getWorkspaceConfigPath();

    fs.writeFileSync(workspaceConfigPath, JSON.stringify(value, null, 2));
  }

  getWorkspaceConfigPath(customPath?: string): string {
    return path.join(customPath || process.cwd(), WORKSPACE_CONFIG_FILENAME);
  }

  updateWorkspaceConfig(value: WorkspaceConfig): void {
    const currentWorkspaceConfig = this.workspaceConfig;

    this.workspaceConfig = _.merge(currentWorkspaceConfig, value);
  }

  createWorkspaceConfig(value: WorkspaceConfig, customPath?: string): void {
    const workspaceConfigPath = this.getWorkspaceConfigPath(customPath);

    fs.writeFileSync(workspaceConfigPath, JSON.stringify(value, null, 2));
  }

  get workspaceId(): string | null {
    return _.get(this.workspaceConfig, "workspaceId", null);
  }

  hasWorkspaceConfig(customPath?: string): boolean {
    const workspaceConfigPath = this.getWorkspaceConfigPath(customPath);

    return fs.existsSync(workspaceConfigPath);
  }

  isProjectDir(): boolean {
    return this.hasWorkspaceConfig();
  }

  get projectConfig(): ProjectConfig {
    const projectConfigPath = this.getProjectConfigPath();

    let projectConfig = { functions: {} };

    if (this.hasProjectConfig()) {
      projectConfig = yaml.parse(String(fs.readFileSync(projectConfigPath))) || projectConfig;
    }

    return projectConfig;
  }

  set projectConfig(value: ProjectConfig) {
    const projectConfigPath = this.getProjectConfigPath();

    fs.writeFileSync(projectConfigPath, yaml.stringify(value));
  }

  getProjectConfigPath(customPath?: string): string {
    return path.join(customPath || process.cwd(), PROJECT_CONFIG_FILENAME);
  }

  hasProjectConfig(customPath?: string): boolean {
    const projectConfigPath = this.getProjectConfigPath(customPath);

    return fs.existsSync(projectConfigPath);
  }

  get serverAddress(): string {
    return this.storage.getValue(StorageParameters.serverAddress) || this.config.remoteAddress;
  }

  get storage(): typeof UserDataStorage {
    return UserDataStorage;
  }

  get user(): typeof User {
    return User;
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

  async getWorkspaces() {
    const data = await this.request(GraphqlActions.listWorkspaces, null, false, null);

    const workspaces = data.workspacesList.items;

    if (_.isEmpty(workspaces)) {
      throw new Error(this.i18n.t("logout_error"));
    }

    return workspaces;
  }

  async checkWorkspace(workspaceId: string) {
    const data = await this.request(GraphqlActions.listWorkspaces, null, false, null);

    const workspaces = _.get(data, ["workspacesList", "items"], []);

    if (!_.some(workspaces, { id: workspaceId })) {
      throw new Error(this.i18n.t("inexistent_workspace"));
    }
  }

  async request(query: string, variables: any = null, isLoginRequired = true, customWorkspaceId?: string): Promise<any> {

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

    const workspaceId = customWorkspaceId !== undefined ? customWorkspaceId : this.workspaceId;

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
