import SDK from './helpers/lib/sdk';
import { config } from '@project/UPDATECONFIGTYPE';

export default await (async () => {
	const app = SDK.getInstance();
	// await app.init();
	const configOutput = config();
	let abc = await app.initProviders(configOutput.providers);
	return abc;
})();
