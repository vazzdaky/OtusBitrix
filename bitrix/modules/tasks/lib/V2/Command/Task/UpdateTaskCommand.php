<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\Task;

use Bitrix\Main\Error;
use Bitrix\Main\Validation\Rule\Recursive\Validatable;
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Tasks\Control\Exception\TaskNotExistsException;
use Bitrix\Tasks\Control\Exception\TaskUpdateException;
use Bitrix\Tasks\Control\Exception\WrongTaskIdException;
use Bitrix\Tasks\Internals\Log\Logger;
use Bitrix\Tasks\V2\Internals\Container;
use Bitrix\Tasks\V2\Internals\Control\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Internals\ErrorCode;
use Bitrix\Tasks\V2\Result;
use Bitrix\Tasks\V2\Command\AbstractCommand;
use Bitrix\Tasks\V2\Entity;
use Exception;

class UpdateTaskCommand extends AbstractCommand
{
	public function __construct(
		#[Validatable]
		public readonly Entity\Task $task,
		public readonly UpdateConfig $config,
		public readonly null|Entity\Task $taskBeforeUpdate = null,
	)
	{

	}

	protected function validate(): ValidationResult
	{
		return new ValidationResult();
	}

	protected function execute(): Result
	{
		$result = new Result();

		try
		{
			$consistencyResolver = Container::getInstance()->getConsistencyResolver();
			$updateService = Container::getInstance()->getUpdateService();
			$taskRepository = Container::getInstance()->getTaskRepository();

			$handler = new UpdateTaskHandler(
				$consistencyResolver,
				$updateService,
				$taskRepository,
			);

			$task = $handler($this);

			return $result->setObject($task);
		}
		catch (WrongTaskIdException)
		{
			return $result->addError(new Error('Wrong task id', ErrorCode::WRONG_TASK_ID));
		}
		catch (TaskNotExistsException)
		{
			return $result->addError(new Error('Task not exists', ErrorCode::TASK_NOT_EXISTS));
		}
		catch (Exception $e)
		{
			if (!$e instanceof TaskUpdateException)
			{
				Logger::handle($e);
			}

			return $result->addError(Error::createFromThrowable($e));
		}
	}
}
