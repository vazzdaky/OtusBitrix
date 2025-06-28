<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\CheckList;

use Bitrix\Main\Error;
use Bitrix\Tasks\V2\Entity;
use Bitrix\Tasks\V2\Internals\Container;
use Bitrix\Tasks\V2\Result;
use Bitrix\Tasks\V2\Command\AbstractCommand;
use Exception;

class SaveCheckListCommand extends AbstractCommand
{
	public function __construct(
		public readonly Entity\Task $task,
		public readonly int $updatedBy,
	)
	{

	}

	protected function execute(): Result
	{
		$result = new Result();

		$checkListService = Container::getInstance()->getCheckListService();

		$handler = new SaveCheckListCommandHandler($checkListService);

		try
		{
			$entity = $handler($this);

			return $result->setObject($entity);
		}
		catch (Exception $e)
		{
			return $result->addError(Error::createFromThrowable($e));
		}
	}
}
