<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
global $USER, $APPLICATION;
$userId = $USER->GetID();

if (defined('AIR_SITE_TEMPLATE') && preg_match("~^".SITE_DIR."company/personal/user/".$userId."/disk/~i", $_SERVER["REQUEST_URI"]))
{
	include($_SERVER["DOCUMENT_ROOT"]."/collaboration/.left.menu_ext.php");
	$APPLICATION->SetPageProperty("topMenuSectionDir", "/collaboration/");
}
elseif (preg_match("~^".SITE_DIR."company/personal/user/".$userId."/disk/~i", $_SERVER["REQUEST_URI"]) &&
	!preg_match("~^".SITE_DIR."company/personal/user/".$userId."/disk/(documents|boards)/~i", $_SERVER["REQUEST_URI"]))
{
	include($_SERVER["DOCUMENT_ROOT"].SITE_DIR."docs/.left.menu.php");
	include($_SERVER["DOCUMENT_ROOT"].SITE_DIR."docs/.left.menu_ext.php");
	$APPLICATION->SetPageProperty("topMenuSectionDir", "/docs/");
}
elseif (preg_match("~^".SITE_DIR."company/personal/user/".$userId."/calendar/~i", $_SERVER["REQUEST_URI"]))
{
	if (defined('AIR_SITE_TEMPLATE'))
	{
		include($_SERVER["DOCUMENT_ROOT"]."/collaboration/.left.menu_ext.php");
		$APPLICATION->SetPageProperty("topMenuSectionDir", "/collaboration/");
	}
	else
	{
		include($_SERVER["DOCUMENT_ROOT"].SITE_DIR."calendar/.left.menu_ext.php");
		$APPLICATION->SetPageProperty("topMenuSectionDir", "/calendar/");
	}
}
elseif (preg_match("~^".SITE_DIR."company/personal/(bizproc|processes)/~i", $_SERVER["REQUEST_URI"]))
{
	include($_SERVER["DOCUMENT_ROOT"].SITE_DIR."bizproc/.left.menu_ext.php");
	$APPLICATION->SetPageProperty("topMenuSectionDir", "/automation/");
}
elseif (defined('AIR_SITE_TEMPLATE') && preg_match("~^".SITE_DIR."company/personal/user/".$userId."/blog/~i", $_SERVER["REQUEST_URI"]))
{
	include($_SERVER["DOCUMENT_ROOT"]."/collaboration/.left.menu_ext.php");
	$APPLICATION->SetPageProperty("topMenuSectionDir", "/collaboration/");
}
