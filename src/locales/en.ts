
export default {
  "default": {
    "logout_error": "Please login first by running '8base login'",

    "error_command_end": "{{command}} failed. Error: {{error}}.",

    "deploy_in_progress": "deploying... \nStep: {{status}}\n{{message}}",

    "8base_usage": "DESCRIPTION\n  The 8base Command Line Interface is a unified tool to manage your 8base workspaces services.\n\nSYNOPSIS\n  8base <command> [OPTIONS]\n\n  Use 8base command `--help` for information on a specific command. Use 8base help topics to view a list of available help topics. The synopsis for each command shows it’s parameters and their usage. Optional options are shown in square brackets.",

    "login_usage": "COMMAND\n  8base login [OPTIONS]\n\nDESCRIPTION\n  Authenticates the command line user by letting them log into an 8base account.",
    "login_describe": "Authenticates the command line user by letting them log into an 8base account.",
    "login_browser_example_command": "8base login",
    "login_browser_example": "",
    "login_cli_example_command": "8base login -e my@email.com -p S3cretP@ssw0rd",
    "login_cli_example": "",
    "login_in_progress": "waiting for authentication...",

    "describe_usage": "COMMAND\n  8base describe [OPTIONS]\n\nDESCRIPTION\n  Describes your 8base project’s functions and their types through 8base.yml file.",
    "describe_describe": "Describes your 8base project’s functions and their types through 8base.yml file.",
    "describe_progress": "describing...",

    "deploy_usage": "COMMAND\n  8base deploy [OPTIONS]\n\nDESCRIPTION\n  Deploys project in current directory to 8base using 8base.yml config file. To use this command, you must be in the root directory of your 8base project.",
    "deploy_describe": "Deploys project in current directory to 8base using 8base.yml config file. To use this command, you must be in the root directory of your 8base project.",

    "config_usage": "COMMAND\n  8base config [OPTIONS]\n\nDESCRIPTION\n  Allows you to select a default workspace and retrieve the API endpoint URL.",
    "config_describe": "Allows you to select a default workspace and retrieve the API endpoint URL.",
    "config_workspace_option": "Workspace Id",

    "init_usage": "COMMAND\n  8base export [OPTIONS]\n\nDESCRIPTION\n  Initializes a new project with example directory structure and custom functions.",
    "init_no_dir_example_command": "8base init",
    "init_with_dir_example_command": "8base init my-project",
    "init_example_no_dir": "Initializes project in current folder",
    "init_example_with_dir": "Creates new folder for initialized project",
    "init_describe": "Initializes a new project with example directory structure and custom functions.",

    "invoke_usage": "COMMAND\n  8base invoke [FUNCTION NAME] [OPTIONS]\n\nDESCRIPTION\n  Invokes a custom function in the production workspace.",
    "invoke_describe": "Invokes a custom function in the production workspace.",
    "invoke_data_json_describe": "Input JSON",
    "invoke_data_path_describe": "Path to input JSON",
    "invoke_in_progress": "invoking...",

    "invokelocal_usage": "COMMAND\n  8base invoke-local [FUNCTION NAME] [OPTIONS]\n\nDESCRIPTION\n  Invokes the custom function in the local development workspace.",
    "invokelocal_describe": "Invokes the custom function in the local development workspace.",
    "invokelocal_data_json_describe": "Input JSON",
    "invokelocal_data_path_describe": "Path to input JSON",
    "invokelocal_in_progress": "invoking...",

    "export_in_progress": "exporting...",
    "export_describe": "Export current workspace data schema",
    "export_usage": "COMMAND\n  8base export [OPTIONS]\n\nDESCRIPTION\n  Export current - or specified - workspace data schema to a local file",
    "export_file_describe": "Destination file",
    "export_file_required_option_error": "Please specify a relative path and filename for the export.\n\nExample: \n`8base export -f <EXPORT_FILE_PATH>`",

    "import_usage": "COMMAND\n  8base import [OPTIONS]\n\nDESCRIPTION\n  Import 8base schema file and data to the current - or specified - workspace.",
    "import_describe": "Import 8base schema file and data to the current - or specified - workspace.",
    "import_schema_in_progress": "importing schema...",
    "import_data_in_progress": "importing data...",
    "import_file_describe": "Path to file with schema",
    "import_schema_describe": "Import schema",
    "import_data_describe": "Import data",

    "import_cant_parse_schema": "Can't parse the schema file.",
    "import_file_not_exist": "Schema file does not exist.",
    "import_schema_different_version": "Schema file has a different version.",

    "logout_usage": "COMMAND\n  8base logout [OPTIONS]\n\nDESCRIPTION\n  Clears local login credentials and invalidates API session.",
    "logout_describe": "Clears local login credentials and invalidates API session.",

    "logs_usage": "8base logs [FUNCTION NAME] [OPTIONS]",
    "logs_describe": "View function logs",
    "logs_in_progress": "getting logs...",

    "generate_describe": "Generate React templates",

    "app_describe": "Generate React app skeleton",
    "app_usage": "8base generate app [PROJECT_NAME]",

    "scaffold_usage": "8base generate scaffold [TABLE_NAME] [OPTIONS]",
    "scaffold_describe": "Generate CRUD screens for a table",
    "scaffold_table_describe": "Table name",
    "scaffold_template_describe": "Type of template (crud, create, edit, delete, table, index) ",
    "scaffold_depth_describe": "Depth of the generated query",
    "scaffold_withMeta_describe": "Include meta fields (createdAt, createdBy, updatedAt)",
    "scaffold_table_error": "Can't find a '{{- tableName }}' table",
    "scaffold_crud_exist_error": "CRUD for this table already exist.",
    "scaffold_project_file_error": "Can't find a '{{- projectFileName }}' file. You should be in the project root directory to exec this command.",
    "scaffold_project_name_error": "Can't find an 'appName' constant. Check you '{{- projectFileName }}' file in the project root directory.",
    "scaffold_successfully_created": "{{- screenName }} was successfully created",
    "scaffold_was_not_created": "{{- screenName }} wasn't created",

    "package_usage": "8base package [OPTIONS]",
    "package_describe": "Package application without deploying",
    "package_progress": "packaging...",

    "login_timeout_error": "Login time out.",

    "login_password_warning": "Email & password login is only available if you registered using email and password authentication method. You can enable password by signing up again with the same email.",

    "8base_config_is_missing": "We're unable to locate any 8base.yml file! \nMake sure you’re in the root directory of your project and the 8base.yml config file is present."
  },

  "debug": {
    "remote_address": "remote address: {{- remoteAddress}}",
    "start_request": "begin request",
    "request_complete": "request complete",
    "reset_id_token": "reset id token",
    "set_id_token": "set id token",
    "reset_refresh_token": "reset refresh token",
    "set_email": "set email: {{- email}}",
    "set_workspace_id": "set workspace id {{workspaceId}}",
  }
};
