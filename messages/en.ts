
export default {
  login: {
    interactive: [
      {
        name: "email",
        type: "input",
        message: "email"
      },
      {
        name: "password",
        type: "password",
        message: "password"
      },
      {
        name: "remote",
        type: "input",
        message: "remote address",
        default: "8base.com"
      }
    ],
    accounts: ["5b4f1d7e565ef06f9c923e5b", "mockaccount"]
  },
  compile: {
    onSuccess: "compile complete successfully"
  },
  clear: {
    usage: {
      all: {
        description: "clear all config data",
      },
      auth: {
        description: "clear auth data"
      },
    },
    onSuccess: "all data has been cleared"
  },
  deploy: {
    onSuccess: "deploy complete successfully"
  },
  config:{
    usage: {
      account: {
        description: "<account_id> set account"
      },
      email: {
        description: "--email <email> set email"
      },
      remote: {
        description: "<address> set remote cli endpoint"
      }
    }
  },
  graphql: {
    usage: {
      validate: {
        description: "check for schema syntax"
      },
      o: {
        description: "generate summary graphql schema and function metadata"
      }
    },
    onSuccess: "graphql complete successfully"
  },
  init: {
    usage: {
      r: {
        description: "repository name"
      }
    }
  },
  invoke: {
    usage: {
      f: {
        description: "function name"
      },
      data: {
        description: "<JSON> input arguments as JSON data"
      },
      args_path: {
        description: "path to file with arguments"
      }
    }
  }
};