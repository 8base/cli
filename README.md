# 8base CLI  [![Build Status](https://travis-ci.org/8base/cli.svg?branch=master)](https://travis-ci.org/8base/cli)
> A Command Line Interface (CLI) that simplifies the deployment of serverless functions to your 8base workspace

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)


## Getting Started
```
$ npm install -g 8base

$ 8base --help
Usage: 8base <command> [OPTIONS]

Commands:
  8base config        Select workspace
  8base deploy        Deploy project
  8base describe      Describe project functions and their types
  8base export        Export current workspace data schema
  8base import        Import schema file to the current workspace
  8base init          Initialize project
  8base invoke        Invoke deployed function remotely
  8base invoke-local  Invoke function locally
  8base login         Login via browser
  8base logout        Clears local login credentials and invalidates
                      API session
  8base logs          View function logs
  8base package       Package application without deploying

Options:
  -h, --help     Show help                                 [boolean]
  -v, --version  Show version number                       [boolean]
```

## Development
Use this when you need to update the library in NPM. The following command will automatically set the version, create a tag for it, build the package and publish it to NPM
```
git add -A
git commit -m 'version update'
npm run upload
```
