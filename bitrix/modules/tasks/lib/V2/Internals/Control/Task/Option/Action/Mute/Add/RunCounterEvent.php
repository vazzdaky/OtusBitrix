<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Option\Action\Mute\Add;

use Bitrix\Tasks\Internals\Counter\CounterService;
use Bitrix\Tasks\Internals\Counter\Event\EventDictionary;
use Bitrix\Tasks\V2\Entity;

class RunCounterEvent
{
	public function __invoke(Entity\Task\UserOption $userOption): void
	{
		CounterService::addEvent(EventDictionary::EVENT_AFTER_TASK_MUTE, [
			'TASK_ID' => $userOption->taskId,
			'USER_ID' => $userOption->userId,
			'ADDED' => true,
		]);
	}
}