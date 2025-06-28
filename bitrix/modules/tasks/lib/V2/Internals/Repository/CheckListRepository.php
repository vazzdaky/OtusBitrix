<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals\Repository;

use Bitrix\Tasks\CheckList\CheckListFacade;
use Bitrix\Tasks\CheckList\Task\TaskCheckListFacade;
use Bitrix\Tasks\CheckList\Template\TemplateCheckListFacade;
use Bitrix\Tasks\V2\Entity;
use Bitrix\Tasks\V2\Internals\Repository\Mapper\CheckListMapper;

class CheckListRepository implements CheckListRepositoryInterface
{
	public function __construct(
		private readonly CheckListMapper $checkListMapper,
	)
	{

	}

	public function getByEntity(int $entityId, int $userId, Entity\CheckList\Type $type): Entity\CheckList
	{
		/** @var CheckListFacade $dataClass */
		$dataClass = match ($type)
		{
			Entity\CheckList\Type::Task => TaskCheckListFacade::class,
			Entity\CheckList\Type::Template => TemplateCheckListFacade::class,
		};

		$items = $dataClass::getByEntityId($entityId);

		$items = $dataClass::fillActionsForItems($entityId, $userId, $items);

		return $this->checkListMapper->mapToEntity($items);
	}
}