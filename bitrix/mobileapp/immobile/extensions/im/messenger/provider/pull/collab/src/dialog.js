/* eslint-disable promise/catch-or-return */

/**
 * @module im/messenger/provider/pull/collab/dialog
 */
jn.define('im/messenger/provider/pull/collab/dialog', (require, exports, module) => {
	const { ChatDialogPullHandler } = require('im/messenger/provider/pull/chat');
	const { LoggerManager } = require('im/messenger/lib/logger');
	const { TabCounters } = require('im/messenger/lib/counters/tab-counters');
	const logger = LoggerManager.getInstance().getLogger('pull-handler--collab-dialog');

	/**
	 * @class CollabDialogPullHandler
	 */
	class CollabDialogPullHandler extends ChatDialogPullHandler
	{
		constructor()
		{
			super({ logger });
		}

		handleReadAllChats(params, extra, command)
		{
			logger.info(`${this.getClassName()}.handleReadAllChats and nothing happened`, params);
			// read all action is not available now for collab tab
		}

		/**
		 * @param {String} dialogId
		 * @void
		 */
		deleteCounters(dialogId)
		{
			delete TabCounters.collabCounter.detail[dialogId];
		}
	}

	module.exports = {
		CollabDialogPullHandler,
	};
});
