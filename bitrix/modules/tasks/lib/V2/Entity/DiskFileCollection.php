<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Entity;

/**
 * @method null|DiskFile findOne(array $conditions)
 * @method null|DiskFile findOneById(int $id, string $idKey = 'id')
 * @method DiskFileCollection findAll(array $conditions)
 * @method DiskFileCollection findAllByIds(array $ids, string $idKey = 'id')
 */
class DiskFileCollection extends AbstractEntityCollection
{
	protected static function getEntityClass(): string
	{
		return DiskFile::class;
	}
}