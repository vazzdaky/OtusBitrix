<?php

namespace Bitrix\Crm\Integration\AI\Function\Deal\Dto;

use Bitrix\Crm\Dto\Dto;
use Bitrix\Crm\Dto\Validator\DefinedCategory;
use Bitrix\Crm\Dto\Validator\IntegerField;
use Bitrix\Crm\Dto\Validator\NotEmptyField;
use Bitrix\Crm\Dto\Validator\RequiredField;
use CCrmOwnerType;

final class CreateParameters extends Dto
{
	public int $categoryId;
	public string $title;

	protected function getValidators(array $fields): array
	{
		return [
			new RequiredField($this, 'categoryId'),
			new DefinedCategory($this, CCrmOwnerType::Deal, 'categoryId'),

			new RequiredField($this, 'title'),
			new NotEmptyField($this, 'title'),
		];
	}
}
