<?php

namespace Bitrix\Crm\RepeatSale\Schedule;

use Bitrix\Crm\RepeatSale\Job\Controller\RepeatSaleJobController;
use Bitrix\Crm\RepeatSale\Queue\Controller\RepeatSaleQueueController;
use Bitrix\Crm\RepeatSale\Queue\QueueItem;
use Bitrix\Crm\RepeatSale\Service\Handler\ConfigurableHandler;
use Bitrix\Crm\RepeatSale\Service\Handler\SystemHandler;
use Bitrix\Crm\Service\Container;
use Bitrix\Crm\Traits\Singleton;
use Bitrix\Main\ORM\Objectify\Collection;
use Bitrix\Main\Type\Date;

final class Scheduler
{
	use Singleton;

	private bool $isOnlyCalc = false;

	public function execute(): void
	{
		if (!Container::getInstance()->getRepeatSaleAvailabilityChecker()->isEnabled())
		{
			return;
		}

		$params = [
			'date' => (new Date())->getTimestamp(),
		];

		$queueController = RepeatSaleQueueController::getInstance();

		$jobs = $this->getSuitableJobs();
		foreach ($jobs as $job)
		{
			$segmentCode = $job->getSegment()->getCode();
			$itemParams = [
				'segmentCode' => $segmentCode,
				'segmentId' => $job->getSegmentId(),
			];

			$queueItem = QueueItem::createFromArray([
				'jobId' => $job->getId(),
				'params' => array_merge($params, $itemParams),
				'isOnlyCalc' => $this->isOnlyCalc,
				'handlerTypeId' => (
					$segmentCode === null
						? ConfigurableHandler::getType()->value
						: SystemHandler::getType()->value
				),
			]);

			$queueController->add($queueItem);
		}
	}

	public function setOnlyCalc(bool $value = true): self
	{
		$this->isOnlyCalc = $value;

		return $this;
	}

	/**
	 * @return Collection
	 */
	private function getSuitableJobs(): Collection
	{
		$params = [];
		if (!$this->isOnlyCalc)
		{
			$params['filter'][] = [
				'SEGMENT.IS_ENABLED' => 'Y',
			];
		}

		return RepeatSaleJobController::getInstance()->getList($params);
	}
}
