<?php

declare(strict_types=1);

namespace Bitrix\HumanResources\Builder\Structure\Filter\Column;

use Bitrix\HumanResources\Type\IntegerCollection;

final class IdFilter extends BaseColumnFilter
{
	public function __construct(
		public ?IntegerCollection $ids = null,
	)
	{}

	protected function getFieldName(): string
	{
		return 'ID';
	}

	protected function getItems(): array
	{
		return $this->ids->getItems();
	}

	public static function fromId(int $id): self
	{
		return new self(
			new IntegerCollection($id)
		);
	}

	/**
	 * @param int[] $ids
	 *
	 * @return self
	 */
	public static function fromIds(array $ids): self
	{
		if (empty($ids))
		{
			return new self();
		}

		return new self(new IntegerCollection(...$ids));
	}
}