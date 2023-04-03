export default interface IPluginInstancesJSON {
    [key: string]: {
        instance: string;
        directory: string;
        container_store: {};
    }[];
}
