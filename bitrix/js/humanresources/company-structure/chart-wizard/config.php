<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/chart-wizard.bundle.css',
	'js' => 'dist/chart-wizard.bundle.js',
	'rel' => [
		'ui.notification',
		'ui.dialogs.messagebox',
		'ui.vue3.pinia',
		'main.loader',
		'main.core.cache',
		'ui.icon-set.api.core',
		'ui.icon-set.crm',
		'ui.icon-set.api.vue',
		'ui.hint',
		'humanresources.company-structure.structure-components',
		'main.core',
		'ui.entity-selector',
		'humanresources.company-structure.api',
		'humanresources.company-structure.chart-store',
		'ui.analytics',
		'humanresources.company-structure.permission-checker',
		'humanresources.company-structure.utils',
		'ui.buttons',
		'ui.forms',
	],
	'skip_core' => false,
];