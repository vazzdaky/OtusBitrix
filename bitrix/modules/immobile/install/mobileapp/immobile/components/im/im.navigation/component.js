'use strict';
/* global tabs */
(async () => {

	console.log('Navigation is loaded.');
	const require = jn.require;

	const { EntityReady } = require('entity-ready');
	const { serviceLocator } = require('im/messenger/lib/di/service-locator');
	const { NavigationApplication } = require('im/messenger/core/navigation');
	const core = new NavigationApplication({
		localStorage: {
			enable: true,
			readOnly: false,
		},
	});
	try
	{
		await core.init();
	}
	catch (error)
	{
		console.error('NavigationApplication init error:', error);
	}
	serviceLocator.add('core', core);

	const emitter = new JNEventEmitter();
	serviceLocator.add('emitter', emitter);

	const { NotifyManager } = require('notify-manager');
	const { AnalyticsEvent } = require('analytics');

	const { Analytics, EventType, ComponentCode, NavigationTab, NavigationTabByComponent } = require('im/messenger/const');
	const { MessengerEmitter } = require('im/messenger/lib/emitter');
	const { Feature } = require('im/messenger/lib/feature');

	const { VisibilityManager } = require('im/messenger/lib/visibility-manager');
	const { ConnectionService } = require('im/messenger/provider/services/connection');
	const { NavigationCounterHandler } = require('im/messenger/lib/counters/counter-manager/navigation');

	class NavigationManager
	{
		#currentTab;

		constructor()
		{
			this.core = core;
			this.isReady = false;
			this.isViewReady = false;
			EntityReady.addCondition('im.navigation', () => this.isReady);
			EntityReady.addCondition('im.navigation::view', () => this.isViewReady);

			BX.onViewLoaded(() => {
				this.isViewReady = true;
				EntityReady.ready('im.navigation::view');
			});

			this.firstSetBadge = true;
			this.counters = {};

			this.tabMapping = {
				chats: ComponentCode.imMessenger,
				channel: ComponentCode.imChannelMessenger,
				copilot: ComponentCode.imCopilotMessenger,
				collab: ComponentCode.imCollabMessenger,
				notifications: ComponentCode.imNotify,
				openlines: ComponentCode.imOpenlinesRecent,
			};
			this.componentMapping = null;

			this.#currentTab = BX.componentParameters.get('firstTabId', 'chats');
			this.previousTab = 'none';

			this.visibilityManager = VisibilityManager.getInstance();
			this.counterHandler = NavigationCounterHandler.getInstance();
			void this.saveActiveTabInfo();

			// navigation
			tabs.on('onTabSelected', this.onTabSelected.bind(this));
			BX.addCustomEvent('onTabChange', this.onTabChange.bind(this));

			// counters
			BX.addCustomEvent('ImRecent::counter::list', this.onUpdateCounters.bind(this));
			BX.addCustomEvent('onUpdateCounters', this.onUpdateCounters.bind(this));
			BX.addCustomEvent(EventType.navigation.broadCastEventWithTabChange, this.onBroadcastEventTabChange.bind(this));
			BX.addCustomEvent(EventType.navigation.broadCastEventCheckTabPreload, this.onBroadcastEventCheckTabPreload.bind(this));
			BX.addCustomEvent(EventType.navigation.changeTab, this.changeTabHandler.bind(this));
			BX.addCustomEvent(EventType.app.active, this.onAppActive.bind(this));
			BX.postComponentEvent('requestCounters', [{ component: 'im.navigation' }], 'communication');
			BX.addCustomEvent(EventType.navigation.onRootTabsSelected, this.onRootTabsSelected.bind(this));
			BX.addCustomEvent(EventType.navigation.closeAll, this.closeAll.bind(this));
			BX.addCustomEvent(EventType.app.changeStatus, this.onAppStatusChange.bind(this));

			this.connectionService = ConnectionService.getInstance();

			EntityReady.ready('im.navigation');

			if (PageManager.getNavigator().isActiveTab())
			{
				this.sendAnalyticsOpenRootTabChat();
				this.sendAnalyticsChangeTab();
			}

			this.isReady = true;
			this.currentTabOptions = {};
		}

		set currentTab(tab)
		{
			this.#currentTab = tab;

			void this.saveActiveTabInfo();
		}

		get currentTab()
		{
			return this.#currentTab;
		}

		saveActiveTabInfo()
		{
			return this.visibilityManager.saveActiveTabInfo({
				tabId: this.currentTab,
				componentCode: this.tabMapping[this.currentTab],
			});
		}

		onAppActive()
		{
			if (PageManager.getNavigator().isActiveTab())
			{
				this.sendAnalyticsOpenRootTabChat();
			}
		}

		onTabChange(id)
		{
			if (
				id === 'none'
				|| this.currentTab === id
			)
			{
				return;
			}
			console.log(`${this.constructor.name}.onTabChange id:`, id);

			if (!PageManager.getNavigator().isActiveTab())
			{
				PageManager.getNavigator().makeTabActive();
			}

			BX.onViewLoaded(() => {
				setTimeout(() => {
					const previousTab = this.currentTab;

					tabs.setActiveItem(id);
					this.currentTab = tabs.getCurrentItem() ? tabs.getCurrentItem()?.id : 'chats';
					if (this.currentTab !== previousTab)
					{
						this.previousTab = previousTab;
					}
				}, 100); // TODO change when makeTabActive will return a promise
			});
		}

		changeTabHandler(componentCode, options = {})
		{
			if (!NavigationTabByComponent[componentCode])
			{
				BX.postComponentEvent(EventType.navigation.changeTabResult, [{
					componentCode,
					errorText: `im.navigation: Error changing tab, tab ${componentCode} does not exist.`,
				}]);

				return;
			}

			if (
				componentCode === ComponentCode.imCopilotMessenger
				&& !BX.componentParameters.get('IM_FEATURES', {}).copilotActive
			)
			{
				BX.postComponentEvent(EventType.navigation.changeTabResult, [{
					componentCode,
					errorText: `im.navigation: Error changing tab, tab ${componentCode} is disabled.`,
				}]);

				return;
			}

			if (
				componentCode === ComponentCode.imCollabMessenger
				&& !Feature.isCollabSupported
			)
			{
				this.handleCollabsAreNotSupported();

				BX.postComponentEvent(EventType.navigation.changeTabResult, [{
					componentCode,
					errorText: `im.navigation: Error changing tab, tab ${componentCode} is disabled.`,
				}]);

				return;
			}

			this.currentTabOptions = options;

			tabs.setActiveItem(NavigationTabByComponent[componentCode]);

			PageManager.getNavigator().makeTabActive();

			BX.postComponentEvent(EventType.navigation.changeTabResult, [{
				componentCode,
			}]);
		}

		async closeAll()
		{
			return new Promise((resolve, reject) => {
				PageManager.getNavigator().popTo('im.tabs')
					.then(() => {
						BX.postComponentEvent(EventType.navigation.closeAllComplete, [{ isSuccess: true }]);
						resolve();
					})
					.catch((error) => {
						BX.postComponentEvent(EventType.navigation.closeAllComplete, [{ isSuccess: false }]);

						reject(new Error(`NavigationManager.closeAll error: ${error}`));
					});
			});
		}

		onTabSelected(item, changed)
		{
			if (!changed)
			{
				console.log(`${this.constructor.name}.onTabSelected select active element:`, this.currentTab);

				return true;
			}

			if (this.currentTab === item.id)
			{
				console.log(`${this.constructor.name}.onTabSelected selected tab is equal current, this.currentTab:`, this.currentTab, item.id);

				return true;
			}

			if (
				item.id === NavigationTab.imCollabMessenger
				&& !Feature.isCollabSupported
			)
			{
				this.handleCollabsAreNotSupported();

				return;
			}

			this.previousTab = this.currentTab;
			this.currentTab = item.id;

			console.warn(`${this.constructor.name}.onTabSelected tabs:`, {
				current: this.currentTab,
				previous: this.previousTab,
			}, item, changed);

			BX.postComponentEvent(EventType.navigation.tabChanged, [{
				newTab: this.currentTab,
				previousTab: this.previousTab,
			}]);

			const { analytics = {} } = this.currentTabOptions || {};
			this.sendAnalyticsChangeTab(analytics);

			this.currentTabOptions = {};
		}

		/**
		 * @param {String} id
		 */
		onRootTabsSelected(id)
		{
			console.log(`${this.constructor.name}.onRootTabsSelected id:`, id);

			const rootTabChatName = 'chats';
			if (id === rootTabChatName)
			{
				this.sendAnalyticsOpenRootTabChat();
				this.sendAnalyticsChangeTab();
			}
		}

		sendAnalyticsChangeTab(analyticsOptions = {})
		{
			if (this.currentTab === 'copilot') // TODO delete this, when will be universal event like below
			{
				const analytics = new AnalyticsEvent()
					.setTool(Analytics.Tool.ai)
					.setCategory(Analytics.Category.chatOperations)
					.setEvent(Analytics.Event.openTab)
					.setSection(Analytics.Section.copilotTab);

				analytics.send();
			}

			const type = this.currentTab === 'chats' ? Analytics.Type.chat : Analytics.Type[this.currentTab];
			const analytics = new AnalyticsEvent()
				.setTool(analyticsOptions.tool ?? Analytics.Tool.im)
				.setCategory(analyticsOptions.category ?? Analytics.Category.messenger)
				.setEvent(analyticsOptions.event ?? Analytics.Event.openTab)
				.setType(analyticsOptions.type ?? type);

			analytics.send();
		}

		sendAnalyticsOpenRootTabChat()
		{
			const analytics = new AnalyticsEvent()
				.setTool(Analytics.Tool.im)
				.setCategory(Analytics.Category.messenger)
				.setEvent(Analytics.Event.openMessenger);

			analytics.send();
		}

		async onUpdateCounters(counters, delay)
		{
			await EntityReady.wait('im.navigation::view');
			let needUpdate = false;
			const params = { ...counters };
			console.info(`${this.constructor.name}.onUpdateCounters params:`, params, delay);

			for (const element in params)
			{
				if (!params.hasOwnProperty(element))
				{
					continue;
				}

				params[element] = Number(params[element]);

				if (Number.isNaN(params[element]))
				{
					continue;
				}

				if (this.counters[element] == params[element])
				{
					continue;
				}

				this.counters[element] = params[element];
				needUpdate = true;
			}

			if (needUpdate)
			{
				this.updateCounters(delay === false);
			}
		}

		getComponentCodeByTab(tabId)
		{
			return this.tabMapping[tabId];
		}

		getTabCodeByComponent(componentId)
		{
			if (this.componentMapping)
			{
				return this.componentMapping[componentId];
			}

			for (const tabId in this.tabMapping)
			{
				if (!this.tabMapping.hasOwnProperty(tabId))
				{
					continue;
				}

				const componentId = this.tabMapping[tabId];
				this.componentMapping[componentId] = tabId;
			}

			return this.componentMapping[componentId];
		}

		updateCounters(delay)
		{
			if (delay && !this.firstSetBadge)
			{
				if (!this.updateCountersTimeout)
				{
					this.updateCountersTimeout = setTimeout(this.update.bind(this), 300);
				}

				return true;
			}

			this.firstSetBadge = true;

			clearTimeout(this.updateCountersTimeout);
			this.updateCountersTimeout = null;

			console.info(`${this.constructor.name}.updateCounters counters:`, this.counters, delay);

			[
				NavigationTab.imMessenger,
				NavigationTab.imOpenlinesRecent,
				NavigationTab.imNotify,
				NavigationTab.imCopilotMessenger,
				NavigationTab.imCollabMessenger,
			].forEach((tab) => {
				const counter = this.counters[tab] ?? 0;
				tabs.updateItem(tab, {
					counter,
					label: counter ? counter.toString() : '',
				});
			});
		}

		/**
		 * @param {onBroadcastEventParams} [params]
		 */
		async onBroadcastEventTabChange(params)
		{
			const componentCodeByTab = this.getComponentCodeByTab(params.toTab);
			if (!componentCodeByTab)
			{
				console.error(`${this.constructor.name}.onBroadcastEventTabChange error - missing componentCode for ${params.toTab}`);

				return;
			}
			console.info(`${this.constructor.name}.onBroadcastEventTabChange params:`, params);

			if (
				componentCodeByTab === ComponentCode.imCollabMessenger
				&& !Feature.isCollabSupported
			)
			{
				this.handleCollabsAreNotSupported();
			}
			else
			{
				await this.handleBroadcastEventSetActiveItem(params.toTab, componentCodeByTab);
			}

			MessengerEmitter.emit(params.broadCastEvent, params.data, componentCodeByTab);
		}

		/**
		 * @param {onBroadcastEventParams} [params]
		 */
		async onBroadcastEventCheckTabPreload(params)
		{
			const componentCodeByTab = this.getComponentCodeByTab(params.toTab);
			if (!componentCodeByTab)
			{
				console.error(`${this.constructor.name}.onBroadcastEventCheckTabPreload error - missing componentCode for ${params.toTab}`);

				return;
			}
			console.info(`${this.constructor.name}.onBroadcastEventCheckTabPreload params:`, params);

			if ([NavigationTab.imMessenger, NavigationTab.imOpenlinesRecent, NavigationTab.imNotify].includes(params.toTab))
			{
				MessengerEmitter.emit(params.broadCastEvent, params.data, componentCodeByTab);

				return;
			}

			const emitData = params.data;
			const ready = EntityReady.isReady(`${componentCodeByTab}::launched`);
			if (!ready)
			{
				await this.checkIsOpenDialogByComponentLaunched(componentCodeByTab);

				emitData.backToMessenegerTab = true;
			}

			MessengerEmitter.emit(params.broadCastEvent, params.data, componentCodeByTab);
		}

		handleCollabsAreNotSupported()
		{
			console.log(`${this.constructor.name}.handleCollabsAreNotSupported`);

			tabs.setActiveItem(NavigationTabByComponent[ComponentCode.imMessenger]);
			Feature.showUnsupportedWidget();
			this.currentTab = NavigationTab.imMessenger;
		}

		/**
		 * @param {NavigationTab} navigationTab
		 * @param {ComponentCode} componentCode
		 */
		handleBroadcastEventSetActiveItem(navigationTab, componentCode)
		{
			console.log(`${this.constructor.name}.handleBroadcastEventSetActiveItem:`, navigationTab);

			if (this.currentTab === navigationTab)
			{
				return true;
			}

			if ([NavigationTab.imMessenger, NavigationTab.imOpenlinesRecent, NavigationTab.imNotify].includes(navigationTab))
			{
				tabs.setActiveItem(navigationTab);

				return true;
			}

			const ready = EntityReady.isReady(`${componentCode}::launched`);
			if (!ready)
			{
				return this.checkIsOpenDialogByComponentLaunched(componentCode);
			}

			tabs.setActiveItem(navigationTab);

			return true;
		}

		/**
		 * @param {ComponentCode} componentCode
		 */
		async checkIsOpenDialogByComponentLaunched(componentCode)
		{
			try
			{
				if (!Feature.isIOSChangeTabInBackgroundAvailable)
				{
					Feature.showUnsupportedWidget();

					return;
				}

				void NotifyManager.showLoadingIndicator();

				tabs.setActiveItem(NavigationTabByComponent[componentCode]);

				await EntityReady.wait(`${componentCode}::ready`);

				NotifyManager.hideLoadingIndicatorWithoutFallback();
			}
			catch (error)
			{
				NotifyManager.hideLoadingIndicatorWithoutFallback();
				console.error(`${this.constructor.name}.checkIsOpenDialogByComponentLaunched catch:`, error);
			}
		}

		/**
		 * @param {{name: string, value: string}} event
		 */
		onAppStatusChange(event)
		{
			core.setAppStatus(event.name, event.value);
		}
	}

	window.Navigation = new NavigationManager();
})().catch((error) => {
	console.error(error);
});
