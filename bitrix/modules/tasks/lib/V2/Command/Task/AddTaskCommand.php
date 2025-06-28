<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\Task;

use Bitrix\Main\Error;
use Bitrix\Main\Validation\Rule\Recursive\Validatable;
use Bitrix\Tasks\Control\Exception\TaskAddException;
use Bitrix\Tasks\Internals\Log\Logger;
use Bitrix\Tasks\V2\Internals\Container;
use Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Config\AddConfig;
use Bitrix\Tasks\V2\Result;
use Bitrix\Tasks\V2\Command\AbstractCommand;
use Bitrix\Tasks\V2\Entity;
use Exception;

class AddTaskCommand extends AbstractCommand
{
	public function __construct(
		#[Validatable]
		public readonly Entity\Task $task,
		public readonly AddConfig $config,
	)
	{

	}

	protected function execute(): Result
	{
		$result = new Result();

		try
		{
			$consistencyResolver = Container::getInstance()->getConsistencyResolver();
			$addService = Container::getInstance()->getAddService();

			$handler = new AddTaskHandler(
				$consistencyResolver,
				$addService,
			);

			$task = $handler($this);

			return $result->setObject($task);
		}
		catch (Exception $e)
		{
			if (!$e instanceof TaskAddException)
			{
				Logger::handle($e);
			}

			return $result->addError(Error::createFromThrowable($e));
		}
	}
}
