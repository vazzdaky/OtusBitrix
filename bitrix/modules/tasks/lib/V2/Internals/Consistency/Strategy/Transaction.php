<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Consistency\Strategy;

use Bitrix\Main\Application;
use Throwable;

class Transaction implements ConsistencyStrategyInterface
{

	public function execute(callable $callable, array $parameters = []): mixed
	{
		$connection = Application::getConnection();

		$connection->startTransaction();

		try
		{
			$result = $callable();

			$connection->commitTransaction();

			return $result;
		}
		catch (Throwable $t)
		{
			$connection->rollbackTransaction();

			throw $t;
		}
	}
}