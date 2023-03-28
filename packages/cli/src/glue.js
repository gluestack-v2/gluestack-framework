#!/usr/bin/env node

const App = require('./helpers/lib/app');

const glue = async (localPlugins = []) => {
	const app = new App();

	await app.init(localPlugins);
	await app.destroy();

	return app;
};

module.exports = glue;
