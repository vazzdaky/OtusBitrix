import { Base } from './content/base';
import { Start } from './content/start';
import { Statistics } from './content/statistics';
import type { WidgetParams, WidgetTypeEnum } from './widget';
import { WidgetType } from './widget';

export class ContentFactory
{
	static getContentInstance(widgetType: WidgetTypeEnum, params: WidgetParams = {}): Base
	{
		switch (widgetType)
		{
			case WidgetType.start:
				return new Start(params);
			case WidgetType.statistics:
				return new Statistics(params);
			default:
				return null;
		}
	}
}
