/**
 * @module im/messenger/lib/logger
 */
jn.define('im/messenger/lib/logger', (require, exports, module) => {
	const {
		LoggerManager,
		getLogger,
	} = require('im/messenger/lib/logger/manager');

	module.exports = {
		LoggerManager,
		getLogger,
		Logger: getLogger('base'),
	};
});
