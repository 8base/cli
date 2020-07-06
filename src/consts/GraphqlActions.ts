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
  migrationPlan: `
    query MigrationPlan {
      system { ciPlan { url } }
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
};

export const GraphqlAsyncActions = {
  environmentBranch: `
    mutation clone($environmentName: String!) {
      system { async: environmentBranch(name: $environmentName) { sessionId } }
    }`,
  merge: `
    mutation MergeMigration {
      system { async: ciMerge { sessionId } }
    }
  `,
  commit: `
    mutation CommitMigration {
      system { async: ciCommit { sessionId } }
    }
  `,
  apply: `
    mutation CommitMigration {
      system { async: ciApply { sessionId } }
    }
  `
};

export type GraphqlAsyncActionsType =
  typeof GraphqlAsyncActions.commit |
  typeof GraphqlAsyncActions.merge |
  typeof GraphqlAsyncActions.environmentBranch;

