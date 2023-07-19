import SDK from './helpers/lib/sdk';
import { config } from '@project/UPDATECONFIGTYPE';
// Add imports here

const env = (str: string) => {
	let env /*** UPDATE_ENV_BASED_ON_ENVIRONMENT ***/;
	// @ts-ignore
	return env[str];
};
export default (() => {
	const app = SDK.getInstance();
	const configOutput = config();
	app.initProviders(configOutput.providers);
	return { ...app, config, env };
})();
