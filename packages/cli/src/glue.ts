#!/usr/bin/env node

import IPlugin from "./types/plugin/interface/IPlugin";

import App from './helpers/lib/app';

const glue = async (localPlugins: Array<IPlugin> = []) => {
	const app = new App();

	await app.init(localPlugins);
	await app.destroy();

	return app;
};

module.exports = glue;
