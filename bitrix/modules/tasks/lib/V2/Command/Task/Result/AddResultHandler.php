<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\Task\Result;

use Bitrix\Tasks\V2\Entity;
use Bitrix\Tasks\V2\Internals\Consistency\ConsistencyResolverInterface;
use Bitrix\Tasks\V2\Internals\Service\Task\ResultService;

class AddResultHandler
{
	public function __construct(
		private readonly ResultService $resultService,
		private readonly ConsistencyResolverInterface $consistencyResolver,
	)
	{
	}

	public function __invoke(AddResultCommand $command): ?Entity\Result
	{
		return $this->consistencyResolver->resolve('task.result.add')->wrap(
			fn (): ?Entity\Result => $this->resultService->create($command->result, $command->userId)
		);
	}
}
