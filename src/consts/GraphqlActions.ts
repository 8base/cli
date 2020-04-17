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
    query EnvironmentsList($workspaceId: String!) {
      system {
        environments: environmentsList(workspaceId: $workspaceId) {
          items { id name }
        }
      }
    }`,
  environmentBackupsList: `
    query EnvironmentBackupsList($environmentId: String!) {
      system {
        backups: environmentBackupsList(environmentId: $environmentId) {
          items { name size }
        }
      }
    }`,
  migrationPlan: `
    query MigrationPlan($sourceId: String!, $targetId: String!, $output: SystemPlanResponseType) {
      system {
        plan(sourceEnvironmentId: $sourceId, targetEnvironmentId: $targetId, output: $output) {
          url
        }
      }
    }`,
  migrationImmediately: `
    mutation MigrationImmediately($sourceId: String!, $targetId: String!) {
      system {
        migrateImmediately(sourceEnvironmentId: $sourceId, targetEnvironmentId: $targetId) {
          success
        }
      }
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
};

export const GraphqlAsyncActions = {
  environmentClone: `
    mutation clone($environmentName: String!, $mode: SystemCloneEnvironmentMode!, $sourceEnvironmentId: String!) {
      system {
        async: environmentClone(name: $environmentName, mode:$mode, sourceEnvironmentId: $sourceEnvironmentId) {
          sessionId
        }
      }
    }`,

  environmentBackup: `
    mutation backup($environmentId: String!) {
      system {
        async: environmentBackup(environmentId: $environmentId) {
          sessionId
        }
      }
    }`,
};

export type GraphqlAsyncActionsType = typeof GraphqlAsyncActions.environmentClone;

