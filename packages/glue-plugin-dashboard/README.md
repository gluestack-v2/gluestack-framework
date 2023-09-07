# @gluestack-v2/glue-plugin-dashboard

    ## Installation

    To install this plugin, you need to bootstrap a project using create-gluestack-app, and this plugin is already configured in our base boilerplate.

    Here's how to bootstrap a project using create-gluestack-app:

    ```bash
    npx create-gluestack-v2-app@latest
    ```

    ## CLI

    ### node glue up

    This command runs all the installed **plugin instances** in **Docker**. You can use
    the below command to run your gluestack project:

    ```bash
    $ node glue up
    ```

    ### node glue down

    This command stops all the installed **plugin instances** running in **Docker**. You
    can use the below command to stop your gluestack project:

    ```bash
    $ node glue down
    ```

    ### node glue list

    This command lists all the installed **plugin instances** running in **Docker**.

    You can use the below command to list your installed plugin instances in your gluestack
    project:

    ```bash
    $ node glue list
    ```

    This command comes up with an option to filter the list of plugin instances which
    helps in looking up for a specific plugin's instances.

    ```bash
    $ node glue list --filter <your-search-string-goes-here>
    ```

    To obtain information about the **Glue Plugin Postgres** that has been successfully installed in our application under the instance name "postgres," you
    can execute the appropriate command:

    ```bash
    $ node glue list --filter postgres
    ```

    ### node glue watch

    This command runs your gluestack project in **watch** mode. Each plugin's container controller comes with a **watch** method which holds the list of directories
    and file paths which are watched for changes.

    If changes are made to such directories or files, this command will automatically restart your gluestack project with the latest changes.

    The **watch()** function bashould return an array of strings. Those strings are the **file
    path** upon which your application will run on watch mode.

    Here's how you can run watch command:

    ```bash
    $ node glue watch
    ```

    ### node glue build

    This command helps you build plugin's instances. There are two ways to build, one build all plugin instances and other build one plugin instance at a time.

    To build all installed plugin instances, you can run the following command:

    ```bash
    $ node glue build
    ```

    To build one plugin instance, you can run the following command:

    ```bash
    $ node glue build <instance-name>
    ```

    More guides on how to get started are available
    [here](https://framework-v2.gluestack.io/).
