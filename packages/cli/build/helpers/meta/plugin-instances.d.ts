export function pluginInstance(pluginInstancesFilePath: any, packageName: any, instanceName: any, directoryName: any): Promise<void>;
export function attachPluginInstances(app: any, path: any, plugins: any): Promise<void>;
export function getTopToBottomPluginInstanceTree(app: any, path: any): Promise<any[]>;
export function getBottomToTopPluginInstanceTree(app: any, path: any): Promise<any[]>;
export function attachPluginInstance(app: any, plugin: any, instance: any, directory: any): any;
