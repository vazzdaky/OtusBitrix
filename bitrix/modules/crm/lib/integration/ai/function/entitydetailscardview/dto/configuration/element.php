<?php

namespace Bitrix\Crm\Integration\AI\Function\EntityDetailsCardView\Dto\Configuration;

use Bitrix\Crm\Dto\Caster;
use Bitrix\Crm\Dto\Dto;
use Bitrix\Crm\Dto\Validator\NotEmptyField;
use Bitrix\Crm\Dto\Validator\RequiredField;

final class Element extends Dto
{
	public string $name;
	public bool $isShowAlways = false;
	public array $options = [];

	public function getCastByPropertyName(string $propertyName): ?Caster
	{
		return match ($propertyName) {
			'options' => new Caster\RawArrayCaster(),
			default => null,
		};
	}

	protected function getValidators(array $fields): array
	{
		return [
			new RequiredField($this, 'name'),
			new NotEmptyField($this, 'name'),
		];
	}
}
