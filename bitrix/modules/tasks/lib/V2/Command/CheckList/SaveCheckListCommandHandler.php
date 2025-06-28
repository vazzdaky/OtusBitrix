<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\CheckList;

use Bitrix\Tasks\Exception;
use Bitrix\Tasks\V2\Entity;
use Bitrix\Tasks\V2\Internals\Service\CheckList\CheckListService;

class SaveCheckListCommandHandler
{
	public function __construct(
		private readonly CheckListService $checkListService,
	)
	{
	}

	public function __invoke(SaveCheckListCommand $command): Entity\Task
	{
		if (!is_array($command->task->checklist))
		{
			throw new Exception('Checklist needs to be provided');
		}

		return $this->checkListService->save($command->task->checklist, $command->task->getId(), $command->updatedBy);
	}
}
