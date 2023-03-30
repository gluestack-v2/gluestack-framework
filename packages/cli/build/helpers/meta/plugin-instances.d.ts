import IArrTree from '../../types/meta/interface/IArr';
import IAppCLI from '../../types/app/interface/IAppCLI';
import IGSPlugin from '../../types/plugin/interface/IGSPlugin';
declare const pluginInstance: (pluginInstancesFilePath: string, packageName: string, instanceName: string, directoryName: string) => Promise<void>;
declare function attachPluginInstances(app: IAppCLI, path: string, plugins: IArrTree): Promise<void>;
declare function getTopToBottomPluginInstanceTree(app: IAppCLI, path: string): Promise<IArrTree>;
declare function getBottomToTopPluginInstanceTree(app: IAppCLI, path: string): Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
declare function attachPluginInstance(app: IAppCLI, plugin: IGSPlugin, instance: string, directory: string): import("../../types/plugin/interface/IInstance").default;
export { pluginInstance, attachPluginInstances, getTopToBottomPluginInstanceTree, getBottomToTopPluginInstanceTree, attachPluginInstance, };
