import IArrTree from '../../types/meta/interface/IArr';
import ITree from '../../types/meta/interface/ITree';
import IAppCLI from '../../types/app/interface/IAppCLI';
import IGSPlugin from '../../types/plugin/interface/IGSPlugin';
declare const writePlugin: (pluginFilePath: string, pluginName: string, plugin: IGSPlugin) => Promise<void>;
declare const getPluginTree: (app: IAppCLI, path: string, depth?: number, tree?: ITree) => Promise<ITree | null>;
declare function getTopToBottomPluginTree(app: IAppCLI, path: string): Promise<IArrTree>;
declare function getBottomToTopPluginTree(app: IAppCLI, path: string): Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
export { writePlugin, getPluginTree, getTopToBottomPluginTree, getBottomToTopPluginTree, };
