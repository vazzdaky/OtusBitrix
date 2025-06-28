<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

if (!defined('AIR_SITE_TEMPLATE'))
{
	return [];
}

return [
	'css' => 'dist/clock.bundle.css',
	'js' => 'dist/clock.bundle.js',
	'rel' => [
		'main.polyfill.core',
		'main.core.events',
	],
	'skip_core' => true,
];
