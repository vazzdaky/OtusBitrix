<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Command\Task;

use Bitrix\Main\Error;
use Bitrix\Tasks\Control\Exception\TaskDeleteException;
use Bitrix\Tasks\Control\Exception\TaskNotExistsException;
use Bitrix\Tasks\Control\Exception\TaskStopDeleteException;
use Bitrix\Tasks\Control\Exception\WrongTaskIdException;
use Bitrix\Tasks\Internals\Log\Logger;
use Bitrix\Tasks\V2\Internals\Container;
use Bitrix\Tasks\V2\Internals\Control\Task\Action\Delete\Config\DeleteConfig;
use Bitrix\Tasks\V2\Internals\ErrorCode;
use Bitrix\Tasks\V2\Result;
use Bitrix\Tasks\V2\Command\AbstractCommand;
use Exception;

class DeleteTaskCommand extends AbstractCommand
{
	public function __construct(
		public readonly int $taskId,
		public readonly DeleteConfig $config,
	)
	{

	}

	protected function execute(): Result
	{
		$result = new Result();
		try
		{
			$consistencyResolver = Container::getInstance()->getConsistencyResolver();
			$deleteService = Container::getInstance()->getDeleteService();

			$handler = new DeleteTaskHandler(
				$consistencyResolver,
				$deleteService,
			);

			$handler($this);

			return $result;
		}
		catch (WrongTaskIdException)
		{
			return $result->addError(new Error('Wrong task id', ErrorCode::WRONG_TASK_ID));
		}
		catch (TaskNotExistsException)
		{
			return $result->addError(new Error('Task not exists', ErrorCode::TASK_NOT_EXISTS));
		}
		catch (TaskStopDeleteException)
		{
			return $result->addError(new Error('Deletion stopped', ErrorCode::TASK_STOP_DELETE));
		}
		catch (Exception $e)
		{
			if (!$e instanceof TaskDeleteException)
			{
				Logger::handle($e);
			}

			return $result->addError(Error::createFromThrowable($e));
		}
	}
}
