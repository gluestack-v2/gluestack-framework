import SDK from './helpers/lib/sdk';
import { config } from '@project/UPDATECONFIGTYPE';

export default (() => {
	const app = SDK.getInstance();
	const configOutput = config();
	let abc = app.initProviders(configOutput.providers);
	return app;
})();
