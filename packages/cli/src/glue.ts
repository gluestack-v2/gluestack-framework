#!/usr/bin/env node

import App from './helpers/lib/app';
import IPlugin from "./types/plugin/interface/IPlugin";

const glue = async (localPlugins: Array<IPlugin> = []) => {
	const app = new App();

	await app.init(localPlugins);
	await app.destroy();

	return app;
};

module.exports = glue;
