import IArrTree from '../../types/meta/interface/IArr';
import IPlugin from '../../types/plugin/interface/IPlugin';
import App from '../lib/app';
declare const pluginInstance: (pluginInstancesFilePath: string, packageName: string, instanceName: string, directoryName: string) => Promise<void>;
declare function attachPluginInstances(app: App, path: string, plugins: IArrTree): Promise<void>;
declare function getTopToBottomPluginInstanceTree(app: App, path: string): Promise<IArrTree>;
declare function getBottomToTopPluginInstanceTree(app: App, path: string): Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
declare function attachPluginInstance(app: App, plugin: IPlugin, instance: string, directory: string): import("../../types/plugin/interface/IInstance").default;
export { pluginInstance, attachPluginInstances, getTopToBottomPluginInstanceTree, getBottomToTopPluginInstanceTree, attachPluginInstance, };
