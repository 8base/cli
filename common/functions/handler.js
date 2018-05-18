const aws = require("aws-sdk");

const remoteServer = "__remote_server_endpoint__";
const { GraphQLClient } = require("graphql-request");
const path = require("path");

module.exports = function handler(event, cloudContext, cb, funcname) {

  // TODO: check it token: add middleware!

  cloudContext.callbackWaitsForEmptyEventLoop = false;

  try {
    const funcObject = require(cloudContext.rootDirectory ? path.join(cloudContext.rootDirectory, funcname) : funcname);
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
          return (new GraphQLClient(remoteServer, { headers: event.headers })).request(query, variables);
        },

        request: (functionName, args) => {
          throw new Error("Method is not implemented");
        }
      }
    }

    return Promise.resolve(func( event ? event.data : null, context))
      .then(res => cb(null, res))
      .catch(ex => cb(ex));

  } catch(ex) {
    cb(ex);
  }
}
