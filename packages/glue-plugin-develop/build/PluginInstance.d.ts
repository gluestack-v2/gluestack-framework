import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance';
export declare class PluginInstance extends BaseGluestackPluginInstance {
    app: AppCLI;
    name: string;
    callerPlugin: IPlugin;
    isOfTypeInstance: boolean;
    gluePluginStore: IGlueStorePlugin;
    installationPath: string;
    constructor(app: AppCLI, callerPlugin: IPlugin, name: string, gluePluginStore: IGlueStorePlugin, installationPath: string);
    init(): void;
    destroy(): void;
    getName(): string;
    getCallerPlugin(): IPlugin;
    getInstallationPath(): string;
    watch(): string[];
}
