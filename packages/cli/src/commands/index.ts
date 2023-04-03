'use strict';
import install from './install';
import instanceList from './instance-list';
import pluginList from './plugin-list';
import pluginInit from './plugin-init';
import watch from './watch';
import build from './build';

const commands = () => {
	return [install, instanceList, pluginList, pluginInit, build, watch];
};
export default commands;
