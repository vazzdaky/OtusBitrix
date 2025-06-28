<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Prepare;

use Bitrix\Tasks\V2\Internals\Control\Task\Action\Add\Trait\ConfigTrait;
use Bitrix\Tasks\Internals\Task\Mark;

class PrepareMark implements PrepareFieldInterface
{
	use ConfigTrait;

	public function __invoke(array $fields): array
	{
		$validValues = array_values(Mark::getAll());

		if (
			isset($fields['MARK'])
			&& !in_array($fields['MARK'], $validValues, true)
		)
		{
			unset($fields['MARK']);
		}

		return $fields;
	}
}