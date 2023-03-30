import IAppCLI from '../types/app/interface/IAppCLI';
declare function getPluginStorePath(pluginName: string): string;
declare function getPluginInstanceStorePath(instanceName: string, pluginName: string): string;
declare function injectPluginStore(app: IAppCLI, pluginName: string): import("../types/store/interface/IGluePluginStore").default;
declare function injectPluginInstanceStore(app: IAppCLI, pluginName: string, instanceName: string): import("../types/store/interface/IGluePluginStore").default;
export { getPluginStorePath, getPluginInstanceStorePath, injectPluginStore, injectPluginInstanceStore, };
