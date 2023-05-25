import SDK from './helpers/lib/sdk';
import { config } from '@project/config';

export const SDKINSTANCE = async () => {
	const app = SDK.getInstance();
	// await app.init();
	const providers = config();
	return providers;
	// app.init(providers)
	// return app;
};
