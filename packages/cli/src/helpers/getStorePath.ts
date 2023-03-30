import IAppCLI from '../types/app/interface/IApp';

function getPluginStorePath(pluginName: string) {
	return `${process.cwd()}/.glue/internals/store/${pluginName}/index.json`;
}
function getPluginInstanceStorePath(
	instanceName: string,
	pluginName: string
	) {
	return `${process.cwd()}/.glue/internals/store/${pluginName}/${instanceName}.json`;
}

function injectPluginStore(app: IAppCLI, pluginName: string) {
	const store = app.gluePluginStoreFactory.createPluginStoreInstance(
		getPluginStorePath(pluginName)
	);
	store.restore();
	return store;
}

function injectPluginInstanceStore(app: IAppCLI, pluginName: string, instanceName: string) {
	const store = app.gluePluginStoreFactory.createPluginStoreInstance(
		getPluginInstanceStorePath(instanceName, pluginName)
	);
	store.restore();
	return store;
}

export {
	getPluginStorePath,
	getPluginInstanceStorePath,
	injectPluginStore,
	injectPluginInstanceStore,
};
