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
  describe: `query {
    describeExtensions {
      resolvers {
        name gqlType
      }
      webhooks  {
        name httpMethod workspaceRelativePath
      }
      triggers {
        operation tableName type name
      }
      functions {
        handler remoteName name
      }
    }
  }`
};
