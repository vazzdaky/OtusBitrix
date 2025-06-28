<?php

use Bitrix\Main\Localization\Loc;

IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/tasks/lang.php");

// all common phrases place here
Loc::loadMessages(__FILE__);

$moduleRoot = $_SERVER["DOCUMENT_ROOT"].BX_ROOT."/modules/tasks";

require_once($moduleRoot."/tools.php");
require_once __DIR__.'/autoload.php';

CJSCore::RegisterExt('task-popups', [
	'js' => '/bitrix/js/tasks/task-popups.js',
	'css' => '/bitrix/js/tasks/css/task-popups.css',
	'rel' => ['ui.design-tokens'],
]);

// internal events
require_once __DIR__.'/include/internal_events.php';

require_once($moduleRoot."/include/asset.php");
