<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Repository;
use Bitrix\Tasks\V2\Entity;

interface UserOptionRepositoryInterface
{
	public function get(int $taskId, int $userId): Entity\Task\UserOptionCollection;

	public function isSet(int $code, int $taskId, int $userId): bool;

	public function add(Entity\Task\UserOption $userOption): void;

	public function delete(array $codes = [], int $taskId = 0, int $userId = 0): void;
}