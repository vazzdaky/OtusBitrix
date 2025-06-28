<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Integration;

use Bitrix\Im\V2\Service\Locator;
use Bitrix\Main\Application;
use Bitrix\Main\Loader;
use Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Trait\ConfigTrait;
use Bitrix\Tasks\Internals\Registry\TaskRegistry;

class RunMessenger
{
	use ConfigTrait;

	public function __invoke(array $fields): void
	{
		if (!isset($fields['IM_CHAT_ID']))
		{
			return;
		}

		if ($fields['IM_CHAT_ID'] <= 0)
		{
			return;
		}

		if (!Loader::includeModule('im'))
		{
			return;
		}

		$chatId = $fields['IM_CHAT_ID'];
		$messageId = isset($fields['IM_MESSAGE_ID']) && $fields['IM_MESSAGE_ID'] > 0 ? $fields['IM_MESSAGE_ID'] : 0;
		$taskId = $fields['ID'];

		Application::getInstance()->addBackgroundJob(
			function() use ($chatId, $messageId, $taskId) {
				$task = TaskRegistry::getInstance()->drop($taskId)->getObject($taskId, true);
				if ($task === null)
				{
					return;
				}

				Locator::getMessenger()->registerTask($chatId, $messageId, $task);
			}
		);
	}
}