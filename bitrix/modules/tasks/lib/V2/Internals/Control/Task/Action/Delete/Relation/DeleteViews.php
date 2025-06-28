<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Delete\Relation;

use Bitrix\Tasks\Internals\Task\ViewedTable;

class DeleteViews
{
	public function __invoke(array $fullTaskData): void
	{
		ViewedTable::deleteList(['=TASK_ID' => $fullTaskData['ID']]);
	}
}