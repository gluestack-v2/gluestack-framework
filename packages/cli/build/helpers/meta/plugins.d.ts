import IArrTree from '../../types/meta/interface/IArr';
import ITree from '../../types/meta/interface/ITree';
import App from '../lib/app';
import IPlugin from '../../types/plugin/interface/IPlugin';
declare const writePlugin: (pluginFilePath: string, pluginName: string, plugin: IPlugin) => Promise<void>;
declare const getPluginTree: (app: App, path: string, depth?: number, tree?: ITree) => Promise<ITree | null>;
declare function getTopToBottomPluginTree(app: App, path: string): Promise<IArrTree>;
declare function getBottomToTopPluginTree(app: App, path: string): Promise<import("../../types/meta/interface/IArr").ArrObj[]>;
export { writePlugin, getPluginTree, getTopToBottomPluginTree, getBottomToTopPluginTree, };
