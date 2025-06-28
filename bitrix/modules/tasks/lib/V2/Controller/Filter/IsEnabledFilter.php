<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Controller\Filter;

use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;
use Bitrix\Main\Event;
use Bitrix\Main\EventResult;
use Bitrix\Tasks\V2\Controller\CheckList;
use Bitrix\Tasks\V2\Controller\Group;
use Bitrix\Tasks\V2\Controller\Task;
use Bitrix\Tasks\V2\FormV2Feature;

class IsEnabledFilter extends Base
{
	private const ENABLED_ACTIONS = [
		Task::class => ['add'],
		CheckList::class => ['save'],
		Group::class => ['getUrl'],
	];

	public function onBeforeAction(Event $event): ?EventResult
	{
		/** @var Controller $controller */
		$controller = $event->getParameter('controller');
		/** @var Action $action */
		$action = $event->getParameter('action');

		if (FormV2Feature::isOn())
		{
			return null;
		}

		if (
			isset(static::ENABLED_ACTIONS[$controller::class])
			&& in_array($action->getName(), static::ENABLED_ACTIONS[$controller::class], true)
		)
		{
			return null;
		}

		$this->addError(new Error('Action is disabled'));

		return new EventResult(type: EventResult::ERROR, handler: $this);
	}
}
