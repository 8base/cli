# 8base CLI  [![Build Status](https://travis-ci.org/8base/cli.svg?branch=master)](https://travis-ci.org/8base/cli)

[**Sign Up for 8Base**](https://app.8base.com)	🤘	[**Documentation Home**](https://docs.8base.com)	📑	[**Getting Started**](https://docs.8base.com/projects/backend/getting-started)	🚀	[**8base Plans**](https://www.8base.com/pricing)

The 8base Command Line Interface (CLI) makes it easy to generate custom functions and manage workspaces straight from the terminal.

We recommend that all developers regularly checkout the [8base Community](https://community.8base.com) forum for regular updates and changes being made to the 8base-cli package.

## Installation
The easiest way to install 8base-cli is to use NPM and install the package globally:

```shell
$ npm install -g 8base-cli
```

or, if you are using Yarn:

```shell
$ yarn global add 8base-cli
```

## Getting Started
Before using 8base-cli, you need to authenticate yourself. You can do this one of two ways:

Launching a browser using:

```shell
$ 8base login
```

or, through the CLI using:

```shell
$ 8base login --email="my@email.com" --password="myP@ssw0rd"
```

Once successfully authenticated, a file will be updated at `~/.8baserc` with a JSON payload for the authenticated session.

## Further Information
For more information about commands and configuration options, please refer the [8base CLI documentation](https://docs.8base.com/projects/backend/development-tools/cli). You can also learn about the different commands from the CLI by running `--help` with the package itself, or a given command.

```
DESCRIPTION
  The 8base Command Line Interface is a unified tool to manage your 8base workspaces services.

USAGE
  8base <command> [OPTIONS]

  Use 8base command `--help` for information on a specific command. Use 8base help topics to view a list of available help topics. The synopsis for each
  command shows its parameters and their usage. Optional options are shown in square brackets.

COMMANDS
  8base backup <command>       Backup commands.
  8base configure              Allows you to select a default workspace and retrieve the API endpoint URL.
  8base deploy                 Deploys project described in 8base.yml config file from your current local directory to 8base server. You must be in the root directory
                               of your local 8base project to use this command.
  8base describe [name]        Describes your 8base project’s functions and their types through 8base.yml file.
  8base environment <command>  Environment commands.
  8base export                 Exports current workspace data schema
  8base generate <command>     Generator for server and client side resources  [aliases: g]
  8base import                 Imports 8base schema file and data to the current - or specified - workspace.
  8base init [name]            Initializes a new project with example directory structure and custom functions.
  8base invoke <name>          Invokes a custom function in the production workspace.
  8base invoke-local <name>    Invokes the custom function in the local development workspace.
  8base login                  Authenticates the command line user by letting them log into an 8base account.
  8base logout                 Clears local login credentials and invalidates API session.
  8base logs <name>            Show logs for the function(s).
  8base migration <command>    Migration commands.
  8base package                Package 8base application without deploying it.
  8base project <command>      Project-related commands.
  8base whoami                 Displays the current authenticated user.

OPTIONS
  -v, --version  Show version number  [boolean]
  -d, --debug    Turn on debug logs  [boolean]
  -h, --help     Show help  [boolean]
```

## Contributing
Like most great things, the 8base CLI is a work in progress. As a consequence of that, the CLI is constantly improving. Our CLI is public and open-sourced right here on GitHub. So whenever you want to, you could:

1. Reporting an Issue
8base uses GitHub Issue Tracking to track issues (primarily bugs and contributions of new code). If you've found a bug, this is the place to start.

2. Fix an Issue
If you've not only found a problem in the CLI but also worked out the solution, please submit a pull request!

3. Add Features:
You can help improve the 8base CLI by adding awesome features. It's honestly an open-book. If you think something is useful, others probably will too.

We'll do our best to review, respond, and merge all contributions in a timely manner!
