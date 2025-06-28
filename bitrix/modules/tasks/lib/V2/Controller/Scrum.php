<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Controller;

use Bitrix\Tasks\Rest\Controllers\Scrum\Epic;
use Bitrix\Tasks\V2\Controller\Response\Scrum\TaskInfoResponse;
use Bitrix\Tasks\V2\Entity;

class Scrum extends BaseController
{
	/**
	 * @ajaxAction tasks.V2.Scrum.getTaskInfo
	 */
	#[Prefilter\CloseSession]
	public function getTaskInfoAction(int $taskId): TaskInfoResponse
	{
		$item = $this->getItem($taskId);
		if (!$item)
		{
			return new TaskInfoResponse();
		}

		$epic = null;
		if ($item['epicId'] > 0)
		{
			$epic = $this->getEpic($item['epicId']);
		}

		return new TaskInfoResponse(
			storyPoints: $item['storyPoints'],
			epic: $epic ? Entity\Epic::mapFromArray($epic) : null,
		);
	}

	/**
	 * @ajaxAction tasks.V2.Scrum.updateTask
	 */
	public function updateTaskAction(int $taskId, array $fields): void
	{
		$this->forward(
			new \Bitrix\Tasks\Rest\Controllers\Scrum\Task(),
			'update',
			[
				'id' => $taskId,
				'fields' => $fields,
			],
		);
	}

	#[Prefilter\CloseSession]
	private function getItem(int $taskId): ?array
	{
		return $this->forward(
			new \Bitrix\Tasks\Rest\Controllers\Scrum\Task(),
			'get',
			[
				'id' => $taskId,
			],
		);
	}

	#[Prefilter\CloseSession]
	private function getEpic(int $id): ?array
	{
		return $this->forward(
			new Epic(),
			'get',
			[
				'id' => $id,
				'withFiles' => false,
			],
		);
	}
}
