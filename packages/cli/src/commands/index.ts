'use strict';
import install from './install';
import instanceList from './instance-list';
import pluginList from './plugin-list';
import pluginInit from './plugin-init';

const commands = () => {
	return [install, instanceList, pluginList, pluginInit];
};

export default commands;
