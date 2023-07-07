import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as i18next from 'i18next';
import Ora from 'ora';
import * as path from 'path';
import * as winston from 'winston';
import yaml from 'yaml';
import chalk from 'chalk';
import { Client } from '@8base/api-client';
import { TransformableInfo } from 'logform';

import { UserDataStorage } from './userDataStorage';
import { User } from './user';
import { StaticConfig } from '../config';
import { ProjectDefinition } from '../interfaces/Project';
import { ProjectController } from '../engine/controllers/projectController';
import { StorageParameters } from '../consts/StorageParameters';
import { Translations } from './translations';
import { Colors } from '../consts/Colors';
import { EnvironmentInfo, RequestOptions, SessionInfo, Workspace } from '../interfaces/Common';
import { GraphqlActions } from '../consts/GraphqlActions';
import { DEFAULT_ENVIRONMENT_NAME } from '../consts/Environment';
import { REQUEST_HEADER_IGNORED, REQUEST_HEADER_NOT_SET } from '../consts/request';

export type WorkspaceConfig = {
  readonly workspaceId: string;
  readonly environmentName: string;
  readonly apiHost: string;
};

export type Plugin = { name: string; path: string };

export type ProjectConfig = {
  functions: Record<string, any>;
  plugins?: Plugin[];
};

export class Context {
  private _project: ProjectDefinition = null;

  logger: winston.Logger;

  i18n: i18next.i18n;

  spinner: ReturnType<typeof Ora>;

  constructor(params: any, translations: Translations) {
    this.logger = winston.createLogger({
      level: params.d ? 'debug' : 'info',
      format: winston.format.printf((info: TransformableInfo) => {
        if (info.level === 'info') {
          return info.message;
        }
        if (info.level === 'debug') {
          return `${chalk.hex(Colors.blue)(info.level)} [${Date.now()}]: ${info.message}`;
        }
        return `${chalk.hex(Colors.red)(info.level)}: ${info.message}`;
      }),
      transports: [new winston.transports.Console()],
    });

    this.i18n = translations.i18n;

    this.spinner = Ora({
      color: 'white',
      text: '\n',
    });
  }

  get workspaceConfig(): WorkspaceConfig | null {
    const workspaceConfigPath = this.getWorkspaceConfigPath();

    if (this.hasWorkspaceConfig()) {
      return fs.readJSONSync(workspaceConfigPath, { throws: true });
    }

    return null;
  }

  async getEnvironments(): Promise<EnvironmentInfo[]> {
    const { system } = await this.request(GraphqlActions.environmentsList, null, {
      customEnvironment: DEFAULT_ENVIRONMENT_NAME,
    });

    const environments = system.environments.items;
    if (_.isEmpty(environments)) {
      throw new Error(this.i18n.t('logout_error'));
    }

    return environments;
  }

  set workspaceConfig(value: WorkspaceConfig) {
    const workspaceConfigPath = this.getWorkspaceConfigPath();
    fs.writeJSONSync(workspaceConfigPath, value, { spaces: 2 });
  }

  getWorkspaceConfigPath(customPath?: string): string {
    return path.join(customPath || process.cwd(), StaticConfig.workspaceConfigFilename);
  }

  updateWorkspace(value: WorkspaceConfig): void {
    const currentWorkspaceConfig = this.workspaceConfig;
    this.workspaceConfig = _.merge(currentWorkspaceConfig, value);
  }

  updateEnvironmentName(environmentName: string): void {
    const currentWorkspaceConfig = this.workspaceConfig;

    this.workspaceConfig = _.merge(currentWorkspaceConfig, { environmentName });
  }

  async createWorkspaceConfig(value: WorkspaceConfig, customPath?: string): Promise<void> {
    const workspaceConfigPath = this.getWorkspaceConfigPath(customPath);

    await fs.writeJSON(workspaceConfigPath, value, { spaces: 2 });
  }

  get workspaceId(): string | null {
    return _.get(this.workspaceConfig, 'workspaceId', null);
  }

  get environmentName(): string | null {
    return _.get(this.workspaceConfig, 'environmentName', null);
  }

  get apiHost(): string | null {
    return _.get(this.workspaceConfig, 'apiHost', null);
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
      projectConfig = <ProjectConfig>yaml.parse(fs.readFileSync(projectConfigPath, 'utf-8')) || projectConfig;
    }

