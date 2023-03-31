import AppCLI from '../../helpers/lib/app';
import IArrTree from '../../types/meta/interface/IArr';
import IPlugin from '../../types/plugin/interface/IPlugin';
export declare const pluginInstance: (pluginInstancesFilePath: string, packageName: string, instanceName: string, directoryName: string) => Promise<void>;
export declare const attachPluginInstances: (app: AppCLI, path: string, plugins: IArrTree) => Promise<void>;
export declare const getTopToBottomPluginInstanceTree: (app: AppCLI, path: string) => Promise<IArrTree>;
export declare const getBottomToTopPluginInstanceTree: (app: AppCLI, path: string) => Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
export declare const attachPluginInstance: (app: AppCLI, plugin: IPlugin, instance: string, directory: string) => import("../../types/plugin/interface/IInstance").default;
