import App from "./lib/app";
declare function getPluginStorePath(pluginName: string): string;
declare function getPluginInstanceStorePath(instanceName: string, pluginName: string): string;
declare function injectPluginStore(app: App, pluginName: string): import("../types/store/interface/IGluePluginStore").default;
declare function injectPluginInstanceStore(app: App, pluginName: string, instanceName: string): import("../types/store/interface/IGluePluginStore").default;
export { getPluginStorePath, getPluginInstanceStorePath, injectPluginStore, injectPluginInstanceStore, };
