'use strict';
import install from './install';
import instanceList from './instance-list';
import pluginList from './plugin-list';
import pluginInit from './plugin-init';
import watch from './watch';

const commands = () => {
	return [install, instanceList, pluginList, pluginInit,watch];
};
export default commands;
