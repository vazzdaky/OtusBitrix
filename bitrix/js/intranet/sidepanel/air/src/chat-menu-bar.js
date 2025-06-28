import { Dom, Reflection } from 'main.core';
import { EventEmitter } from 'main.core.events';
import { type Slider } from 'main.sidepanel';

export class ChatMenuBar
{
	#slider: Slider = null;
	#container: HTMLElement = null;
	#loaded: boolean = false;

	constructor(slider: Slider)
	{
		this.#slider = slider;

		this.#container = document.getElementById('im-chat-menu');
		if (!this.#container)
		{
			console.warn('ChatMenu: container not found');

			return;
		}

		Dom.append(this.#container, document.body);

		EventEmitter.subscribeOnce(this.#slider, 'SidePanel.Slider:onOpenStart', this.#handleSliderOpenStartOnce.bind(this));
		EventEmitter.subscribe(this.#slider, 'SidePanel.Slider:onOpening', this.#handleSliderOpening.bind(this));
		EventEmitter.subscribe(this.#slider, 'SidePanel.Slider:onClosing', this.#handleSliderClosing.bind(this));
		EventEmitter.subscribe(this.#slider, 'SidePanel.Slider:onCloseComplete', this.#handleSliderCloseComplete.bind(this));
		EventEmitter.subscribe(this.#slider, 'SidePanel.Slider:onDestroy', this.#handleSliderDestroy.bind(this));

		EventEmitter.subscribe('IM.Layout:onLayoutChange', () => {
			if (!this.#loaded)
			{
				this.#loaded = true;
				Dom.addClass(this.getContainer(), '--loaded');
			}
		});
	}

	getContainer(): HTMLElement
	{
		return this.#container;
	}

	setZIndex(zIndex: number): void
	{
		Dom.style(this.getContainer(), 'z-index', zIndex);
	}

	reset(): void
	{
		this.getMenu()?.reset();
	}

	getMenu(): typeof(BX.Main.interfaceButtons) | null
	{
		/**
		 *
		 * @type {BX.Main.interfaceButtonsManager}
		 */
		const menuManager = Reflection.getClass('BX.Main.interfaceButtonsManager');
		if (menuManager)
		{
			return menuManager.getById('chat-menu');
		}

		return null;
	}

	#handleSliderOpenStartOnce(): void
	{
		EventEmitter.subscribe(this.#slider.getZIndexComponent(), 'onZIndexChange', this.#handleZIndexChange.bind(this));
	}

	#handleSliderOpening(): void
	{
		this.setZIndex(this.#slider.getZIndexComponent().getZIndex() + 1);
		Dom.style(this.getContainer(), 'display', 'block');

		requestAnimationFrame(() => {
			Dom.addClass(this.getContainer(), '--open');
		});
	}

	#handleSliderClosing(): void
	{
		this.reset();
		Dom.removeClass(this.getContainer(), '--open');
	}

	#handleSliderCloseComplete(): void
	{
		Dom.style(this.getContainer(), 'display', 'none');
	}

	#handleSliderDestroy(): void
	{
		this.reset();
	}

	#handleZIndexChange(): void
	{
		const sliderZIndex = this.#slider.getZIndexComponent().getZIndex();

		this.setZIndex(sliderZIndex + 1);
	}
}
