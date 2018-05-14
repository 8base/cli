const aws = require("aws-sdk");

const gqlHandleFuncName = "__gql__handle__function_name__";

const toGqlFormat = (query, variables, headers) => {
  return {
    body: JSON.stringify({
      query, variables,
    }),
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

  console.log("invoke!")

  return lambda.invoke(req).promise()
    .then(result => {
      console.log("result ", result)
      const response = result.$response;
  
      if (response.error) {
        throw new Error(response.error);
      }
    
      console.log("call result = ", response.data);
      return response.data;    
    })
    .catch(err => {
      console.log("catch = ", err.message);
      throw err;
    });
}

//5ae34c916e7d7f72ba38871d_mockFunc2

module.exports = function handler(event, cloudContext, cb, funcname) {

  // TODO: check it token: add middleware!

  console.log("event " , event);
  console.log("cloudContext " , cloudContext);

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
          const payload = JSON.stringify(toGqlFormat(query, variables, event.headers));
          console.log("payload ", payload)
          return requestLambda(gqlHandleFuncName, payload, cloudContext);
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
