<?php

return [
	'extensions' => [
		'type',
		'tokens',
		'feature',
		'assets/icons',
		'asset-manager',
		'utils/url',
		'utils/type',
		'utils/object',
		'utils/enums/base',
		'apptheme/extended',
		'layout/ui/safe-image',
		'layout/ui/user/enums',
		'layout/pure-component',
		'layout/ui/user/empty-avatar',
		'statemanager/redux/store',
		'statemanager/redux/connect',
		'statemanager/redux/slices/users',
		'utils/validation',
	],
	'bundle' => [
		'./src/elements/base',
		'./src/elements/native',
		'./src/elements/layout',
		'./src/enums/shape',
		'./src/enums/empty-avatar',
		'./src/enums/entity-type',
		'./src/enums/element-type',
		'./src/enums/accent-gradient',
		'./src/enums/native-placeholder-type',
		'./src/providers/redux',
		'./src/providers/selector',
	]
];
