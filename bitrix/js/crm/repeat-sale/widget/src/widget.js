import { ContentFactory } from './content-factory';
import { Base } from './content/base';
import 'ui.design-tokens';
import './widget.css';

export type WidgetTypeEnum = WidgetType.start | WidgetType.statistics;

export const PeriodType = Object.freeze({
	day30: 0,
	quarter: 1,
	halfYear: 2,
	year: 3,
});

export const WidgetType = Object.freeze({
	start: 'start',
	statistics: 'statistics',
});

export type WidgetParams = {
	showSettingsButton?: boolean,
	showConfetti?: boolean,
}

export class Widget
{
	static instance: Array = [];
	#contentPopupInstance: ?Base = null;

	static execute(
		widgetType: WidgetTypeEnum,
		bindElement: ?HTMLElement = null,
		params: WidgetParams = {},
		event: ?Event = null,
	): void
	{
		if (!this.instance[widgetType])
		{
			this.instance[widgetType] = new Widget(widgetType, bindElement, params);
		}

		if (this.instance[widgetType].isShown())
		{
			this.instance[widgetType].close();
		}
		else
		{
			const forceShowConfetti = (event?.altKey && event?.ctrlKey) ?? false;

			this.instance[widgetType].show(forceShowConfetti);
		}
	}

	constructor(widgetType: WidgetTypeEnum, bindElement: ?HTMLElement = null, params: WidgetParams = {})
	{
		this.#contentPopupInstance = ContentFactory.getContentInstance(widgetType, params);

		if (bindElement)
		{
			this.#contentPopupInstance.setBindElement(bindElement);
		}
	}

	show(forceShowConfetti: boolean = false): void
	{
		this.#contentPopupInstance.show(forceShowConfetti);
	}

	isShown(): boolean
	{
		return this.#contentPopupInstance.isShown();
	}

	close(): void
	{
		this.#contentPopupInstance.close();
	}
}