    return projectConfig;
  }

  set projectConfig(value: ProjectConfig) {
    const projectConfigPath = this.getProjectConfigPath();

    fs.writeFileSync(projectConfigPath, yaml.stringify(value));
  }

  getProjectConfigPath(customPath?: string): string {
    return path.join(customPath || process.cwd(), StaticConfig.projectConfigFilename);
  }

  hasProjectConfig(customPath?: string): boolean {
    const projectConfigPath = this.getProjectConfigPath(customPath);

    return fs.existsSync(projectConfigPath);
  }

  resolveMainServerAddress(): string {
    return this.storage.getValue(StorageParameters.serverAddress) || StaticConfig.apiAddress;
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
      this.logger.debug('set session info empty data');
      return;
    }

    this.logger.debug('set session info...');
    if (_.isString(data.idToken)) {
      this.logger.debug(`id token ${data.idToken.substr(0, 10)}`);
    }

    if (_.isString(data.refreshToken)) {
      this.logger.debug(`refresh token: ${data.refreshToken.substr(0, 10)}`);
    }

    this.storage.setValues([
      {
        name: StorageParameters.refreshToken,
        value: data.refreshToken,
      },
      {
        name: StorageParameters.idToken,
        value: data.idToken,
      },
    ]);
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const workspaces = await this.workspaceList();

    if (_.isEmpty(workspaces) || !_.isArray(workspaces)) {
      throw new Error(this.i18n.t('empty_workspaces'));
    }

    return workspaces;
  }

  async checkWorkspace(workspaceId: string) {
    if (!_.some(await this.workspaceList(), { id: workspaceId })) {
      throw new Error(this.i18n.t('inexistent_workspace'));
    }
  }

  private async workspaceList(): Promise<Workspace[]> {
    const data = await this.request(GraphqlActions.listWorkspaces, null, {
      address: this.resolveMainServerAddress(),
      customWorkspaceId: REQUEST_HEADER_IGNORED,
      customEnvironment: REQUEST_HEADER_IGNORED,
    });

    return _.get(data, ['workspacesList', 'items'], []);
  }

  async request(query: string, variables: any = null, options?: RequestOptions): Promise<any> {
    const defaultOptions: RequestOptions = {
      customAuthorization: REQUEST_HEADER_NOT_SET,
      customWorkspaceId: REQUEST_HEADER_NOT_SET,
      customEnvironment: REQUEST_HEADER_NOT_SET,
      address: this.apiHost || this.resolveMainServerAddress(),
    };

    const { customEnvironment, customWorkspaceId, customAuthorization, address } = options
      ? {
          ...defaultOptions,
          ...options,
        }
      : defaultOptions;

    this.logger.debug(this.i18n.t('debug:remote_address', { remoteAddress: address }));

    if (!address) {
      /*
        address has to be passed as parameter (workspace list query) or resolved from workspace info
        another way it's invalid behaviour
     */
      throw new Error(this.i18n.t('configure_error'));
    }

    const client = new Client(address);

    this.logger.debug(`query: ${query}`);
    this.logger.debug(`variables: ${JSON.stringify(variables)}`);

    const refreshToken = this.storage.getValue(StorageParameters.refreshToken);
    if (refreshToken) {
      this.logger.debug(this.i18n.t('debug:set refresh token'));
      client.setRefreshToken(refreshToken);
    }

    const authToken =
      customAuthorization !== REQUEST_HEADER_NOT_SET
        ? customAuthorization
        : this.storage.getValue(StorageParameters.idToken);
    this.logger.debug(this.i18n.t('debug:set_id_token'));
    if (authToken) {
      client.setIdToken(authToken);
    }

    if (customAuthorization === REQUEST_HEADER_NOT_SET && !this.user.isAuthorized()) {
      throw new Error(this.i18n.t('logout_error'));
    }

    const workspaceId = customWorkspaceId !== REQUEST_HEADER_NOT_SET ? customWorkspaceId : this.workspaceId;

    if (workspaceId) {
      this.logger.debug(this.i18n.t('debug:set_workspace_id', { workspaceId }));
      client.setWorkspaceId(workspaceId);
    }

    const environmentName = customEnvironment !== REQUEST_HEADER_NOT_SET ? customEnvironment : this.environmentName;
    if (environmentName) {
      this.logger.debug(this.i18n.t('debug:set_environment_name', { environmentName }));
      client.gqlc.setHeader('environment', environmentName);
    }

    this.logger.debug(this.i18n.t('debug:start_request'));
    const result = await client.request(query, variables);
    this.logger.debug(this.i18n.t('debug:request_complete'));

    if (client.idToken !== authToken && customAuthorization === REQUEST_HEADER_NOT_SET) {
      this.logger.debug(this.i18n.t('debug:reset_id_token'));
      this.storage.setValues([
        {
          name: StorageParameters.idToken,
          value: client.idToken,
        },
      ]);
    }

    if (client.refreshToken !== refreshToken) {
      this.logger.debug(this.i18n.t('debug:reset_refresh_token'));
      this.storage.setValues([
        {
          name: StorageParameters.refreshToken,
          value: client.refreshToken,
        },
      ]);
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
