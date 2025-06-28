<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Entity\Task;

enum Priority: string
{
	case Low = 'low';
	case Average = 'average';
	case High = 'high';
}
