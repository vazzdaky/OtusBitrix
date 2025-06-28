<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Delete\Relation;

class DeleteFiles
{
	public function __invoke(array $fullTaskData): void
	{
		\CTaskFiles::DeleteByTaskID($fullTaskData['ID']);
	}
}