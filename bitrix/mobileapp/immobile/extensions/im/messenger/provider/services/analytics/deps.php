<?php

return [
	'extensions' => [
		'type',
		'analytics',
		'im:messenger/const',
		'im:messenger/lib/utils',
		'im:messenger/lib/di/service-locator',
		'im:messenger/lib/params',
		'im:messenger/lib/helper',
	],
	'bundle' => [
		'./src/chat-create',
		'./src/chat-delete',
		'./src/collab-entities',
		'./src/dialog-edit',
		'./src/download-file',
		'./src/entity-manager',
		'./src/file-sending',
		'./src/helper',
		'./src/image-picker',
		'./src/message-delete',
		'./src/message-pin',
		'./src/service',
		'./src/tariff-restrictions',
		'./src/vote',
		'./src/messenger',
		'./src/message-create-menu',
		'./src/chat-open',
	],
];
