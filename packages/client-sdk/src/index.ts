import SDK from './helpers/lib/sdk';
import { config } from "@gluestack-v2/framework-config";

const sdk = async () => {
	const app = SDK.getInstance();
	// await app.init();
	app.init(config.providers)

	return app;
};

module.exports = sdk;
