import AppCLI from '../../helpers/lib/app';
import IArrTree from '../../types/meta/interface/IArr';
import IPlugin from '../../types/plugin/interface/IPlugin';
export declare function pluginInstance(pluginInstancesFilePath: string, packageName: string, instanceName: string, directoryName: string): Promise<void>;
export declare function attachPluginInstances(app: AppCLI, path: string, plugins: IArrTree): Promise<void>;
export declare function getTopToBottomPluginInstanceTree(app: AppCLI, path: string): Promise<IArrTree>;
export declare function getBottomToTopPluginInstanceTree(app: AppCLI, path: string): Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
export declare function attachPluginInstance(app: AppCLI, plugin: IPlugin, instance: string, directory: string): import("../../types/plugin/interface/IInstance").default;
