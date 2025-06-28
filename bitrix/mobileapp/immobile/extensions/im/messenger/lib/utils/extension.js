/**
 * @module im/messenger/lib/utils
 */
jn.define('im/messenger/lib/utils', (require, exports, module) => {
	const { UserUtils } = require('im/messenger/lib/utils/user');
	const { DateUtils } = require('im/messenger/lib/utils/date');
	const { ObjectUtils } = require('im/messenger/lib/utils/object');
	const { ColorUtils } = require('im/messenger/lib/utils/color');
	const { emojiRegex } = require('im/messenger/lib/utils/emoji-regex');
	const { createPromiseWithResolvers } = require('im/messenger/lib/utils/promise');
	const { AsyncQueue } = require('im/messenger/lib/utils/src/async-queue');

	module.exports = {
		UserUtils,
		DateUtils,
		ObjectUtils,
		ColorUtils,
		emojiRegex,
		AsyncQueue,
		createPromiseWithResolvers,
	};
});
