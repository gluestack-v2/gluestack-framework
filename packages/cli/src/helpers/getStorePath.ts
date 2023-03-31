import AppCLI from '../helpers/lib/app';

export function getPluginStorePath(pluginName: string) {
	return `${process.cwd()}/.glue/internals/store/${pluginName}/index.json`;
}

export function getPluginInstanceStorePath(
	instanceName: string,
	pluginName: string
	) {
	return `${process.cwd()}/.glue/internals/store/${pluginName}/${instanceName}.json`;
}

export function injectPluginStore(app: AppCLI, pluginName: string) {
	const store = app.gluePluginStoreFactory.createPluginStoreInstance(
		getPluginStorePath(pluginName)
	);
	store.restore();
	return store;
}

export function injectPluginInstanceStore(app: AppCLI, pluginName: string, instanceName: string) {
	const store = app.gluePluginStoreFactory.createPluginStoreInstance(
		getPluginInstanceStorePath(instanceName, pluginName)
	);
	store.restore();
	return store;
}
