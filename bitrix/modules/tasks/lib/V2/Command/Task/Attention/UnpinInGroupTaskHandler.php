<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\Task\Attention;

use Bitrix\Tasks\Internals\UserOption\Option;
use Bitrix\Tasks\V2\Internals\Service\Task\UserOptionService;
use Bitrix\Tasks\V2\Entity;

class UnpinInGroupTaskHandler
{
	public function __construct(
		private readonly UserOptionService $userOptionService,
	)
	{

	}

	public function __invoke(UnpinInGroupTaskCommand $command): void
	{
		$entity = new Entity\Task\UserOption(
			userId: $command->userId,
			taskId: $command->taskId,
			code: Option::PINNED_IN_GROUP,
		);

		$this->userOptionService->delete($entity);
	}
}