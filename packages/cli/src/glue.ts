#!/usr/bin/env node

import IGSPlugin from "./types/plugin/interface/IGSPlugin";

const App = require('./helpers/lib/app');

const glue = async (localPlugins: Array<IGSPlugin> = []) => {
	const app = new App();

	await app.init(localPlugins);
	await app.destroy();

	return app;
};

export default glue;
