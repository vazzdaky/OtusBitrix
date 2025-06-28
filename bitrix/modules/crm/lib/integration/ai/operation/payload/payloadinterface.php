<?php

namespace Bitrix\Crm\Integration\AI\Operation\Payload;

use Bitrix\Main\Result;

interface PayloadInterface
{
	public function getPayloadCode(): string;
	public function setMarkers(array $markers): self;
	public function getResult(): Result;
}
