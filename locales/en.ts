
export default {
  "default": {
    "logout_error": "You are logout",

    "error_command_end": "Command {{command}} fail. Error: {{error}}.",

    "deploy_in_progress": "deploying...",
    "invoke_in_progress": "invoke...",

    "8base_usage": "Usage: 8base <command> [OPTIONS]",

    "login_in_progress": "login...",
    "login_usage": "8base login [OPTIONS]",
    "login_describe": "Login with your 8base credentials",

    "describe_usage": "8base describe [OPTIONS]",
    "describe_progress": "describe...",
    "describe_describe":"Describe project",

    "deploy_usage": "8base deploy [OPTIONS]",
    "deploy_describe": "Deploy project",

    "config_usage": "8base config [OPTIONS]",
    "config_workspace_option": "workspace id",
    "config_describe": "Advanced configuration",

    "init_usage": "8base init [OPTIONS]",
    "init_no_dir_example_command": "8base init",
    "init_with_dir_example_command": "8base init dir1",
    "init_example_no_dir": "initialize current folder",
    "init_example_with_dir": "create folder dir1 and initialize",
    "init_describe": "Initialize project",

    "invoke_usage": "8base invoke [FUNCTION NAME] [OPTIONS]",
    "invoke_describe": "Invoke deployed function",

    "invokelocal_usage": "8base invoke-local [FUNCTION NAME] [OPTIONS]",
    "invokelocal_describe": "Invoke function locally",
    "invokelocal_in_progress": "invoke local...",

    "export_in_progress": "export...",
    "export_describe": "Export current workspace schema",
    "export_usage": "8base export [OPTIONS]",

    "import_schema_in_progress": "import schema...",
    "import_data_in_progress": "import data...",
    "import_describe": "Import schema to the current workspace",
    "import_usage": "8base import [OPTIONS]",

    "import_cant_parse_schema": "Can't parse the schema file.",
    "import_file_not_exist": "Schema file not existed.",
    "import_schema_different_version": "Schema file have a different version.",

    "logout_usage": "8base logout [OPTIONS]",
    "logout_describe": "Clears local login credentials and invalidates API session",

    "logs_usage": "8base logs [FUNCTION NAME] [OPTIONS]",
    "logs_describe": "view function logs",
    "logs_in_progress": "get logs...",

    "package_usage": "8base package [OPTIONS]",
    "package_describe": "package application without deploying",
    "package_progress": "package...",

    "login_timeout_error": "Login time out.",

    "login_password_warning": "Email & password login is only available if you registered using email and password authentication method. You can enable password by going through “forgot password“."
  },

  "debug": {
    "remote_address": "remote address: {{- remoteAddress}}",
    "start_request": "start request",
    "request_complete": "request complete",
    "reset_id_token": "reset id token",
    "set_id_token": "set id token",
    "reset_refresh_token": "reset refresh token",
    "set_email": "set email: {{- email}}",
    "set_workspace_id": "set workspace id {{workspaceId}}",
  }
};
