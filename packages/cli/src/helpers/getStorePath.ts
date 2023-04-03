import AppCLI from '../helpers/lib/app';

export const getPluginStorePath = (pluginName: string) => {
	return `${process.cwd()}/.glue/internals/store/${pluginName}/index.json`;
};

export const getPluginInstanceStorePath = (
	instanceName: string,
	pluginName: string
) => {
	return `${process.cwd()}/.glue/internals/store/${pluginName}/${instanceName}.json`;
};

export const injectPluginStore = (
	app: AppCLI,
	pluginName: string
) => {
	const store = app.gluePluginStoreFactory.createPluginStoreInstance(
		getPluginStorePath(pluginName)
	);
	store.restore();
	return store;
};

export const injectPluginInstanceStore = (
	app: AppCLI,
	pluginName: string,
	instanceName: string
) => {
	const store = app.gluePluginStoreFactory.createPluginStoreInstance(
		getPluginInstanceStorePath(instanceName, pluginName)
	);
	store.restore();
	return store;
};
