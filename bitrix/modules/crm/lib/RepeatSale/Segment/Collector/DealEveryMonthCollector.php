<?php

namespace Bitrix\Crm\RepeatSale\Segment\Collector;

final class DealEveryMonthCollector extends BasePeriodCollector
{
	protected function getIntervals(): array
	{
		return ['-1 month', '-2 months'];
	}
}
