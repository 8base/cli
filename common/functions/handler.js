const { GraphQLClient } = require("graphql-request");

const endpoint = "__endpoint__";

module.exports = function handler(event, cloudContext, cb, funcname) {
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
      gqlRequest: (query, variables, headers) =>  {
     
        return Promise.resolve(
          (new GraphQLClient(endpoint, {
            headers: {
              "account-id": "5ae34c916e7d7f72ba38871d",
              Authorization: event.Authorization || event.authorization,
              ...headers
            }
          }))
          .request(query, variables)
        );
      }
    }

    return Promise.resolve(func(event, context))
      .then(res => cb(null, res))
      .catch(ex => cb(ex));

  } catch(ex) {
    cb(ex);
  }
}
