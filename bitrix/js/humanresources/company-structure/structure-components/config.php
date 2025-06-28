<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/structure-components.bundle.css',
	'js' => 'dist/structure-components.bundle.js',
	'rel' => [
		'main.popup',
		'ui.icon-set.api.vue',
		'ui.hint',
		'ui.entity-selector',
		'ui.icon-set.actions',
		'humanresources.company-structure.utils',
		'main.core',
	],
	'skip_core' => false,
];