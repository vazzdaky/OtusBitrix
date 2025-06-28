<?php

namespace Bitrix\Tasks\V2\Internals\Control\Task\Trait;

use Bitrix\Tasks\Kanban\StagesTable;

trait PinTrait
{
	use ParticipantTrait;

	private function pin(array $fullTaskData): void
	{
		$newUsers = $this->getParticipants($fullTaskData);

		StagesTable::pinInStage($fullTaskData['ID'], $newUsers);
	}
}