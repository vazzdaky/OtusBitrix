<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Integration;

use Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Trait\ConfigTrait;
use Bitrix\Tasks\Integration\Bizproc\Listener;

class RunBizProc
{
	use ConfigTrait;

	public function __invoke(array $fields): void
	{
		if (!$this->config->isSkipBP())
		{
			Listener::onTaskAdd($fields['ID'], $fields);
		}
	}
}