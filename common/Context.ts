import { UserDataStorage } from "./userDataStorage";
import { setTraceLevel, TraceLevel, debug } from "./tracer";
import { StaticConfig } from ".";
import { ProjectDefinition } from "../interfaces/Project";
import _ = require("lodash");
import { ProjectController } from "../engine/controllers/projectController";
import { StorageParameters } from "../consts/StorageParameters";

const { Client } = require("@8base/api-client");

export class Context {

  private _project: ProjectDefinition = null;

  constructor(params: any) {
    if (params.d) {
      setTraceLevel(TraceLevel.Debug);
    } else {
      setTraceLevel(TraceLevel.Trace);
    }
  }

  get storage(): { static: typeof StaticConfig, user: typeof UserDataStorage } {
    return {
      static: StaticConfig,
      user: UserDataStorage
    };
  }

  request(query: string, variables: any = null): Promise<any> {

    const remoteAddress = this.storage.user.getValue(StorageParameters.serverAddress) || this.storage.static.remoteAddress;
    debug("remote address = " + remoteAddress);
    const client = new Client(remoteAddress);

    debug("query = ");
    debug(query);

    debug("vaiables = ");
    debug(JSON.stringify(variables));

    const refreshToken = this.storage.user.getValue(StorageParameters.refreshToken);
    if (refreshToken) {
      debug("set refresh token");
      client.setRefreshToken(refreshToken);
    }

    const idToken = this.storage.user.getValue(StorageParameters.idToken);
    if (idToken) {
      debug("set id token");
      client.setIdToken(idToken);
    }

    const workspace = this.storage.user.getValue(StorageParameters.activeWorkspace);
    const workspaceId = workspace ? workspace.account : null;

    if (workspaceId) {
      debug("set workspace id = " + workspaceId);
      client.setAccountId(workspaceId);
    }

    return client.request(query, variables);
  }

  get project(): ProjectDefinition {
    if (_.isNil(this._project)) {
      this._project = ProjectController.initialize();
    }
    return this._project;
  }
}