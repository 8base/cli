export const GraphqlActions = {
  login: `mutation Login($data: UserLoginInput!) {
    userLogin(data: $data) {
      auth {
        idToken
        refreshToken
      }
      accounts {
        name
        account
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
prepareDeploy: `mutation PrepareDeploy {
  prepareDeploy {
    uploadBuildUrl uploadMetaDataUrl buildName
  }
}`,
deploy: `mutation Deploy($data: DeployData) {
  deploy(data: $data)
}`,
describe: `query {
  describeExtensions {
    resolvers {
      name gqlType
    }
    webhooks  {
      name httpMethod accountRelativePath
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