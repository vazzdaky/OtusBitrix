<?php

namespace Bitrix\Tasks\V2\Entity\User;

enum Gender: string
{
	case Male = 'M';
	case Female = 'F';
	case None = 'N';
}
