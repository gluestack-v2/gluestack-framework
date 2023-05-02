'use strict';
import install from './install';
import instanceList from './instance-list';

const commands = () => {
	return [install, instanceList];
};

export default commands;
