import SDK from './helpers/lib/sdk';
import { config } from "@project/config";

const sdk = async () => {
	const app = SDK.getInstance();
	// await app.init();
	const providers = config('providers');
	app.init(providers)
	return app;
};
const app = SDK.getInstance();

module.exports = sdk;

