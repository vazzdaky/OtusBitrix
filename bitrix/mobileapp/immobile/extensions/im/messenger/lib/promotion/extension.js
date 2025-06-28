/**
 * @module im/messenger/lib/promotion
 */
jn.define('im/messenger/lib/promotion', (require, exports, module) => {
	const { Type } = require('type');
	const { Color } = require('tokens');

	const { Promo, PromoType, EventType } = require('im/messenger/const');
	const { Logger } = require('im/messenger/lib/logger');
	const { PromotionRest } = require('im/messenger/provider/rest');
	const { CopilotView } = require('im/messenger/lib/promotion/copilot-view');
	const { serviceLocator } = require('im/messenger/lib/di/service-locator');
	const { NavigationTab } = require('im/messenger/const');
	const { Feature } = require('im/messenger/lib/feature');

	const COMPONENT_NAME = 'im.messenger.Promotion';

	/**
	 * @class Promotion
	 */
	class Promotion
	{
		constructor()
		{
			this.bindMethods();

			this.promoCollection = this.buildPromoCollection();
			this.activePromoList = [];
			this.currentActivePromo = '';
			this.messagerInitService = serviceLocator.get('messenger-init-service');
			this.subscribeEvents();
		}

		bindMethods()
		{
			this.onCloseWidget = this.onCloseWidget.bind(this);
			this.handlePromotionGet = this.handlePromotionGet.bind(this);
			this.onReadPromo = this.#onReadPromo.bind(this);
			this.showPromoCopilotInDefaultTab = this.#showPromoCopilotInDefaultTab.bind(this);
			this.openPromoOnInit = this.openPromoOnInit.bind(this);
			this.openPromotionFromBackgroundUIManagerEvent = this.openPromotionFromBackgroundUIManagerEvent.bind(this);
		}

		subscribeEvents()
		{
			this.subscribeInitMessengerEvent();
			this.subscribeNavigationEvents();
			this.subscribeToBackgroundUIManagerEvent();
		}

		subscribeToBackgroundUIManagerEvent()
		{
			BX.addCustomEvent(
				'BackgroundUIManager::openComponentInAnotherContext',
				this.openPromotionFromBackgroundUIManagerEvent,
			);
		}

		/**
		 * @param {string} componentName
		 */
		openPromotionFromBackgroundUIManagerEvent(componentName)
		{
			if (componentName === COMPONENT_NAME)
			{
				this.showPromoCopilotInDefaultTab();
			}
		}

		unsubscribeBackgroundUIManagerEvent()
		{
			BX.removeCustomEvent(
				'BackgroundUIManager::openComponentInAnotherContext',
				this.openPromotionFromBackgroundUIManagerEvent,
			);
		}

		subscribeInitMessengerEvent()
		{
			this.messagerInitService.onInit(this.handlePromotionGet);
		}

		subscribeNavigationEvents()
		{
			BX.addCustomEvent(EventType.navigation.onRootTabsSelected, this.showPromoCopilotInDefaultTab);
		}

		unsubscribeNavigationEvents()
		{
			BX.removeCustomEvent(EventType.navigation.onRootTabsSelected, this.showPromoCopilotInDefaultTab);
		}

		destruct()
		{
			this.unsubscribeNavigationEvents();
			this.unsubscribeBackgroundUIManagerEvent();
		}

		/**
		 * @return {Record<string, showSpotlightOptions>}
		 */
		buildPromoCollection()
		{
			return {
				[Promo.copilotInDefaultTab]: {
					type: PromoType.spotlight,
					options: {
						setTarget: {
							target: NavigationTab.imMessenger,
							params: {
								useHighlight: false,
								type: 'rectangle',
							},
						},
						setComponent: {
							component: new CopilotView({ onClick: this.onReadPromo }),
							params: {
								backgroundColor: Color.bgContentInapp.toHex(),
							},
						},
						setHandler: (event) => {
							if (event === 'onOutsideClick')
							{
								this.onReadPromo();
							}
						},
					},
				},
			};
		}

		handlePromotionGet(data)
		{
			if (data?.promotion)
			{
				this.activePromoList = data.promotion;

				this.openPromoOnInit();
			}
		}

		openPromoOnInit()
		{
			BX.postComponentEvent(
				'BackgroundUIManagerEvents::tryToOpenComponentFromAnotherContext',
				[
					{
						componentName: COMPONENT_NAME,
						priority: 10000,
					},
				],
			);
		}

		/**
		 * @return {Promise<boolean>}
		 */
		async checkPromoCopilotInDefaultTab()
		{
			if (
				!Feature.isCopilotInDefaultTabAvailable
				|| !Feature.isCopilotEnabled
				|| !Feature.isSpotlightIdInTabViewAvailable
			)
			{
				return false;
			}

			const hasPromoCopilotInDefaultTab = this.activePromoList.includes(Promo.copilotInDefaultTab);
			const navigationContext = await PageManager.getNavigator().getNavigationContext();

			return navigationContext.isTabActive && hasPromoCopilotInDefaultTab;
		}

		async #showPromoCopilotInDefaultTab()
		{
			const isPromoShown = await this.checkPromoCopilotInDefaultTab();
			if (isPromoShown)
			{
				const spotlightParams = this.promoCollection[Promo.copilotInDefaultTab].options;

				this.currentActivePromo = Promo.copilotInDefaultTab;
				this.showSpotlight(spotlightParams);
			}
		}

		/**
		 * @param {showSpotlightOptions} options
		 */
		showSpotlight(options)
		{
			const spotlight = dialogs.createSpotlight();

			const {
				setComponent,
				setHint,
				setTarget,
				setHandler,
			} = options;

			if (setTarget?.target)
			{
				spotlight.setTarget(setTarget.target, setTarget.params);
			}

			if (setComponent?.component)
			{
				spotlight.setComponent(setComponent.component, setComponent.params);
			}
			else if (setHint?.text)
			{
				spotlight.setHint({ text: setHint.text });
			}

			spotlight.setHandler(setHandler);
			spotlight.show();

			this.spotlight = spotlight;
		}

		hideSpotlight()
		{
			this.spotlight?.hide();
		}

		showWidget()
		{
			PageManager.openWidget(
				'layout',
				{
					backdrop:
						{
							hideNavigationBar: true,
							shouldResizeContent: false,
							mediumPositionPercent: 93,
						},
				},
			).then(
				(widget) => {
					this.widget = widget;
					this.widgetReady();
					// TODO: refactor when the widget appears
					// this.widget.showComponent(new ReleaseView({ widget, videoHeight, url }));
				},
			).catch((error) => {
				Logger.error('Promotion.error widget', error);
			});
		}

		widgetReady()
		{
			this.subscribeWidgetEvents();
		}

		subscribeWidgetEvents()
		{
			this.widget.on(EventType.view.close, this.onCloseWidget);
			this.widget.on(EventType.view.hidden, this.onCloseWidget);
		}

		onCloseWidget()
		{
			this.onReadPromo();
		}

		show(id)
		{
			if (!this.promoCollection[id] || !this.activePromoList.includes(id))
			{
				return false;
			}

			const promo = this.promoCollection[id];

			if (promo.type === PromoType.spotlight)
			{
				this.currentActivePromo = id;
				this.showSpotlight(promo.options);
			}

			if (promo.type === PromoType.widget)
			{
				this.currentActivePromo = id;
				this.showWidget();
			}
			Logger.info('Promotion.show', id);

			setTimeout(() => {
				this.onReadPromo(id);
			}, 5000);

			return true;
		}

		#onReadPromo()
		{
			const currentPromoId = this.currentActivePromo;
			if (Type.isStringFilled(currentPromoId))
			{
				this.deleteActivePromo(currentPromoId);
				this.read(currentPromoId);
				this.hideSpotlight();
				this.currentActivePromo = '';
			}
		}

		deleteActivePromo(id)
		{
			this.activePromoList = this.activePromoList.filter((activePromoListId) => activePromoListId !== id);
		}

		read(id)
		{
			PromotionRest.read(id);
			Logger.info('Promotion.read', id);
		}
	}

	module.exports = {
		Promotion,
	};
});
