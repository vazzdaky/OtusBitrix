<?php

declare(strict_types=1);

namespace Bitrix\HumanResources\Result\Command\Structure;

use Bitrix\HumanResources\Item\Node;
use Bitrix\HumanResources\Result\PropertyResult;

class CreateNodeCommandResult extends PropertyResult
{
	public function __construct(
		public ?Node $node = null
	)
	{
		parent::__construct();
	}
}