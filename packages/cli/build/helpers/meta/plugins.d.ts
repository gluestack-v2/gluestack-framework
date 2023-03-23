export function writePlugin(pluginFilePath: any, packageName: any, pluginName: any, plugin: any): Promise<void>;
export function getPluginTree(app: any, path: any, depth?: number, tree?: {}): Promise<{} | null>;
export function getTopToBottomPluginTree(app: any, path: any): Promise<any[]>;
export function getBottomToTopPluginTree(app: any, path: any): Promise<any[]>;
