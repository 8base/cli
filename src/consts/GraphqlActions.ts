import gql from 'graphql-tag';

export const GraphqlActions = {
  login: gql`
    mutation Login($data: UserLoginInput!) {
      userLogin(data: $data) {
        auth {
          idToken
          refreshToken
        }
        workspaces {
          name
          workspace
        }
      }
    }
  `,
  listWorkspaces: gql`
    query {
      workspacesList {
        items {
          name
          id
          region
          apiHost
        }
        count
      }
    }
  `,
  createWorkspace: gql`
    mutation WorkspaceCreate($data: WorkspaceCreateMutationInput!) {
      workspaceCreate(data: $data) {
        id
      }
    }
  `,
  environmentsList: gql`
    query EnvironmentsList {
      system {
        environments: environmentsList {
          items {
            id
            name
          }
        }
      }
    }
  `,
  backupList: gql`
    query BackupList {
      system {
        backups: environmentBackupsList {
          items {
            name
            size
          }
        }
      }
    }
  `,
  migrationGenerate: gql`
    query MigrationPlan($tables: [String!]) {
      system {
        ciGenerate(tables: $tables) {
          url
        }
      }
    }
  `,
  migrationStatus: gql`
    query MigrationStatus {
      system {
        ciStatus {
          status
          migrations
        }
      }
    }
  `,
  invoke: gql`
    mutation Invoke($data: InvokeData) {
      invoke(data: $data) {
        responseData
      }
    }
  `,
  logs: gql`
    query Logs($functionName: String!, $limit: Int, $startTime: DateTime, $endTime: DateTime) {
      logs(functionName: $functionName, limit: $limit, startTime: $startTime, endTime: $endTime)
    }
  `,
  asyncSessionStatus: gql`
    query status($sessionId: String!) {
      status: asyncSessionStatus(sessionId: $sessionId) {
        status
        message
      }
    }
  `,
  deployStatus: gql`
    query DeployStatus($buildName: String!) {
      deployStatus(buildName: $buildName) {
        status
        message
      }
    }
  `,
  prepareDeploy: gql`
    mutation PrepareDeploy {
      prepareDeploy {
        uploadBuildUrl
        uploadMetaDataUrl
        buildName
      }
    }
  `,
  deploy: gql`
    mutation Deploy($data: DeployingBuildInput) {
      deploy(data: $data)
    }
  `,
  functionsList: gql`
    query {
      functionsList {
        items {
          name
          functionType
          description
          ...FunctionWebhookInfo
          ...FunctionTriggerInfo
          ...FunctionResolverInfo
          ...FunctionTaskInfo
        }
      }
    }

    fragment FunctionWebhookInfo on FunctionWebhookInfo {
      httpMethod
      workspaceRelativePath
    }

    fragment FunctionTriggerInfo on FunctionTriggerInfo {
      operation
      tableName
      type
    }

    fragment FunctionResolverInfo on FunctionResolverInfo {
      gqlType
    }

    fragment FunctionTaskInfo on FunctionTaskInfo {
      scheduleExpression
    }
  `,
  environmentDelete: gql`
    mutation delete($name: String!) {
      system {
        environmentDelete(environmentName: $name) {
          success
        }
      }
    }
  `,
};

export const GraphqlAsyncActions = {
  environmentBranch: gql`
    mutation clone($environmentName: String!, $mode: SystemBranchEnvironmentMode) {
      system {
        async: environmentBranch(name: $environmentName, mode: $mode) {
          sessionId
        }
      }
    }
  `,
  environmentDelete: gql`
    mutation delete($environmentName: String!) {
      system {
        async: environmentDeleteAsync(environmentName: $environmentName) {
          sessionId
        }
      }
    }
  `,
  commit: gql`
    mutation CommitMigration($mode: SystemCiCommitMode!, $build: String, $migrationNames: [String]) {
      system {
        async: ciCommit(mode: $mode, build: $build, migrationNames: $migrationNames) {
          sessionId
        }
      }
    }
  `,
  backupCreate: gql`
    mutation Backup($name: String!) {
      system {
        async: environmentBackup(environmentName: $name) {
          sessionId
        }
      }
    }
  `,
  backupRestore: gql`
    mutation BackupRestore($backup: String!, $name: String!) {
      system {
        async: environmentRestore(backup: $backup, environmentName: $name) {
          sessionId
        }
      }
    }
  `,
};

export type GraphqlAsyncActionsType =
  | typeof GraphqlAsyncActions.commit
  | typeof GraphqlAsyncActions.environmentBranch
  | typeof GraphqlAsyncActions.backupCreate;
