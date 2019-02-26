
export default {
  "default": {
    "logout_error": "Please login first by running '8base login'",

    "error_command_end": "{{command}} failed. Error: {{error}}.",

    "deploy_in_progress": "deploying... \nStep: {{status}}\n{{message}}",

    "8base_usage": "Usage: 8base <command> [OPTIONS]",

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

    "view_usage": "8base codegen:view [OPTIONS]",
    "view_describe": "Create frontend templates",
    "view_table_describe": "Table name",
    "view_template_describe": "Type of template (crud, create, edit, delete, table, index) ",
    "view_depth_describe": "Depth of the generated query",
    "view_withMeta_describe": "Include meta fields (createdAt, createdBy, updatedAt)",
    "view_table_error": "Can't find a '{{- tableName }}' table",
    "view_successfully_created": "{{- fileName }} was successfully created",
    "view_was_not_created": "{{- fileName }} wasn't created",

    "package_usage": "8base package [OPTIONS]",
    "package_describe": "Package application without deploying",
    "package_progress": "packaging...",

    "login_timeout_error": "Login time out.",

    "login_password_warning": "Email & password login is only available if you registered using email and password authentication method. You can enable password by signing up again with the same email."
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
