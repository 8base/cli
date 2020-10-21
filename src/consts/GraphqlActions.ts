export const GraphqlActions = {
  login: `mutation Login($data: UserLoginInput!) {
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
  }`,
  listWorkspaces: `query {
    workspacesList {
      items {
        name id
      }
      count
    }
  }`,
  environmentsList: `
    query EnvironmentsList {
      system {
        environments: environmentsList { items { id name } }
      }
    }`,
  backupList: `
    query BackupList {
      system { backups: environmentBackupsList { items { name size } } }
    }`,
  migrationGenerate: `
    query MigrationPlan($tables: [String!] $sourceEnvironment: String $targetEnvironment: String) {
      system { ciGenerate(tables:$tables) { url } }
    }`,
  migrationStatus: `
    query MigrationStatus {
      system { ciStatus { status, migrations } }
    }`,
  invoke: `mutation Invoke($data: InvokeData) {
    invoke(data: $data) {
      responseData
    }
  }`,
  logs: `query Logs(
    $functionName: String!,
    $limit: Int,
    $startTime: DateTime,
    $endTime: DateTime){

      logs (
        functionName:$functionName
        limit: $limit
        startTime: $startTime
        endTime: $endTime
      )
  }`,
  asyncSessionStatus: `
    query status($sessionId: String!)  {
      status: asyncSessionStatus(sessionId:$sessionId) { status message }
    }
  `,
  deployStatus: `
    query DeployStatus($buildName: String!) {
      deployStatus(buildName: $buildName) {
        status, message
      }
    }`,
  prepareDeploy: `mutation PrepareDeploy {
    prepareDeploy {
      uploadBuildUrl uploadMetaDataUrl buildName
    }
  }`,
  deploy: `mutation Deploy($data: DeployingBuildInput) {
    deploy(data: $data)
  }`,
  functionsList: `query {
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

  fragment FunctionTriggerInfo on FunctionTriggerInfo{
    operation
    tableName
    type
  }

  fragment FunctionResolverInfo on FunctionResolverInfo {
    gqlType
  }

  fragment FunctionTaskInfo on FunctionTaskInfo {
    scheduleExpression
  }`,
  environmentDelete: `mutation delete($name:String!) { system { environmentDelete(environmentName:$name) { success } } }`,
  backupUrl: `query url($name: String!, $backup: String!) { 
    system { environmentBackupUrl(environmentName:$name backup: $backup) { url } } 
  }`,
};

export const GraphqlAsyncActions = {
  environmentBranch: `
    mutation clone($environmentName: String!, $mode: SystemBranchEnvironmentMode) {
      system { async: environmentBranch(name: $environmentName mode: $mode) { sessionId } }
    }`,
  commit: `
    mutation CommitMigration($mode: SystemCiCommitMode! $build:String $environment: String) {
      system { async: ciCommit(mode:$mode build:$build environment: $environment) { sessionId } }
    }
  `,
  backupCreate: `
    mutation Backup($name: String!){
      system { async: environmentBackup(environmentName:$name) { sessionId } }
    }
  `,
  backupRestore: `
    mutation BackupRestore($backup:String!, $name: String!) {
      system { async: environmentRestore(backup:$backup environmentName: $name) { sessionId } }
    }
  `,
  backupImport: `
    mutation RestoreFromTemplate($template:String!, $name: String!) {
      system { async: environmentRestoreFromTemplate(template:$template environmentName: $name) { sessionId } }
    }
  `,
};

export type GraphqlAsyncActionsType =
  | typeof GraphqlAsyncActions.commit
  | typeof GraphqlAsyncActions.environmentBranch
  | typeof GraphqlAsyncActions.backupCreate;
