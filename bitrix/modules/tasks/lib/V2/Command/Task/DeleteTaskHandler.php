<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\Task;

use Bitrix\Tasks\V2\Internals\Consistency\ConsistencyResolverInterface;
use Bitrix\Tasks\V2\Internals\Service\Task\DeleteService;

class DeleteTaskHandler
{
	public function __construct(
		private readonly ConsistencyResolverInterface $consistencyResolver,
		private readonly DeleteService $deleteService,
	)
	{

	}

	public function __invoke(DeleteTaskCommand $command): void
	{
		$this->consistencyResolver->resolve('task.delete')->wrap(
			fn (): array => $this->deleteService->delete($command->taskId, $command->config)
		);
	}
}
