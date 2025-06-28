<?

use Bitrix\Main\IO\File;

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
	die();
}

$collaborationMenu = $_SERVER['DOCUMENT_ROOT'] . '/collaboration/.left.menu_ext.php';
if (defined('AIR_SITE_TEMPLATE') && !defined('SUB_MENU_EXT_CONTEXT') && File::isFileExists($collaborationMenu))
{
	include($collaborationMenu);

	return;
}

IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/docs/.left.menu_ext.php");

GLOBAL $USER;
$userId = $USER->GetID();

$diskEnabled = \Bitrix\Main\Config\Option::get('disk', 'successfully_converted', false);
$diskPath = ($diskEnabled == "Y") ? "/company/personal/user/".$userId."/disk/path/" : "/company/personal/user/".$userId."/files/lib/";


$aMenuLinks = array(
	array(
		GetMessage("MENU_DISK_USER"),
		$diskPath,
		array(),
		array("menu_item_id" => "menu_my_disk"),
		""
	),
	array(
		GetMessage("MENU_DISK_COMMON"),
		"/docs/path/",
		array(),
		array("menu_item_id" => "menu_common_disk"),
		""
	),
	array(
		GetMessage("MENU_DISK_WINDOWS_APP"),
		"/docs/windows.php",
		array(),
		array("menu_item_id" => "menu_windows_disk"),
		""
	),
	array(
		GetMessage("MENU_DISK_MACOS_APP"),
		"/docs/macos.php",
		array(),
		array("menu_item_id" => "menu_macos_disk"),
		""
	),
	/*array(
		GetMessage("MENU_DISK_MP_APPS"),
		$diskPath,
		array(),
		array("menu_item_id"=>"menu_disk_apps"),
		""
	),*/
);
if ($diskEnabled == "Y")
{
	$diskPathVolume = "/company/personal/user/".$userId."/disk/volume/";
	$aMenuLinks[] =
		array(
			GetMessage("MENU_DISK_VOLUME"),
			$diskPathVolume,
			array(),
			array("menu_item_id" => "menu_my_disk_volume"),
			""
		);
}
