
export default {
  "default": {
    "logout_error": "Please login first by running '8base login'",

    "error_command_end": "{{command}} failed. Error: {{error}}.",

    "deploy_in_progress": "deploying... \nStep: {{status}}\n{{message}}",

    "8base_usage": "DESCRIPTION\n  The 8base Command Line Interface is a unified tool to manage your 8base workspaces services.\n\nSYNOPSIS\n  8base <command> [OPTIONS]\n\n  Use 8base command `--help` for information on a specific command. Use 8base help topics to view a list of available help topics. The synopsis for each command shows it’s parameters and their usage. Optional options are shown in square brackets.",

    "login_in_progress": "waiting for authentication...",
    "login_usage": "8base login [OPTIONS]",
    "login_describe": "Login via browser",

    "describe_usage": "8base describe [OPTIONS]",
    "describe_progress": "describing...",
    "describe_describe":"Describe project functions and their types",

    "deploy_usage": "8base deploy [OPTIONS]",
    "deploy_describe": "Deploy project",

    "config_usage": "8base config [OPTIONS]",
    "config_workspace_option": "workspace id",
    "config_describe": "Select workspace",

    "init_usage": "8base init [OPTIONS]",
    "init_no_dir_example_command": "8base init",
    "init_with_dir_example_command": "8base init my_project",
    "init_example_no_dir": "initialize current folder",
    "init_example_with_dir": "create folder my_project and initialize",
    "init_describe": "Initialize project",

    "invoke_usage": "8base invoke [FUNCTION NAME] [OPTIONS]",
    "invoke_describe": "Invoke deployed function remotely",
    "invoke_in_progress": "invoking...",

    "invokelocal_usage": "8base invoke-local [FUNCTION NAME] [OPTIONS]",
    "invokelocal_describe": "Invoke function locally",
    "invokelocal_in_progress": "invoking...",

    "export_in_progress": "exporting...",
    "export_describe": "Export current workspace data schema",
    "export_usage": "8base export [OPTIONS]",
    "export_file_describe": "Destination file",

    "import_schema_in_progress": "importing schema...",
    "import_data_in_progress": "importing data...",
    "import_describe": "Import schema file to the current workspace",
    "import_usage": "8base import [OPTIONS]",
    "import_file_describe": "Path to file with schema",
    "import_schema_describe": "Import schema",
    "import_data_describe": "Import data",

    "import_cant_parse_schema": "Can't parse the schema file.",
    "import_file_not_exist": "Schema file does not exist.",
    "import_schema_different_version": "Schema file has a different version.",

    "logout_usage": "8base logout [OPTIONS]",
    "logout_describe": "Clears local login credentials and invalidates API session",

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
