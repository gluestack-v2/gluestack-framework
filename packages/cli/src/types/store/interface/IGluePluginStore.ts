export default interface IGluePluginStore {
	restore(): void;
	set(key: string, value: any): any;
	get(key: string): any;
	save(): void;
}
