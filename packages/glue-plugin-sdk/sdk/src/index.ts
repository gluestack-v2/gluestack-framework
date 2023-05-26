import SDK from './helpers/lib/sdk';
import { config } from '@project/UPDATECONFIGTYPE';

export const serverSDK = async () => {
	const app = SDK.getInstance();
	// await app.init();
	const configOutput = config();
	let abc = await app.initProviders(configOutput.providers);
	return abc;
};

export default await serverSDK();
