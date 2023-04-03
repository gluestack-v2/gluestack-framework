interface Plugin {
    package: string;
    description: string;
}
interface PluginList {
    [key: string]: Plugin;
}
declare const PLUGINS: PluginList;
export { PLUGINS };
