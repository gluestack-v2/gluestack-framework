import { find } from 'lodash';
import IGluePluginStore from '../../../../types/store/interface/IGluePluginStore';
import GluePluginStore from '../../store/GluePluginStore';

class GluePluginStoreFactory {
	stores: IGluePluginStore[] = [];

	createPluginStoreInstance(path: string) {
		const loadedStore = find(this.stores, {
			path: path,
		});
		if (loadedStore) return loadedStore;
		const store = new GluePluginStore(path) as IGluePluginStore;
		this.stores.push(store);
		return store;
	}

	saveAllStores() {
		this.stores.forEach((store) => {
			store.save();
		});
	}
}

export default GluePluginStoreFactory;
