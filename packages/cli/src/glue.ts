#!/usr/bin/env node

import IGSPlugin from "./types/plugin/interface/IGSPlugin";

import App from './helpers/lib/app';

const glue = async (localPlugins: Array<IGSPlugin> = []) => {
	const app = new App();

	await app.init(localPlugins);
	await app.destroy();

	return app;
};

module.exports = glue;
