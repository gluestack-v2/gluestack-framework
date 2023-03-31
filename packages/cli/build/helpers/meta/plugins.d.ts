import AppCLI from '../../helpers/lib/app';
import IArrTree from '../../types/meta/interface/IArr';
import ITree from '../../types/meta/interface/ITree';
import IPlugin from '../../types/plugin/interface/IPlugin';
export declare const writePlugin: (pluginFilePath: string, pluginName: string, plugin: IPlugin) => Promise<void>;
export declare const getPluginTree: (app: AppCLI, path: string, depth?: number, tree?: ITree) => Promise<ITree | null>;
export declare const getTopToBottomPluginTree: (app: AppCLI, path: string) => Promise<IArrTree>;
export declare const getBottomToTopPluginTree: (app: AppCLI, path: string) => Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
