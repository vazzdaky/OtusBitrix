<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Control\Task\Action\Update;

use Bitrix\Main\Entity\DatetimeField;
use Bitrix\Main\ObjectException;
use Bitrix\Tasks\V2\Internals\Control\Task\Action\Update\Prepare\PrepareFieldInterface;
use Bitrix\Tasks\V2\Internals\Control\Task\Action\Update\Trait\ConfigTrait;
use Bitrix\Tasks\Internals\TaskTable;

class PrepareDBFields implements PrepareFieldInterface
{
	use ConfigTrait;

	public function __invoke(array $fields, array $fullTaskData): array
	{
		$tableFields = TaskTable::getEntity()->getFields();

		foreach ($fields as $fieldName => $value)
		{
			if (!array_key_exists($fieldName, $tableFields))
			{
				unset($fields[$fieldName]);
				continue;
			}

			if (str_starts_with($fieldName, "UF_"))
			{
				unset($fields[$fieldName]);
				continue;
			}

			if (
				$tableFields[$fieldName] instanceof DatetimeField
				&& !empty($value)
			)
			{
				try
				{
					$fields[$fieldName] = \Bitrix\Main\Type\DateTime::createFromUserTime($value);
				}
				catch (\Throwable)
				{
					throw new ObjectException('Incorrect date/time');
				}
			}
		}

		return $fields;
	}
}