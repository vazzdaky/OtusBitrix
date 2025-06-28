<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Controller\Task\Attention;

use Bitrix\Tasks\V2\Command\Task\Attention\SetAverageTaskPriorityCommand;
use Bitrix\Tasks\V2\Command\Task\Attention\SetHighTaskPriorityCommand;
use Bitrix\Tasks\V2\Controller\BaseController;
use Bitrix\Tasks\V2\Access\Task\Permission;
use Bitrix\Tasks\V2\Entity;

class Priority extends BaseController
{
	/**
	 * @ajaxAction tasks.V2.Task.Attention.Priority.high
	 */
	public function highAction(
		#[Permission\Update] Entity\Task $task
	): ?bool
	{
		$result = (new SetHighTaskPriorityCommand(
			taskId: $task->getId(),
			userId: $this->getContext()->getUserId(),
		))->run();

		if (!$result->isSuccess())
		{
			$this->addErrors($result->getErrors());

			return null;
		}

		return true;
	}

	/**
	 * @ajaxAction tasks.V2.Task.Attention.Priority.average
	 */
	public function averageAction(
		#[Permission\Update] Entity\Task $task
	): ?bool
	{
		$result = (new SetAverageTaskPriorityCommand(
			taskId: $task->getId(),
			userId: $this->getContext()->getUserId(),
		))->run();

		if (!$result->isSuccess())
		{
			$this->addErrors($result->getErrors());

			return null;
		}

		return true;
	}
}