export interface IPluginObject {
	plugin: string;
	instance: string;
	directory: string;
	version: string;
}

type IPluginArray = IPluginObject[];

export default IPluginArray;
