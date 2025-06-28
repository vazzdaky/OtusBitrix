/**
 * @module im/messenger/lib/counters/tab-counters/base
 */
jn.define('im/messenger/lib/counters/tab-counters/base', (require, exports, module) => {
	const { serviceLocator } = require('im/messenger/lib/di/service-locator');
	const { MessengerCounterSender } = require('im/messenger/lib/counters/counter-manager/messenger/sender');

	const { Logger } = require('im/messenger/lib/logger');

	/**
	 * @class BaseTabCounters
	 */
	class BaseTabCounters
	{
		constructor(options = {})
		{
			/**
			 * @type {MessengerCoreStore}
			 */
			this.store = serviceLocator.get('core').getStore();
			/**
			 * @type {MessengerInitService}
			 */
			this.messagerInitService = serviceLocator.get('messenger-init-service');
			/**
			 * @type {Logger}
			 */
			this.logger = options.logger || Logger;

			this.updateTimeout = null;
			this.updateInterval = 300;

			/**
			 * @protected
			 * @type {Set<number>}
			 */
			this.mutedChatCollection = new Set();

			this.bindMethods();
			this.initCounters();
		}

		bindMethods()
		{
			this.handleCountersGet = this.handleCountersGet.bind(this);
		}

		subscribeInitMessengerEvent()
		{
			this.messagerInitService.onInit(this.handleCountersGet);
		}

		sendCountersToCounterService(counters)
		{
			MessengerCounterSender.getInstance().sendInitialCounters(counters);
		}

		handleCountersGet()
		{}

		initCounters()
		{}

		/**
		 * @abstract
		 */
		clearAll()
		{}

		/**
		 * @protected
		 * @param {number} chatId
		 * @returns {string}
		 */
		getIdByChatId(chatId)
		{
			return `chat${chatId}`;
		}

		/**
		 * @abstract
		 * @param {number} chatId
		 * @return {void}
		 */
		deleteCounterByChatId(chatId)
		{}

		/**
		 * @abstract
		 * @param {CounterState} counterState
		 * @return {void}
		 */
		updateCounterDetailByCounterState(counterState)
		{}

		updateDelayed()
		{
			this.logger.log(`${this.getClassName()}.updateDelayed`);

			if (!this.updateTimeout)
			{
				this.updateTimeout = setTimeout(() => this.update(), this.updateInterval);
			}
		}

		update()
		{}

		/**
		 * @param {number} chatId
		 */
		addChatToMutedCollection(chatId)
		{
			this.mutedChatCollection.add(chatId);
		}

		/**
		 * @param {number} chatId
		 */
		deleteChatFromMutedCollection(chatId)
		{
			this.mutedChatCollection.delete(chatId);
		}

		/**
		 * @param {RecentModelState} recentItem
		 * @param {DialoguesModelState} dialogItem
		 * @return {number}
		 */
		calculateItemCounter(recentItem = {}, dialogItem = {})
		{
			let counter = 0;
			if (dialogItem.counter && dialogItem.counter > 0)
			{
				counter = dialogItem.counter;
			}
			else if (recentItem.unread)
			{
				counter = 1;
			}

			return counter;
		}

		/**
		 *
		 * @param {RecentModelState} recentItem
		 * @param {DialoguesModelState} dialogItem
		 * @return {number}
		 */
		calculateChatCounter(recentItem = {}, dialogItem = {})
		{
			let counter = 0;
			const commentCounter = this.store.getters['commentModel/getChannelCounters'](dialogItem?.chatId);
			if (commentCounter > 0)
			{
				counter += commentCounter;
			}

			if (dialogItem.counter && dialogItem.counter > 0)
			{
				counter += dialogItem.counter;
			}
			else if (recentItem.unread)
			{
				counter = 1;
			}

			return counter;
		}

		clearUpdateTimeout()
		{
			clearTimeout(this.updateTimeout);
			this.updateTimeout = null;
		}

		/**
		 * @desc get class name for logger
		 * @return {string}
		 */
		getClassName()
		{
			return this.constructor.name;
		}

		/**

		 * @param {immobileTabsLoadCommonResult['imCounters']} counters
		 * @return {Set<number>}
		 */
		getMutedCollectionByImCounters(counters)
		{
			const mutedChatList = Object.keys(counters.chatMuted)
				.map((chatId) => Number(chatId))
			;

			return new Set(mutedChatList);
		}
	}

	module.exports = { BaseTabCounters };
});
