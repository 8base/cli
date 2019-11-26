/**
 * Console messages for --help flag, errors, and loaders.
 */
export default {
  "default": {
    "8base_new_version": "The new version of the 8base CLI (v{{- last }}) is already available.\nPlease update CLI to the latest version using 'yarn global add 8base-cli@latest' or 'npm i -g 8base-cli@latest'",

    /**
     * Shared messages
     */
    "project_created_file": "Created file {{- path }}",
    "project_updated_file": "Updated file {{- path }}",
    "invalid_syntax": "Invalid syntax, available ['js', 'ts']",
    "error_command_end": "{{command}} failed. Error: {{error}}.",
    "8base_usage": "DESCRIPTION\n  The 8base Command Line Interface is a unified tool to manage your 8base workspaces services.\n\nUSAGE\n  8base <command> [OPTIONS]\n\n  Use 8base command `--help` for information on a specific command. Use 8base help topics to view a list of available help topics. The synopsis for each command shows it’s parameters and their usage. Optional options are shown in square brackets.",
    "inexistent_workspace": "Inexistent workspace",
    "8base_config_is_missing": "We're unable to locate any 8base.yml file! \nMake sure you’re in the root directory of your project and the 8base.yml config file is present.",
    "silent_describe": "Disable printing extra info to the console",
    "mock_with_name_not_defined": "Mock with name {{- mockName }} for the function with name {{- functionName }} not defined",
    "mock_with_name_already_defined": "Mock with name {{- mockName }} for the function with name {{- functionName }} already defined",
    "non_8base_project_dir": "The current folder isn't an 8base project, so there is nothing to configure!\n\nTry re-runing this command when in the root of an existing 8base project or use '8base init' to create a new project.",
    "workspace_not_found": "Workspace not found. Try to run `8base configure` to select existed workspace for this project.",
    /**
     * Project info related messages
     */
    "project_describe": "Project-related commands.",
    "project_info_usage": "COMMAND\n  8base project info\n\nDESCRIPTION\n Display the info about current project.",
    "project_info_describe": "Display the info about current project.",
    "project_info_text": "Workspace Id: {{-workspaceId}}\nWorkspace Name: {{-workspaceName}}\nAPI Endpoint: {{-endpoint}}",
    "project_info_cant_find_workspace": "Can't find workspace with {{-workspaceId}} identifier. Looks like you are using a various account or project workspace was deleted.",
    /**
     * Whoami related messages
     */
    "whoami_usage": "COMMAND\n  8base whoami\n\nDESCRIPTION\n Display the current authenticated user.",
    "whoami_describe": "Display the current authenticated user.",
    "whoami_text": "You authenticated as {{-email}} ({{-name}}).",
    /**
     * Login related messages
     */
    "login_usage": "COMMAND\n  8base login [OPTIONS]\n\nDESCRIPTION\n  Authenticates the command line user by letting them log into an 8base account.",
    "login_describe": "Authenticates the command line user by letting them log into an 8base account.",
    "login_browser_example_command": "8base login",
    "login_browser_example": "",
    "login_cli_example_command": "8base login -e my@email.com -p S3cretP@ssw0rd",
    "login_cli_example": "",
    "login_timeout_error": "Login time out.",
    "login_in_progress": "waiting for authentication...",
    "login_already_note": "Looks like you've already authenticated as {{email}}!",
    "login_choice_title": "Are you trying to?",
    "login_choice_change_workspace": "Change your current workspace",
    "login_choice_relogin": "Login to a different 8base account",
    "login_password_warning": "Email & password login is only available if you registered using email and password authentication method. You can enable password by signing up again with the same email.",
    /**
     * Describe related messages
     */
    "describe_usage": "COMMAND\n  8base describe [OPTIONS]\n\nDESCRIPTION\n  Describes your 8base project’s functions and their types through 8base.yml file.",
    "describe_describe": "Describes your 8base project’s functions and their types through 8base.yml file.",
    "describe_progress": "describing...",
    "describe_empty_resolvers": "You don't have resolvers",
    "describe_empty_triggers": "You don't have triggers",
    "describe_empty_webhooks": "You don't have webhooks",
    "describe_empty_tasks": "You don't have tasks",
    "describe_function_not_found": "Function with name {{- name }} not found",

    /**
     * Deploy related messages
     */
    "deploy_in_progress": "deploying... \nStep: {{status}}\n{{message}}",
    "deploy_usage": "COMMAND\n  8base deploy [OPTIONS]\n\nDESCRIPTION\n  Deploys project in current directory to 8base using 8base.yml config file. To use this command, you must be in the root directory of your 8base project.",
    "deploy_describe": "Deploys project in current directory to 8base using 8base.yml config file. To use this command, you must be in the root directory of your 8base project.",
    "deploy_plugins_describe": "The list of plugins to deploy",
    "deploy_mode_describe": "The deploy mode",
    /**
     * Config related messages
     */
    "configure_usage": "COMMAND\n  8base configure [OPTIONS]\n\nDESCRIPTION\n  Allows you to select a default workspace and retrieve the API endpoint URL.",
    "configure_describe": "Allows you to select a default workspace and retrieve the API endpoint URL.",
    "configure_workspace_id_describe": "The workspace ID of the project",
    "configure_select_workspace": "Select workspace for current project",
    "configure_prevent_select_workspace": "Workspace selection canceled",
    /**
     * Init related messages
     */
    "init_usage": "COMMAND\n  8base init [OPTIONS]\n\nDESCRIPTION\n  Initializes a new project with example directory structure and custom functions.",
    "init_no_dir_example_command": "8base init",
    "init_with_dir_example_command": "8base init my-project",
    "init_example_no_dir": "Initializes project in current folder",
    "init_example_with_dir": "Creates new folder for initialized project",
    "init_describe": "Initializes a new project with example directory structure and custom functions.",
    "init_invalid_function_type": "Invalid function type",
    "init_undefined_function_name": "Undefined function name",
    "init_functions_describe": "List of functions",
    "init_empty_describe": "Skip examples",
    "init_workspace_id_describe": "The workspace ID of the project",
    "init_select_workspace": "What workspace does this project belong to?",
    "init_prevent_select_workspace": "Workspace selection canceled",
    "init_workspace_name_labal": "Please enter name for the new workspace",
    "init_prevent_new_workspace": "Workspace creation canceled",
    "init_confirm_not_empty_dir": "Selected directory is not empty. Are you sure you want to continue?",
    "init_canceled": "Project init canceled",
    /**
     * Invoke related messages
     */
    "invoke_usage": "COMMAND\n  8base invoke [name] [OPTIONS]\n\nDESCRIPTION\n  Invokes a custom function in the production workspace.",
    "invoke_describe": "Invokes a custom function in the production workspace.",
    "invoke_data_json_describe": "Input JSON",
    "invoke_data_path_describe": "Path to input JSON",
    "invoke_mock_describe": "Name of the mock request",
    "invoke_name_describe": "The name of the function",
    "invoke_in_progress": "invoking...",
    "invoke_returns_error": "\"{{- name }}\" returns an error.",
    /**
     * Invoke-local related messages
     */
    "invokelocal_usage": "COMMAND\n  8base invoke-local [name] [OPTIONS]\n\nDESCRIPTION\n  Invokes the custom function in the local development workspace.",
    "invokelocal_describe": "Invokes the custom function in the local development workspace.",
    "invokelocal_data_json_describe": "Input JSON",
    "invokelocal_data_path_describe": "Path to input JSON",
    "invokelocal_mock_describe": "Name of the mock request",
    "invokelocal_name_describe": "The name of the function",
    "invokelocal_in_progress": "invoking...",
    "invokelocal_returns_error": "\"{{- name }}\" returns an error.",
    /**
     * Export related messages
     */
    "export_in_progress": "exporting...",
    "export_describe": "Export current workspace data schema",
    "export_usage": "COMMAND\n  8base export [OPTIONS]\n\nDESCRIPTION\n  Export current - or specified - workspace data schema to a local file",
    "export_file_describe": "Destination file",
    "export_file_required_option_error": "Please specify a relative path and filename for the export.\n\nExample: \n`8base export -f <EXPORT_FILE_PATH>`",
    "export_workspace_describe": "Custom workspace id",
    /**
     * Import related messages
     */
    "import_usage": "COMMAND\n  8base import [OPTIONS]\n\nDESCRIPTION\n  Import 8base schema file and data to the current - or specified - workspace.",
    "import_describe": "Import 8base schema file and data to the current - or specified - workspace.",
    "import_schema_in_progress": "importing schema...",
    "import_data_in_progress": "importing data...",
    "import_file_describe": "Path to file with schema",
    "import_schema_describe": "Import schema",
    "import_data_describe": "Import data",
    "import_workspace_describe": "Custom workspace id",
    "import_cant_parse_schema": "Can't parse the schema file.",
    "import_file_not_exist": "Schema file does not exist.",
    "import_schema_different_version": "Schema file has a different version.",
    /**
     * Logout related messages
     */
    "logout_error": "Please login first by running '8base login'",
    "logout_usage": "COMMAND\n  8base logout [OPTIONS]\n\nDESCRIPTION\n  Clears local login credentials and invalidates API session.",
    "logout_describe": "Clears local login credentials and invalidates API session.",
    /**
     * Logs related messages
     */
    "logs_usage": "COMMAND\n  8base logs [name] [OPTIONS]\n\nDESCRIPTION\n  Authenticates the command line user by letting them log into an 8base account.",
    "logs_describe": "Show logs for the function(s).",
    "logs_num_describe": "Number of lines to display",
    "logs_name_describe": "The name of the function",
    "logs_tail_describe": "Continually stream logs",
    "logs_in_progress": "getting logs...",
    "logs_tail_in_progress": "Establishing connection with server...",
    "logs_tail_failed": "Failed to establish connection... Please try again in a few minutes.",
    "logs_tail_success": "Connection established. Tailing logs...",
    /**
     * Generate related messages
     */
    "generate_describe": "Generator for server and client side resources",
    "generate_mocks_describe": "Included mocks dir and files",
    "generate_syntax_describe": "Syntax for the generated file",
    /**
     * Generate [FUNCTION] messages
     */
    "function_with_name_already_defined": "Function with name {{- name}} already defined",
    "function_with_name_not_defined": "Function with name {{- name}} not defined",
    "generate_function_grettings": "Boom! Your new {{- name }} function has been successfully generated. To add any required settings, check out its configuration block in your projects 8base.yml file.",
    /**
     * Generate app related messages
     */
    "generate_app_describe": "Generate an app skeleton for a specific framework (framework availability: react)",
    "generate_app_usage": "8base generate app [PROJECT_NAME]",
    /**
     * Generate scaffold related messages
     */
    "generate_scaffold_usage": "8base generate scaffold [TABLE_NAME] [OPTIONS]",
    "generate_scaffold_describe": "Generate CRUD screens for a table in a specific framework (framework availability: react)",
    "generate_scaffold_table_describe": "Table name",
    "generate_scaffold_template_describe": "Type of template (crud, create, edit, delete, table, index) ",
    "generate_scaffold_depth_describe": "Depth of the generated query",
    "generate_scaffold_withMeta_describe": "Include meta fields (createdAt, createdBy, updatedAt)",
    "generate_scaffold_table_error": "Can't find a '{{- tableName }}' table",
    "generate_scaffold_crud_exist_error": "CRUD for this table already exist.",
    "generate_scaffold_project_file_error": "Can't find a '{{- projectFileName }}' file. You should be in the project root directory to exec this command.",
    "generate_scaffold_project_name_error": "Can't find an 'appName' constant. Check you '{{- projectFileName }}' file in the project root directory.",
    "generate_scaffold_successfully_created": "{{- screenName }} was successfully created",
    "generate_scaffold_was_not_created": "{{- screenName }} wasn't created",
    /**
     * Generate resolver related messages
     */
    "generate_resolver_usage": "8base generate resolver [FUNCTION_NAME] [OPTIONS]",
    "generate_resolver_describe": "Generator for a custom resolver function.",
    /**
     * Generate tasks related messages
     */
    "generate_task_usage": "8base generate task [FUNCTION_NAME] [OPTIONS]",
    "generate_task_describe": "Generator for a custom task function.",
    "generate_task_schedule_describe": "Schedule on which the task runs",
    "generate_task_invalid_schedule": "Invalid schedule option",
    /**
     * Generate trigger related messages
     */
    "generate_trigger_usage": "8base generate trigger [FUNCTION_NAME] [OPTIONS]",
    "generate_trigger_describe": "Generator for a custom trigger function.",
    "generate_trigger_type_describe": "The trigger type",
    "generate_trigger_operation_describe": "Operation that invokes the trigger",
    "generate_trigger_table_name_describe": "Trigger table name",
    "generate_trigger_invalid_type": "Invalid trigger type, available types: `before` and `after`",
    "generate_trigger_invalid_operation": "Invalid trigger operation, valid example: `Users.create`",
    /**
     * Generate webhook related messages
     */
    "generate_webhook_usage": "8base generate webhook [FUNCTION_NAME] [OPTIONS]",
    "generate_webhook_describe": "Generator for a custom webhook function.",
    "generate_webhook_path_describe": "Path for the url (https:<endpoint>/<path>)",
    "generate_webhook_method_describe": "HTTP verb to invoke the function ",
    "generate_webhook_invalid_method": "Invalid HTTP verb",
    /**
     * Generate webhook related messages
     */
    "generate_mock_describe": "8base generate mock [FUNCTION_NAME] [OPTIONS]",
    "generate_mock_usage": "Generator for a mock for the function.",
    "generate_mock_name_describe": "Name of the mock request",
    "generate_mock_grettings": "Boom! Your new {{- name }} request mock has been successfully generated.",
    /**
     * Package related messages
     */
    "package_usage": "COMMAND\n  8base package [OPTIONS]\n\nDESCRIPTION\n  Package 8base application without deploying it.",
    "package_describe": "Package 8base application without deploying it.",
    "package_progress": "packaging...",

    "plugin_describe": "Plugins management commands.",

    "plugin_install_describe": "Install plugin to the project.",
    "plugin_install_usage": "COMMAND\n  8base plugin install [name]\n\nDESCRIPTION\n  Install plugin to the project.",
    "plugin_install_name_describe": "The name of the plugin",
    "plugin_install_cant_find": "Can't find plugin with name {{- name }}",
    "plugin_install_cant_download": "Can't download plugin with name {{- name }}",
    "plugin_successfully_install": "Plugin {{- name }} successfully installed to your project.",

    "plugins_with_name_already_defined": "Plugin with name {{- name }} already defined",

    "plugin_remove_describe": "Remove plugin from the project.",
    "plugin_remove_usage": "COMMAND\n  8base plugin remove [name]\n\nDESCRIPTION\n  Remove plugin from the project.",
    "plugin_remove_name_describe": "The name of the plugin",
    "plugin_successfully_remove": "Plugin {{- name }} successfully removed from your project.",
    "plugin_remove_plugin_not_found": "Plugin {{- name }} not found in your project.",

    "plugin_list_plugin_info": "Name: {{- name }}\nDescription: {{- description }}\nGitHub: {{- gitHubUrl }}\n",
    "plugin_list_not_found_plugins": "Not found plugins for your query",
    "plugin_list_describe": "Show list of available plugins.",
    "plugin_list_usage": "COMMAND\n  8base plugin list\n\nDESCRIPTION\n  Show list of available plugins.",
  },
  /**
   * Debug related messages
   */
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
