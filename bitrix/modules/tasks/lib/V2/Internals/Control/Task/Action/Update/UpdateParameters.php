<?php

declare(strict_types=1);


namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Update;

use Bitrix\Tasks\V2\Internals\Control\Task\Action\Update\Trait\ConfigTrait;
use Bitrix\Tasks\Control\Parameter;

class UpdateParameters
{
	use ConfigTrait;

	public function __invoke(array $fields, array $fullTaskData): void
	{
		$parameter = new Parameter($this->config->getUserId(), (int)$fullTaskData['ID']);
		$parameter->update($fields);
	}
}