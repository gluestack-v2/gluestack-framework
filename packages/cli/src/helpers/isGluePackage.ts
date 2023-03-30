export default (pluginName: string) => {
	if (pluginName.startsWith('glue-plugin-')) {
		return true;
	}

	if (pluginName.startsWith('@')) {
		let arr = pluginName.split('/');
		if (arr[1] && arr[1].startsWith('glue-plugin-')) {
			return true;
		}
	}
	return false;
};
