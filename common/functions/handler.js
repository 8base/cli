const aws = require("aws-sdk");

const gqlHandleFuncName = "__gql__handle__function_name__";

const toGqlFormat = (query, variables, headers) => {
  return {
    body: JSON.stringify({
      query, variables,
    }),
    httpMethod: "POST",
    headers
  };
}

const requestLambda = (funcName, payload, cloudContext) => {
  const lambda = new aws.Lambda();

  const req = {
    FunctionName: funcName,
    Payload: payload,
    ClientContext: Buffer.from(JSON.stringify({
      originalRequestId: cloudContext.requestId
    })).toString('base64')
  };

  return lambda.invoke(req)
    .promise()
    .then(result => {
      const response = result.$response;
  
      if (response.error) {
        throw new Error(response.error);
      }
    
      return JSON.parse(JSON.parse(response.data.Payload).body);
    })
    .catch(err => {
      throw err;
    });
}


module.exports = function handler(event, cloudContext, cb, funcname) {

  // TODO: check it token: add middleware!

  cloudContext.callbackWaitsForEmptyEventLoop = false;

  try {
    const funcObject = require(funcname);
    let func;
    let res;
    if (typeof(funcObject) === 'function' ) {
        func = funcObject;
    } else  if (funcObject.default && typeof(funcObject.default) === 'function' ) {
        func = funcObject.default;
    } else {
      throw new Error("invalid function format");
    }

    const context = {
      api: {

        // Function call graphql function 

        gqlRequest: (query, variables) =>  {
          return requestLambda(
            gqlHandleFuncName,
            JSON.stringify(toGqlFormat(query, variables, event.headers)),
            cloudContext
          );
        },

        request: (functionName, args) => {
          throw new Error("Method is not implemented");
        }
      }
    }

    return Promise.resolve(func(event, context))
      .then(res => cb(null, res))
      .catch(ex => cb(ex));

  } catch(ex) {
    cb(ex);
  }
}
