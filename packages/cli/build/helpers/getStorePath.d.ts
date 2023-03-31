import AppCLI from '../helpers/lib/app';
export declare const getPluginStorePath: (pluginName: string) => string;
export declare const getPluginInstanceStorePath: (instanceName: string, pluginName: string) => string;
export declare const injectPluginStore: (app: AppCLI, pluginName: string) => import("../types/store/interface/IGluePluginStore").default;
export declare const injectPluginInstanceStore: (app: AppCLI, pluginName: string, instanceName: string) => import("../types/store/interface/IGluePluginStore").default;
