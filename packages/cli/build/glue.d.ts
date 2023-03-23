#!/usr/bin/env node
export = glue;
declare function glue(localPlugins?: any[]): Promise<App>;
import App = require("./lib/app");
