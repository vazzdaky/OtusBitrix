<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Service\Task;

use Bitrix\Main\Event;
use Bitrix\Tasks\V2\Entity\HistoryLog;
use Bitrix\Tasks\V2\Entity\Task\ElapsedTime;
use Bitrix\Tasks\V2\Internals\Repository\ElapsedTimeRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\Mapper\ElapsedTimeMapper;
use Bitrix\Tasks\V2\Internals\Repository\TaskLogRepositoryInterface;

class ElapsedTimeService
{
	public function __construct(
		private readonly ElapsedTimeRepositoryInterface $elapsedTimeRepository,
		private readonly TaskLogRepositoryInterface $taskLogRepository,
		private readonly ElapsedTimeMapper $elapsedTimeMapper,
	)
	{

	}

	public function add(ElapsedTime $elapsedTime): ?array
	{
		$fields = $this->elapsedTimeMapper->mapFromEntity($elapsedTime);

		foreach (GetModuleEvents('tasks', 'OnBeforeTaskElapsedTimeAdd', true) as $arEvent)
		{
			if (ExecuteModuleEventEx($arEvent, [&$fields]) === false)
			{
				return null;
			}
		}

		$elapsedTime = $this->elapsedTimeMapper->mapToEntity($fields);

		$currentDuration = $this->elapsedTimeRepository->getSum($elapsedTime->taskId);

		$id = $this->elapsedTimeRepository->save($elapsedTime);

		$log = new HistoryLog(
			userId:    $elapsedTime->userId,
			taskId:    $elapsedTime->taskId,
			field:     'TIME_SPENT_IN_LOGS',
			fromValue: $currentDuration,
			toValue:   $currentDuration + $elapsedTime->seconds,
		);

		$this->taskLogRepository->add($log);

		$event = new Event('tasks', 'OnTaskElapsedTimeAdd', [$id, $fields]);
		$event->send();

		return [$id, $currentDuration];
	}
}