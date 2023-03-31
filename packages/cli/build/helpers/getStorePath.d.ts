import AppCLI from '../helpers/lib/app';
export declare function getPluginStorePath(pluginName: string): string;
export declare function getPluginInstanceStorePath(instanceName: string, pluginName: string): string;
export declare function injectPluginStore(app: AppCLI, pluginName: string): import("../types/store/interface/IGluePluginStore").default;
export declare function injectPluginInstanceStore(app: AppCLI, pluginName: string, instanceName: string): import("../types/store/interface/IGluePluginStore").default;
