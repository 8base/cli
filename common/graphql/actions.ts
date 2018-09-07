
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
    prepareDeploy: `mutation {
        prepareDeploy {
            uploadBuildUrl uploadMetaDataUrl buildId
        }
    }`,
    deploy: `mutation Deploy($data: DeployData) {
        deploy(data: $data)
    }`,
    describe:`query {
        describeBuild {
          functions {
            name, gqlType, remoteName
          }
          webhooks{
            accountRelativePath httpMethod name appId
          }
          triggers {
            table action stage
          }
          resolvers {
            name, gqlType
          }
        }
      }
    `
};