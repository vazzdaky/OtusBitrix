<?php

/**
 * Bitrix Framework
 * @package bitrix
 * @subpackage main
 * @copyright 2001-2024 Bitrix
 */

use Bitrix\Main;
use Bitrix\Main\Session\Legacy\HealerEarlySessionStart;
use Bitrix\Main\DI\ServiceLocator;

require_once __DIR__ . "/start.php";

$application = Main\HttpApplication::getInstance();
$application->initializeExtendedKernel([
	"get" => $_GET,
	"post" => $_POST,
	"files" => $_FILES,
	"cookie" => $_COOKIE,
	"server" => $_SERVER,
	"env" => $_ENV
]);

if (class_exists('\Dev\Main\Migrator\ModuleUpdater'))
{
	\Dev\Main\Migrator\ModuleUpdater::checkUpdates('main', __DIR__);
}

if (!Main\ModuleManager::isModuleInstalled('bitrix24'))
{
	// wwall rules
	(new Main\Security\W\WWall)->handle();

	$application->addBackgroundJob([
		Main\Security\W\WWall::class, 'refreshRules'
	]);

	// vendor security notifications
	$application->addBackgroundJob([
		Main\Security\Notifications\VendorNotifier::class, 'refreshNotifications'
	]);
}

if (defined('SITE_ID'))
{
	define('LANG', SITE_ID);
}

$context = $application->getContext();
$context->initializeCulture(defined('LANG') ? LANG : null, defined('LANGUAGE_ID') ? LANGUAGE_ID : null);

// needs to be after culture initialization
$application->start();

// Register main's services
ServiceLocator::getInstance()->registerByModuleSettings('main');

// constants for compatibility
$culture = $context->getCulture();
define('SITE_CHARSET', $culture->getCharset());
define('FORMAT_DATE', $culture->getFormatDate());
define('FORMAT_DATETIME', $culture->getFormatDatetime());
define('LANG_CHARSET', SITE_CHARSET);

$site = $context->getSiteObject();
if (!defined('LANG'))
{
	define('LANG', ($site ? $site->getLid() : $context->getLanguage()));
}
define('SITE_DIR', ($site ? $site->getDir() : ''));
if (!defined('SITE_SERVER_NAME'))
{
	define('SITE_SERVER_NAME', ($site ? $site->getServerName() : ''));
}
define('LANG_DIR', SITE_DIR);

if (!defined('LANGUAGE_ID'))
{
	define('LANGUAGE_ID', $context->getLanguage());
}
define('LANG_ADMIN_LID', LANGUAGE_ID);

if (!defined('SITE_ID'))
{
	define('SITE_ID', LANG);
}

/** @global $lang */
$lang = $context->getLanguage();

//define global application object
$GLOBALS["APPLICATION"] = new CMain;

if (!defined("POST_FORM_ACTION_URI"))
{
	define("POST_FORM_ACTION_URI", htmlspecialcharsbx(GetRequestUri()));
}

$GLOBALS["MESS"] = [];
$GLOBALS["ALL_LANG_FILES"] = [];
IncludeModuleLangFile(__DIR__."/tools.php");
IncludeModuleLangFile(__FILE__);

error_reporting(COption::GetOptionInt("main", "error_reporting", E_COMPILE_ERROR | E_ERROR | E_CORE_ERROR | E_PARSE) & ~E_DEPRECATED & ~E_WARNING & ~E_NOTICE);

if (!defined("BX_COMP_MANAGED_CACHE") && COption::GetOptionString("main", "component_managed_cache_on", "Y") != "N")
{
	define("BX_COMP_MANAGED_CACHE", true);
}

// global functions
require_once __DIR__ . "/filter_tools.php";

/*ZDUyZmZMjkzMzdhMzUzMmY1YTE1MzFmODE0ZDAxNjE1NDJmMmQ=*/$GLOBALS['_____1804838007']= array(base64_decode('R2V0TW'.'9kdWxlRX'.'Zlb'.'nRz'),base64_decode('R'.'XhlY3V0ZU1v'.'ZH'.'VsZUV2Z'.'W50RXg='));$GLOBALS['____2105479054']= array(base64_decode(''.'Z'.'GVmaW5l'),base64_decode('Ym'.'FzZT'.'Y'.'0X2R'.'lY29k'.'ZQ=='),base64_decode('dW5'.'z'.'ZXJpYWx'.'pemU'.'='),base64_decode(''.'aX'.'Nf'.'YX'.'JyYX'.'k='),base64_decode('aW5fYXJyY'.'X'.'k'.'='),base64_decode('c'.'2V'.'yaWFsa'.'Xpl'),base64_decode('Ym'.'Fz'.'ZTY0X2Vu'.'Y2'.'9kZQ=='),base64_decode('b'.'W'.'t0'.'aW1l'),base64_decode('ZG'.'F0ZQ=='),base64_decode('Z'.'GF0'.'Z'.'Q=='),base64_decode(''.'c3RybGVu'),base64_decode('b'.'Wt0'.'aW1'.'l'),base64_decode(''.'Z'.'GF0'.'ZQ=='),base64_decode('ZG'.'F0ZQ=='),base64_decode('bWV'.'0'.'aG9kX2V4aXN'.'0cw='.'='),base64_decode('Y2FsbF91c'.'2VyX2Z1bmN'.'fYXJ'.'yYX'.'k='),base64_decode('c3Ry'.'bGVu'),base64_decode('c2V'.'ya'.'WFs'.'a'.'Xpl'),base64_decode('YmFz'.'ZTY0X2VuY29'.'kZQ=='),base64_decode('c3R'.'ybG'.'Vu'),base64_decode('a'.'XNfY'.'XJyYXk='),base64_decode('c2Vya'.'WFsaXpl'),base64_decode('YmFz'.'Z'.'TY0'.'X2VuY'.'29'.'kZQ=='),base64_decode('c2V'.'yaWFsaXpl'),base64_decode('YmFzZTY0X2VuY29kZQ=='),base64_decode('aX'.'NfY'.'XJyYXk='),base64_decode(''.'aXNfYXJyYXk'.'='),base64_decode('aW5fYX'.'JyYXk'.'='),base64_decode('aW5fY'.'X'.'JyYXk'.'='),base64_decode('b'.'W'.'t'.'0aW1l'),base64_decode(''.'ZGF0ZQ=='),base64_decode('ZGF0ZQ='.'='),base64_decode('ZGF'.'0'.'ZQ='.'='),base64_decode(''.'bWt0aW1l'),base64_decode('ZGF0ZQ='.'='),base64_decode('ZG'.'F0ZQ'.'=='),base64_decode(''.'a'.'W'.'5fY'.'X'.'J'.'y'.'YXk='),base64_decode('c'.'2VyaWFsa'.'Xpl'),base64_decode('Ym'.'FzZTY0X'.'2'.'Vu'.'Y'.'29kZQ='.'='),base64_decode('aW50dmFs'),base64_decode('dGlt'.'ZQ=='),base64_decode('Z'.'mlsZV9l'.'eG'.'lz'.'dHM='),base64_decode('c3RyX3JlcGxhY2U'.'='),base64_decode('Y2xh'.'c3Nf'.'ZXhpc3R'.'z'),base64_decode(''.'ZG'.'VmaW5l'));if(!function_exists(__NAMESPACE__.'\\___1617378589')){function ___1617378589($_1563902615){static $_133727376= false; if($_133727376 == false) $_133727376=array('SU5U'.'UkFORV'.'R'.'fRURJV'.'ElP'.'Tg==','WQ'.'==','bWFpb'.'g==','fmNw'.'Zl9tY'.'XB'.'fdmFsdWU=','','','YWxsb3dl'.'ZF9jbGF'.'zc2'.'V'.'z','Z'.'Q==','Zg==','ZQ==','Rg='.'=','W'.'A==','Zg==','bWFpbg'.'==','fmNwZl9'.'tYXBf'.'dmFsd'.'WU=',''.'UG9ydGFs','Rg'.'==','ZQ==','Z'.'Q==','WA==','Rg==',''.'RA==',''.'RA'.'==',''.'b'.'Q==',''.'ZA='.'=','WQ'.'==','Zg'.'==','Zg==','Zg==','Zg==','UG9ydG'.'Fs',''.'R'.'g==',''.'ZQ==','ZQ='.'=','WA='.'=','Rg==','R'.'A==','RA='.'=','b'.'Q==',''.'ZA==','WQ==','b'.'WF'.'p'.'bg==','T2'.'4=','U2V0dGlu'.'Z3'.'NDaGFuZ2'.'U=',''.'Zg'.'==','Zg='.'=',''.'Z'.'g'.'==','Zg==','bWF'.'pb'.'g==',''.'fmNw'.'Zl9t'.'YXBfdm'.'Fsd'.'WU=','ZQ==',''.'ZQ==',''.'RA==','ZQ==','ZQ==',''.'Z'.'g==','Zg==','Z'.'g==','ZQ==','bWF'.'p'.'bg==','fmN'.'wZl'.'9tYX'.'BfdmF'.'sdWU=','ZQ==','Zg==','Zg==','Zg='.'=','Z'.'g==','bWF'.'pbg'.'==','fmNwZl9tYXBfd'.'mF'.'sdW'.'U=','ZQ==','Zg==',''.'UG9ydGF'.'s','UG9yd'.'G'.'Fs','ZQ==','Z'.'Q'.'==','UG9'.'ydGFs','Rg==','WA==',''.'Rg==','RA==','ZQ'.'==','Z'.'Q==','RA'.'==','bQ==','ZA'.'==','W'.'Q==',''.'ZQ==','W'.'A'.'==','ZQ='.'=','Rg='.'=','ZQ='.'=',''.'RA==','Zg==',''.'ZQ==','RA='.'=','ZQ==','b'.'Q==','ZA==','W'.'Q'.'==','Zg==','Zg==','Zg==','Zg==','Zg==','Zg==','Zg==',''.'Zg==','bWFpbg==',''.'fmNwZl9tYXBfdmFsdWU=','ZQ==','Z'.'Q==','UG9ydGF'.'s','Rg==',''.'W'.'A='.'=','VFlQRQ==','REF'.'URQ'.'==',''.'RkVBVF'.'VSRVM=','RV'.'hQS'.'V'.'JFRA='.'=','VFl'.'QRQ='.'=','RA==','V'.'FJZX0'.'RBW'.'VNf'.'Q09VTlQ=','RE'.'FUR'.'Q==','VFJZX0'.'R'.'BWV'.'NfQ09V'.'T'.'lQ=','RVhQSV'.'JFR'.'A='.'=','R'.'kVBVFV'.'SRV'.'M'.'=','Z'.'g==','Zg==','RE9D'.'VU'.'1FT'.'lRfUk'.'9PVA'.'='.'=',''.'L2'.'JpdHJpe'.'C'.'9'.'tb'.'2R1'.'bGVzLw'.'==','L2lu'.'c3Rh'.'bG'.'w'.'v'.'aW5kZX'.'gu'.'cG'.'hw','Lg==','Xw==',''.'c2'.'Vh'.'cmN'.'o',''.'Tg==','','','QUNUSVZF','WQ'.'='.'=',''.'c2'.'9j'.'aWF'.'sbmV'.'0d29yaw==',''.'Y'.'Wxs'.'b3dfZnJpZWxkcw'.'==','WQ='.'=','SUQ=','c'.'29jaW'.'FsbmV'.'0'.'d29y'.'aw='.'=','Y'.'Wx'.'sb3dfZ'.'nJpZ'.'Wxkcw==',''.'S'.'U'.'Q=','c29ja'.'WFsbmV0d29yaw==','YW'.'xsb3'.'dfZnJ'.'pZW'.'xkcw==',''.'Tg='.'=','','','QUNUSVZF','WQ==','c29j'.'aWF'.'sbmV'.'0d2'.'9ya'.'w==','YWxsb3dfbWl'.'jcm'.'9i'.'bG9'.'nX3V'.'zZ'.'X'.'I=',''.'WQ='.'=','SUQ=',''.'c2'.'9jaW'.'Fs'.'b'.'mV0d29yaw==','YWxsb3dfbWljcm9ibG9n'.'X3V'.'zZX'.'I=','SUQ=',''.'c29jaWF'.'sbm'.'V0d29yaw==','YW'.'xsb'.'3dfbWlj'.'cm9ibG9n'.'X3VzZXI'.'=','c'.'29jaW'.'F'.'sbmV0d29yaw==','Y'.'Wxsb3df'.'bWl'.'jcm9ibG9'.'nX'.'2dyb3Vw','W'.'Q==','SUQ=','c'.'29j'.'aWFsbmV0'.'d'.'29y'.'aw='.'=','YWxsb3'.'dfbWl'.'jcm9ib'.'G9nX2dy'.'b'.'3Vw','SUQ=','c29jaWFs'.'bm'.'V'.'0d29yaw==','Y'.'Wxsb3dfbWljcm9ibG9nX2'.'dyb3Vw','T'.'g==','','','QUNUSVZF',''.'WQ='.'=','c29j'.'aWFsb'.'mV0d'.'29yaw==',''.'YWxs'.'b3dfZ'.'m'.'lsZXNfd'.'XNl'.'c'.'g==','WQ'.'==','SUQ=','c29'.'j'.'aW'.'F'.'sbmV0'.'d29yaw==','YWxsb3dfZmls'.'ZXNfdXNlcg==','SU'.'Q=','c29jaWFs'.'b'.'mV'.'0d'.'29yaw'.'==','YW'.'xsb3dfZmlsZXNfdXNl'.'c'.'g='.'=','T'.'g==','','','QUN'.'USV'.'Z'.'F',''.'WQ==',''.'c2'.'9jaWFs'.'bmV0'.'d2'.'9ya'.'w==','YWx'.'s'.'b3dfYmxvZ1'.'91c2Vy','W'.'Q'.'==','SUQ=','c29ja'.'W'.'FsbmV0d'.'29'.'yaw==','YWxsb3'.'dfYmxv'.'Z'.'191c2'.'Vy','SUQ=','c'.'2'.'9j'.'aWFsbmV'.'0d29'.'yaw='.'=','Y'.'Wxsb3dfY'.'mxvZ191c2Vy','Tg==','','','QUNUSVZF',''.'WQ==',''.'c29jaWF'.'sbmV'.'0d29yaw==','YWxsb3dfcGhvdG'.'9fdX'.'Nlcg==','WQ'.'==','SU'.'Q=','c29'.'ja'.'WFsbm'.'V0'.'d29yaw'.'==','YWxsb3dfcGhvdG9f'.'dXNlcg==','S'.'UQ'.'=','c29jaWFsbmV0d29yaw='.'=','YWxsb3df'.'cGhvd'.'G9'.'fdXNl'.'cg==','Tg==','','','QU'.'NUSVZF','WQ==',''.'c2'.'9jaWFsbmV0'.'d29yaw='.'=',''.'Y'.'Wxsb3'.'d'.'f'.'Zm9yd'.'W1fd'.'XNlcg==',''.'W'.'Q==','SU'.'Q=',''.'c29jaW'.'FsbmV0d29yaw==','YW'.'xsb3dfZ'.'m9ydW'.'1f'.'dXNlcg==','SU'.'Q=',''.'c'.'29jaW'.'F'.'sbmV0d29y'.'aw'.'==',''.'Y'.'W'.'xsb'.'3d'.'fZ'.'m9y'.'dW'.'1fdXNlcg'.'==',''.'Tg='.'=','','','QU'.'N'.'U'.'SVZF','WQ==','c29jaWFsbmV0d29'.'yaw==','YWxsb3dfdG'.'Fza'.'3N'.'fdXNlc'.'g'.'==','WQ==','SUQ=','c29j'.'a'.'W'.'FsbmV0d29ya'.'w==','Y'.'W'.'xsb3dfdGFza3'.'NfdXN'.'lcg==','SUQ=','c29'.'j'.'aW'.'Fsbm'.'V0d'.'29ya'.'w='.'=','Y'.'Wxsb3'.'d'.'f'.'d'.'GFza'.'3NfdXNlc'.'g==','c29jaW'.'Fsbm'.'V0d'.'2'.'9yaw==','Y'.'Wxsb3df'.'dGF'.'za'.'3N'.'f'.'Z3JvdXA=','WQ==','S'.'UQ=','c2'.'9ja'.'WFsbmV0d'.'29yaw'.'==',''.'Y'.'Wxsb3dfdG'.'Fza3NfZ'.'3Jv'.'dX'.'A=','SUQ=','c29jaWFsbmV0d29'.'y'.'aw==','YWxsb'.'3df'.'dGFza3N'.'fZ3JvdX'.'A'.'=','dGFza3M=',''.'Tg='.'=','','',''.'Q'.'UNU'.'SVZF','WQ==',''.'c29jaWFsbm'.'V'.'0'.'d29yaw==',''.'Y'.'Wxsb3'.'df'.'Y'.'2FsZ'.'W5kYXJfdXNl'.'cg'.'==','WQ'.'='.'=',''.'SUQ=','c'.'29jaWFsbmV0d29'.'y'.'a'.'w='.'=','YW'.'xs'.'b3dfY'.'2FsZW5'.'kYXJfd'.'XNlcg==','S'.'UQ=',''.'c'.'2'.'9jaWFs'.'b'.'m'.'V0'.'d29yaw==','YW'.'x'.'sb'.'3dfY2FsZW'.'5kYXJ'.'fd'.'XN'.'lcg==','c29jaW'.'F'.'sbmV'.'0d29'.'yaw==','YW'.'xs'.'b'.'3'.'df'.'Y2F'.'s'.'ZW'.'5kYXJfZ3'.'J'.'vdXA=','WQ==','SU'.'Q=','c29'.'jaWFsbmV0'.'d29'.'yaw='.'=','YWxsb3df'.'Y'.'2Fs'.'ZW5k'.'YXJ'.'fZ3J'.'vdXA=',''.'S'.'U'.'Q=','c29jaWFsbmV0'.'d29yaw==','YWxsb3d'.'fY2'.'FsZW'.'5k'.'YX'.'JfZ'.'3JvdXA=','Q'.'U'.'NUSVZF','WQ'.'='.'=','Tg='.'=','ZX'.'h0cm'.'FuZXQ=','aWJsb2Nr','T'.'25BZnRlck'.'lC'.'bG9ja0'.'VsZW1'.'lbnR'.'VcGRhdGU=','aW50c'.'mFuZXQ'.'=','Q0ludH'.'J'.'hb'.'mV0RXZlbnR'.'I'.'YW5kbGVycw==','U1'.'BSZW'.'dpc3'.'Rlcl'.'VwZG'.'F0ZWRJdG'.'Vt','Q0'.'lud'.'HJhbmV0'.'U'.'2'.'hhcm'.'Vwb2'.'l'.'udDo6QWdl'.'bnRMa'.'XN0cy'.'gpOw'.'==','aW5'.'0cm'.'Fu'.'Z'.'XQ=','Tg==','Q0lu'.'dH'.'Jh'.'b'.'mV0'.'U2hhcm'.'V'.'wb2ludD'.'o6Q'.'Wdl'.'bnRRdWV1ZSgpOw==','aW50c'.'m'.'FuZ'.'XQ=','Tg==','Q0'.'l'.'ud'.'HJhbmV0U2h'.'hc'.'mV'.'w'.'b2ludDo6'.'QWd'.'lbnRVc'.'GRhdGUoKT'.'s=','aW50cmF'.'uZXQ=','T'.'g==',''.'aWJsb2Nr',''.'T25'.'BZ'.'n'.'R'.'lcklCbG9'.'ja0VsZW'.'1lbnRBZG'.'Q=',''.'a'.'W50'.'cmFuZX'.'Q=','Q0lud'.'HJh'.'bm'.'V0'.'R'.'XZlbnR'.'IYW5k'.'bG'.'Vy'.'c'.'w==','U1'.'BSZWdpc3Rlc'.'lV'.'wZ'.'GF0ZWRJ'.'dGVt','aWJsb2Nr',''.'T'.'25BZnRlckl'.'Cb'.'G9ja0VsZW1lbn'.'R'.'VcGRhdG'.'U=','aW'.'50cmFuZX'.'Q=','Q0ludH'.'JhbmV0RXZ'.'lbnRIYW5k'.'bGVycw='.'=','U1BSZW'.'dpc3R'.'lclVwZGF0'.'ZWRJ'.'dGV'.'t','Q0'.'ludHJhbmV'.'0'.'U'.'2hhc'.'mVwb2lu'.'dDo6Q'.'Wdl'.'bnR'.'MaXN0c'.'ygpOw==','aW50cmFuZXQ=','Q0ludHJhbmV0U2hhc'.'m'.'Vwb2l'.'udDo6'.'QW'.'dlbnRRdWV'.'1ZS'.'gpOw='.'=','aW'.'50cmFuZXQ=',''.'Q0ludHJhbmV0U2hhcmVwb2'.'ludDo6QWdlbnRVcGRhdG'.'UoKTs=','aW'.'50cmFu'.'ZX'.'Q=',''.'Y3Jt','b'.'WFpbg'.'==','T'.'25CZWZvcmVQcm9'.'sb2c=','b'.'W'.'Fpbg='.'=','Q1dpemFyZFNvb'.'FBh'.'b'.'mVsS'.'W50cm'.'Fu'.'ZXQ'.'=','U2hvd1'.'BhbmV'.'s',''.'L2'.'1vZHV'.'s'.'Z'.'XM'.'vaW50c'.'mFuZXQvcGFuZWxfYnV0d'.'G9uLnBocA==','RU5DT0RF',''.'WQ'.'==');return base64_decode($_133727376[$_1563902615]);}};$GLOBALS['____2105479054'][0](___1617378589(0), ___1617378589(1));class CBXFeatures{ private static $_819897216= 30; private static $_1288079721= array( "Portal" => array( "CompanyCalendar", "CompanyPhoto", "CompanyVideo", "CompanyCareer", "StaffChanges", "StaffAbsence", "CommonDocuments", "MeetingRoomBookingSystem", "Wiki", "Learning", "Vote", "WebLink", "Subscribe", "Friends", "PersonalFiles", "PersonalBlog", "PersonalPhoto", "PersonalForum", "Blog", "Forum", "Gallery", "Board", "MicroBlog", "WebMessenger",), "Communications" => array( "Tasks", "Calendar", "Workgroups", "Jabber", "VideoConference", "Extranet", "SMTP", "Requests", "DAV", "intranet_sharepoint", "timeman", "Idea", "Meeting", "EventList", "Salary", "XDImport",), "Enterprise" => array( "BizProc", "Lists", "Support", "Analytics", "crm", "Controller", "LdapUnlimitedUsers",), "Holding" => array( "Cluster", "MultiSites",),); private static $_562575185= null; private static $_1640208080= null; private static function __1353429654(){ if(self::$_562575185 === null){ self::$_562575185= array(); foreach(self::$_1288079721 as $_1009512452 => $_451446685){ foreach($_451446685 as $_1080701850) self::$_562575185[$_1080701850]= $_1009512452;}} if(self::$_1640208080 === null){ self::$_1640208080= array(); $_1834466291= COption::GetOptionString(___1617378589(2), ___1617378589(3), ___1617378589(4)); if($_1834466291 != ___1617378589(5)){ $_1834466291= $GLOBALS['____2105479054'][1]($_1834466291); $_1834466291= $GLOBALS['____2105479054'][2]($_1834466291,[___1617378589(6) => false]); if($GLOBALS['____2105479054'][3]($_1834466291)){ self::$_1640208080= $_1834466291;}} if(empty(self::$_1640208080)){ self::$_1640208080= array(___1617378589(7) => array(), ___1617378589(8) => array());}}} public static function InitiateEditionsSettings($_1656553176){ self::__1353429654(); $_793198460= array(); foreach(self::$_1288079721 as $_1009512452 => $_451446685){ $_122598258= $GLOBALS['____2105479054'][4]($_1009512452, $_1656553176); self::$_1640208080[___1617378589(9)][$_1009512452]=($_122598258? array(___1617378589(10)): array(___1617378589(11))); foreach($_451446685 as $_1080701850){ self::$_1640208080[___1617378589(12)][$_1080701850]= $_122598258; if(!$_122598258) $_793198460[]= array($_1080701850, false);}} $_156370541= $GLOBALS['____2105479054'][5](self::$_1640208080); $_156370541= $GLOBALS['____2105479054'][6]($_156370541); COption::SetOptionString(___1617378589(13), ___1617378589(14), $_156370541); foreach($_793198460 as $_582713932) self::__433332123($_582713932[min(56,0,18.666666666667)], $_582713932[round(0+0.5+0.5)]);} public static function IsFeatureEnabled($_1080701850){ if($_1080701850 == '') return true; self::__1353429654(); if(!isset(self::$_562575185[$_1080701850])) return true; if(self::$_562575185[$_1080701850] == ___1617378589(15)) $_406632538= array(___1617378589(16)); elseif(isset(self::$_1640208080[___1617378589(17)][self::$_562575185[$_1080701850]])) $_406632538= self::$_1640208080[___1617378589(18)][self::$_562575185[$_1080701850]]; else $_406632538= array(___1617378589(19)); if($_406632538[(235*2-470)] != ___1617378589(20) && $_406632538[(127*2-254)] != ___1617378589(21)){ return false;} elseif($_406632538[(984-2*492)] == ___1617378589(22)){ if($_406632538[round(0+0.5+0.5)]< $GLOBALS['____2105479054'][7]((1168/2-584),(155*2-310),(784-2*392), Date(___1617378589(23)), $GLOBALS['____2105479054'][8](___1617378589(24))- self::$_819897216, $GLOBALS['____2105479054'][9](___1617378589(25)))){ if(!isset($_406632538[round(0+1+1)]) ||!$_406632538[round(0+1+1)]) self::__852150112(self::$_562575185[$_1080701850]); return false;}} return!isset(self::$_1640208080[___1617378589(26)][$_1080701850]) || self::$_1640208080[___1617378589(27)][$_1080701850];} public static function IsFeatureInstalled($_1080701850){ if($GLOBALS['____2105479054'][10]($_1080701850) <= 0) return true; self::__1353429654(); return(isset(self::$_1640208080[___1617378589(28)][$_1080701850]) && self::$_1640208080[___1617378589(29)][$_1080701850]);} public static function IsFeatureEditable($_1080701850){ if($_1080701850 == '') return true; self::__1353429654(); if(!isset(self::$_562575185[$_1080701850])) return true; if(self::$_562575185[$_1080701850] == ___1617378589(30)) $_406632538= array(___1617378589(31)); elseif(isset(self::$_1640208080[___1617378589(32)][self::$_562575185[$_1080701850]])) $_406632538= self::$_1640208080[___1617378589(33)][self::$_562575185[$_1080701850]]; else $_406632538= array(___1617378589(34)); if($_406632538[(1240/2-620)] != ___1617378589(35) && $_406632538[(970-2*485)] != ___1617378589(36)){ return false;} elseif($_406632538[(1348/2-674)] == ___1617378589(37)){ if($_406632538[round(0+0.5+0.5)]< $GLOBALS['____2105479054'][11]((1408/2-704),(181*2-362), min(206,0,68.666666666667), Date(___1617378589(38)), $GLOBALS['____2105479054'][12](___1617378589(39))- self::$_819897216, $GLOBALS['____2105479054'][13](___1617378589(40)))){ if(!isset($_406632538[round(0+0.4+0.4+0.4+0.4+0.4)]) ||!$_406632538[round(0+0.4+0.4+0.4+0.4+0.4)]) self::__852150112(self::$_562575185[$_1080701850]); return false;}} return true;} private static function __433332123($_1080701850, $_553148609){ if($GLOBALS['____2105479054'][14]("CBXFeatures", "On".$_1080701850."SettingsChange")) $GLOBALS['____2105479054'][15](array("CBXFeatures", "On".$_1080701850."SettingsChange"), array($_1080701850, $_553148609)); $_1134840901= $GLOBALS['_____1804838007'][0](___1617378589(41), ___1617378589(42).$_1080701850.___1617378589(43)); while($_2001178153= $_1134840901->Fetch()) $GLOBALS['_____1804838007'][1]($_2001178153, array($_1080701850, $_553148609));} public static function SetFeatureEnabled($_1080701850, $_553148609= true, $_60899811= true){ if($GLOBALS['____2105479054'][16]($_1080701850) <= 0) return; if(!self::IsFeatureEditable($_1080701850)) $_553148609= false; $_553148609= (bool)$_553148609; self::__1353429654(); $_853017188=(!isset(self::$_1640208080[___1617378589(44)][$_1080701850]) && $_553148609 || isset(self::$_1640208080[___1617378589(45)][$_1080701850]) && $_553148609 != self::$_1640208080[___1617378589(46)][$_1080701850]); self::$_1640208080[___1617378589(47)][$_1080701850]= $_553148609; $_156370541= $GLOBALS['____2105479054'][17](self::$_1640208080); $_156370541= $GLOBALS['____2105479054'][18]($_156370541); COption::SetOptionString(___1617378589(48), ___1617378589(49), $_156370541); if($_853017188 && $_60899811) self::__433332123($_1080701850, $_553148609);} private static function __852150112($_1009512452){ if($GLOBALS['____2105479054'][19]($_1009512452) <= 0 || $_1009512452 == "Portal") return; self::__1353429654(); if(!isset(self::$_1640208080[___1617378589(50)][$_1009512452]) || self::$_1640208080[___1617378589(51)][$_1009512452][min(70,0,23.333333333333)] != ___1617378589(52)) return; if(isset(self::$_1640208080[___1617378589(53)][$_1009512452][round(0+0.4+0.4+0.4+0.4+0.4)]) && self::$_1640208080[___1617378589(54)][$_1009512452][round(0+1+1)]) return; $_793198460= array(); if(isset(self::$_1288079721[$_1009512452]) && $GLOBALS['____2105479054'][20](self::$_1288079721[$_1009512452])){ foreach(self::$_1288079721[$_1009512452] as $_1080701850){ if(isset(self::$_1640208080[___1617378589(55)][$_1080701850]) && self::$_1640208080[___1617378589(56)][$_1080701850]){ self::$_1640208080[___1617378589(57)][$_1080701850]= false; $_793198460[]= array($_1080701850, false);}} self::$_1640208080[___1617378589(58)][$_1009512452][round(0+2)]= true;} $_156370541= $GLOBALS['____2105479054'][21](self::$_1640208080); $_156370541= $GLOBALS['____2105479054'][22]($_156370541); COption::SetOptionString(___1617378589(59), ___1617378589(60), $_156370541); foreach($_793198460 as $_582713932) self::__433332123($_582713932[(1412/2-706)], $_582713932[round(0+1)]);} public static function ModifyFeaturesSettings($_1656553176, $_451446685){ self::__1353429654(); foreach($_1656553176 as $_1009512452 => $_40714746) self::$_1640208080[___1617378589(61)][$_1009512452]= $_40714746; $_793198460= array(); foreach($_451446685 as $_1080701850 => $_553148609){ if(!isset(self::$_1640208080[___1617378589(62)][$_1080701850]) && $_553148609 || isset(self::$_1640208080[___1617378589(63)][$_1080701850]) && $_553148609 != self::$_1640208080[___1617378589(64)][$_1080701850]) $_793198460[]= array($_1080701850, $_553148609); self::$_1640208080[___1617378589(65)][$_1080701850]= $_553148609;} $_156370541= $GLOBALS['____2105479054'][23](self::$_1640208080); $_156370541= $GLOBALS['____2105479054'][24]($_156370541); COption::SetOptionString(___1617378589(66), ___1617378589(67), $_156370541); self::$_1640208080= false; foreach($_793198460 as $_582713932) self::__433332123($_582713932[min(68,0,22.666666666667)], $_582713932[round(0+0.5+0.5)]);} public static function SaveFeaturesSettings($_1269225859, $_1634811173){ self::__1353429654(); $_997213646= array(___1617378589(68) => array(), ___1617378589(69) => array()); if(!$GLOBALS['____2105479054'][25]($_1269225859)) $_1269225859= array(); if(!$GLOBALS['____2105479054'][26]($_1634811173)) $_1634811173= array(); if(!$GLOBALS['____2105479054'][27](___1617378589(70), $_1269225859)) $_1269225859[]= ___1617378589(71); foreach(self::$_1288079721 as $_1009512452 => $_451446685){ if(isset(self::$_1640208080[___1617378589(72)][$_1009512452])){ $_110048938= self::$_1640208080[___1617378589(73)][$_1009512452];} else{ $_110048938=($_1009512452 == ___1617378589(74)? array(___1617378589(75)): array(___1617378589(76)));} if($_110048938[(1320/2-660)] == ___1617378589(77) || $_110048938[(139*2-278)] == ___1617378589(78)){ $_997213646[___1617378589(79)][$_1009512452]= $_110048938;} else{ if($GLOBALS['____2105479054'][28]($_1009512452, $_1269225859)) $_997213646[___1617378589(80)][$_1009512452]= array(___1617378589(81), $GLOBALS['____2105479054'][29]((200*2-400),(950-2*475),(1152/2-576), $GLOBALS['____2105479054'][30](___1617378589(82)), $GLOBALS['____2105479054'][31](___1617378589(83)), $GLOBALS['____2105479054'][32](___1617378589(84)))); else $_997213646[___1617378589(85)][$_1009512452]= array(___1617378589(86));}} $_793198460= array(); foreach(self::$_562575185 as $_1080701850 => $_1009512452){ if($_997213646[___1617378589(87)][$_1009512452][(1260/2-630)] != ___1617378589(88) && $_997213646[___1617378589(89)][$_1009512452][(208*2-416)] != ___1617378589(90)){ $_997213646[___1617378589(91)][$_1080701850]= false;} else{ if($_997213646[___1617378589(92)][$_1009512452][min(210,0,70)] == ___1617378589(93) && $_997213646[___1617378589(94)][$_1009512452][round(0+0.33333333333333+0.33333333333333+0.33333333333333)]< $GLOBALS['____2105479054'][33](min(184,0,61.333333333333),(922-2*461), min(74,0,24.666666666667), Date(___1617378589(95)), $GLOBALS['____2105479054'][34](___1617378589(96))- self::$_819897216, $GLOBALS['____2105479054'][35](___1617378589(97)))) $_997213646[___1617378589(98)][$_1080701850]= false; else $_997213646[___1617378589(99)][$_1080701850]= $GLOBALS['____2105479054'][36]($_1080701850, $_1634811173); if(!isset(self::$_1640208080[___1617378589(100)][$_1080701850]) && $_997213646[___1617378589(101)][$_1080701850] || isset(self::$_1640208080[___1617378589(102)][$_1080701850]) && $_997213646[___1617378589(103)][$_1080701850] != self::$_1640208080[___1617378589(104)][$_1080701850]) $_793198460[]= array($_1080701850, $_997213646[___1617378589(105)][$_1080701850]);}} $_156370541= $GLOBALS['____2105479054'][37]($_997213646); $_156370541= $GLOBALS['____2105479054'][38]($_156370541); COption::SetOptionString(___1617378589(106), ___1617378589(107), $_156370541); self::$_1640208080= false; foreach($_793198460 as $_582713932) self::__433332123($_582713932[(168*2-336)], $_582713932[round(0+0.33333333333333+0.33333333333333+0.33333333333333)]);} public static function GetFeaturesList(){ self::__1353429654(); $_1043035561= array(); foreach(self::$_1288079721 as $_1009512452 => $_451446685){ if(isset(self::$_1640208080[___1617378589(108)][$_1009512452])){ $_110048938= self::$_1640208080[___1617378589(109)][$_1009512452];} else{ $_110048938=($_1009512452 == ___1617378589(110)? array(___1617378589(111)): array(___1617378589(112)));} $_1043035561[$_1009512452]= array( ___1617378589(113) => $_110048938[min(126,0,42)], ___1617378589(114) => $_110048938[round(0+0.5+0.5)], ___1617378589(115) => array(),); $_1043035561[$_1009512452][___1617378589(116)]= false; if($_1043035561[$_1009512452][___1617378589(117)] == ___1617378589(118)){ $_1043035561[$_1009512452][___1617378589(119)]= $GLOBALS['____2105479054'][39](($GLOBALS['____2105479054'][40]()- $_1043035561[$_1009512452][___1617378589(120)])/ round(0+21600+21600+21600+21600)); if($_1043035561[$_1009512452][___1617378589(121)]> self::$_819897216) $_1043035561[$_1009512452][___1617378589(122)]= true;} foreach($_451446685 as $_1080701850) $_1043035561[$_1009512452][___1617378589(123)][$_1080701850]=(!isset(self::$_1640208080[___1617378589(124)][$_1080701850]) || self::$_1640208080[___1617378589(125)][$_1080701850]);} return $_1043035561;} private static function __1333606070($_605078915, $_1787746330){ if(IsModuleInstalled($_605078915) == $_1787746330) return true; $_526186536= $_SERVER[___1617378589(126)].___1617378589(127).$_605078915.___1617378589(128); if(!$GLOBALS['____2105479054'][41]($_526186536)) return false; include_once($_526186536); $_1954914435= $GLOBALS['____2105479054'][42](___1617378589(129), ___1617378589(130), $_605078915); if(!$GLOBALS['____2105479054'][43]($_1954914435)) return false; $_1959425836= new $_1954914435; if($_1787746330){ if(!$_1959425836->InstallDB()) return false; $_1959425836->InstallEvents(); if(!$_1959425836->InstallFiles()) return false;} else{ if(CModule::IncludeModule(___1617378589(131))) CSearch::DeleteIndex($_605078915); UnRegisterModule($_605078915);} return true;} protected static function OnRequestsSettingsChange($_1080701850, $_553148609){ self::__1333606070("form", $_553148609);} protected static function OnLearningSettingsChange($_1080701850, $_553148609){ self::__1333606070("learning", $_553148609);} protected static function OnJabberSettingsChange($_1080701850, $_553148609){ self::__1333606070("xmpp", $_553148609);} protected static function OnVideoConferenceSettingsChange($_1080701850, $_553148609){} protected static function OnBizProcSettingsChange($_1080701850, $_553148609){ self::__1333606070("bizprocdesigner", $_553148609);} protected static function OnListsSettingsChange($_1080701850, $_553148609){ self::__1333606070("lists", $_553148609);} protected static function OnWikiSettingsChange($_1080701850, $_553148609){ self::__1333606070("wiki", $_553148609);} protected static function OnSupportSettingsChange($_1080701850, $_553148609){ self::__1333606070("support", $_553148609);} protected static function OnControllerSettingsChange($_1080701850, $_553148609){ self::__1333606070("controller", $_553148609);} protected static function OnAnalyticsSettingsChange($_1080701850, $_553148609){ self::__1333606070("statistic", $_553148609);} protected static function OnVoteSettingsChange($_1080701850, $_553148609){ self::__1333606070("vote", $_553148609);} protected static function OnFriendsSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(132); $_1878984996= CSite::GetList(___1617378589(133), ___1617378589(134), array(___1617378589(135) => ___1617378589(136))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(137), ___1617378589(138), ___1617378589(139), $_153454472[___1617378589(140)]) != $_560952738){ COption::SetOptionString(___1617378589(141), ___1617378589(142), $_560952738, false, $_153454472[___1617378589(143)]); COption::SetOptionString(___1617378589(144), ___1617378589(145), $_560952738);}}} protected static function OnMicroBlogSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(146); $_1878984996= CSite::GetList(___1617378589(147), ___1617378589(148), array(___1617378589(149) => ___1617378589(150))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(151), ___1617378589(152), ___1617378589(153), $_153454472[___1617378589(154)]) != $_560952738){ COption::SetOptionString(___1617378589(155), ___1617378589(156), $_560952738, false, $_153454472[___1617378589(157)]); COption::SetOptionString(___1617378589(158), ___1617378589(159), $_560952738);} if(COption::GetOptionString(___1617378589(160), ___1617378589(161), ___1617378589(162), $_153454472[___1617378589(163)]) != $_560952738){ COption::SetOptionString(___1617378589(164), ___1617378589(165), $_560952738, false, $_153454472[___1617378589(166)]); COption::SetOptionString(___1617378589(167), ___1617378589(168), $_560952738);}}} protected static function OnPersonalFilesSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(169); $_1878984996= CSite::GetList(___1617378589(170), ___1617378589(171), array(___1617378589(172) => ___1617378589(173))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(174), ___1617378589(175), ___1617378589(176), $_153454472[___1617378589(177)]) != $_560952738){ COption::SetOptionString(___1617378589(178), ___1617378589(179), $_560952738, false, $_153454472[___1617378589(180)]); COption::SetOptionString(___1617378589(181), ___1617378589(182), $_560952738);}}} protected static function OnPersonalBlogSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(183); $_1878984996= CSite::GetList(___1617378589(184), ___1617378589(185), array(___1617378589(186) => ___1617378589(187))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(188), ___1617378589(189), ___1617378589(190), $_153454472[___1617378589(191)]) != $_560952738){ COption::SetOptionString(___1617378589(192), ___1617378589(193), $_560952738, false, $_153454472[___1617378589(194)]); COption::SetOptionString(___1617378589(195), ___1617378589(196), $_560952738);}}} protected static function OnPersonalPhotoSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(197); $_1878984996= CSite::GetList(___1617378589(198), ___1617378589(199), array(___1617378589(200) => ___1617378589(201))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(202), ___1617378589(203), ___1617378589(204), $_153454472[___1617378589(205)]) != $_560952738){ COption::SetOptionString(___1617378589(206), ___1617378589(207), $_560952738, false, $_153454472[___1617378589(208)]); COption::SetOptionString(___1617378589(209), ___1617378589(210), $_560952738);}}} protected static function OnPersonalForumSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(211); $_1878984996= CSite::GetList(___1617378589(212), ___1617378589(213), array(___1617378589(214) => ___1617378589(215))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(216), ___1617378589(217), ___1617378589(218), $_153454472[___1617378589(219)]) != $_560952738){ COption::SetOptionString(___1617378589(220), ___1617378589(221), $_560952738, false, $_153454472[___1617378589(222)]); COption::SetOptionString(___1617378589(223), ___1617378589(224), $_560952738);}}} protected static function OnTasksSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(225); $_1878984996= CSite::GetList(___1617378589(226), ___1617378589(227), array(___1617378589(228) => ___1617378589(229))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(230), ___1617378589(231), ___1617378589(232), $_153454472[___1617378589(233)]) != $_560952738){ COption::SetOptionString(___1617378589(234), ___1617378589(235), $_560952738, false, $_153454472[___1617378589(236)]); COption::SetOptionString(___1617378589(237), ___1617378589(238), $_560952738);} if(COption::GetOptionString(___1617378589(239), ___1617378589(240), ___1617378589(241), $_153454472[___1617378589(242)]) != $_560952738){ COption::SetOptionString(___1617378589(243), ___1617378589(244), $_560952738, false, $_153454472[___1617378589(245)]); COption::SetOptionString(___1617378589(246), ___1617378589(247), $_560952738);}} self::__1333606070(___1617378589(248), $_553148609);} protected static function OnCalendarSettingsChange($_1080701850, $_553148609){ if($_553148609) $_560952738= "Y"; else $_560952738= ___1617378589(249); $_1878984996= CSite::GetList(___1617378589(250), ___1617378589(251), array(___1617378589(252) => ___1617378589(253))); while($_153454472= $_1878984996->Fetch()){ if(COption::GetOptionString(___1617378589(254), ___1617378589(255), ___1617378589(256), $_153454472[___1617378589(257)]) != $_560952738){ COption::SetOptionString(___1617378589(258), ___1617378589(259), $_560952738, false, $_153454472[___1617378589(260)]); COption::SetOptionString(___1617378589(261), ___1617378589(262), $_560952738);} if(COption::GetOptionString(___1617378589(263), ___1617378589(264), ___1617378589(265), $_153454472[___1617378589(266)]) != $_560952738){ COption::SetOptionString(___1617378589(267), ___1617378589(268), $_560952738, false, $_153454472[___1617378589(269)]); COption::SetOptionString(___1617378589(270), ___1617378589(271), $_560952738);}}} protected static function OnSMTPSettingsChange($_1080701850, $_553148609){ self::__1333606070("mail", $_553148609);} protected static function OnExtranetSettingsChange($_1080701850, $_553148609){ $_1912312667= COption::GetOptionString("extranet", "extranet_site", ""); if($_1912312667){ $_1636234803= new CSite; $_1636234803->Update($_1912312667, array(___1617378589(272) =>($_553148609? ___1617378589(273): ___1617378589(274))));} self::__1333606070(___1617378589(275), $_553148609);} protected static function OnDAVSettingsChange($_1080701850, $_553148609){ self::__1333606070("dav", $_553148609);} protected static function OntimemanSettingsChange($_1080701850, $_553148609){ self::__1333606070("timeman", $_553148609);} protected static function Onintranet_sharepointSettingsChange($_1080701850, $_553148609){ if($_553148609){ RegisterModuleDependences("iblock", "OnAfterIBlockElementAdd", "intranet", "CIntranetEventHandlers", "SPRegisterUpdatedItem"); RegisterModuleDependences(___1617378589(276), ___1617378589(277), ___1617378589(278), ___1617378589(279), ___1617378589(280)); CAgent::AddAgent(___1617378589(281), ___1617378589(282), ___1617378589(283), round(0+125+125+125+125)); CAgent::AddAgent(___1617378589(284), ___1617378589(285), ___1617378589(286), round(0+300)); CAgent::AddAgent(___1617378589(287), ___1617378589(288), ___1617378589(289), round(0+1200+1200+1200));} else{ UnRegisterModuleDependences(___1617378589(290), ___1617378589(291), ___1617378589(292), ___1617378589(293), ___1617378589(294)); UnRegisterModuleDependences(___1617378589(295), ___1617378589(296), ___1617378589(297), ___1617378589(298), ___1617378589(299)); CAgent::RemoveAgent(___1617378589(300), ___1617378589(301)); CAgent::RemoveAgent(___1617378589(302), ___1617378589(303)); CAgent::RemoveAgent(___1617378589(304), ___1617378589(305));}} protected static function OncrmSettingsChange($_1080701850, $_553148609){ if($_553148609) COption::SetOptionString("crm", "form_features", "Y"); self::__1333606070(___1617378589(306), $_553148609);} protected static function OnClusterSettingsChange($_1080701850, $_553148609){ self::__1333606070("cluster", $_553148609);} protected static function OnMultiSitesSettingsChange($_1080701850, $_553148609){ if($_553148609) RegisterModuleDependences("main", "OnBeforeProlog", "main", "CWizardSolPanelIntranet", "ShowPanel", 100, "/modules/intranet/panel_button.php"); else UnRegisterModuleDependences(___1617378589(307), ___1617378589(308), ___1617378589(309), ___1617378589(310), ___1617378589(311), ___1617378589(312));} protected static function OnIdeaSettingsChange($_1080701850, $_553148609){ self::__1333606070("idea", $_553148609);} protected static function OnMeetingSettingsChange($_1080701850, $_553148609){ self::__1333606070("meeting", $_553148609);} protected static function OnXDImportSettingsChange($_1080701850, $_553148609){ self::__1333606070("xdimport", $_553148609);}} $GLOBALS['____2105479054'][44](___1617378589(313), ___1617378589(314));/**/			//Do not remove this

// Component 2.0 template engines
$GLOBALS['arCustomTemplateEngines'] = [];

// User fields manager
$GLOBALS['USER_FIELD_MANAGER'] = new CUserTypeManager;

// todo: remove global
$GLOBALS['BX_MENU_CUSTOM'] = CMenuCustom::getInstance();

if (file_exists(($_fname = __DIR__ . "/classes/general/update_db_updater.php")))
{
	$US_HOST_PROCESS_MAIN = false;
	include $_fname;
}

if (($_fname = getLocalPath("init.php")) !== false)
{
	include_once $_SERVER["DOCUMENT_ROOT"] . $_fname;
}

if (($_fname = getLocalPath("php_interface/init.php", BX_PERSONAL_ROOT)) !== false)
{
	include_once $_SERVER["DOCUMENT_ROOT"] . $_fname;
}

if (($_fname = getLocalPath("php_interface/" . SITE_ID . "/init.php", BX_PERSONAL_ROOT)) !== false)
{
	include_once $_SERVER["DOCUMENT_ROOT"] . $_fname;
}

if ((!(defined("STATISTIC_ONLY") && STATISTIC_ONLY && !str_starts_with($GLOBALS["APPLICATION"]->GetCurPage(), BX_ROOT . "/admin/"))) && COption::GetOptionString("main", "include_charset", "Y") == "Y" && LANG_CHARSET != '')
{
	header("Content-Type: text/html; charset=".LANG_CHARSET);
}

if (COption::GetOptionString("main", "set_p3p_header", "Y") == "Y")
{
	header("P3P: policyref=\"/bitrix/p3p.xml\", CP=\"NON DSP COR CUR ADM DEV PSA PSD OUR UNR BUS UNI COM NAV INT DEM STA\"");
}

$license = $application->getLicense();
header("X-Powered-CMS: Bitrix Site Manager (" . ($license->isDemoKey() ? "DEMO" : $license->getPublicHashKey()) . ")");

if (COption::GetOptionString("main", "update_devsrv", "") == "Y")
{
	header("X-DevSrv-CMS: Bitrix");
}

//agents
if (COption::GetOptionString("main", "check_agents", "Y") == "Y")
{
	$application->addBackgroundJob(["CAgent", "CheckAgents"], [], Main\Application::JOB_PRIORITY_LOW);
}

//send email events
if (COption::GetOptionString("main", "check_events", "Y") !== "N")
{
	$application->addBackgroundJob(['\Bitrix\Main\Mail\EventManager', 'checkEvents'], [], Main\Application::JOB_PRIORITY_LOW - 1);
}

$healerOfEarlySessionStart = new HealerEarlySessionStart();
$healerOfEarlySessionStart->process($application->getKernelSession());

$kernelSession = $application->getKernelSession();
$kernelSession->start();
$application->getSessionLocalStorageManager()->setUniqueId($kernelSession->getId());

foreach (GetModuleEvents("main", "OnPageStart", true) as $arEvent)
{
	ExecuteModuleEventEx($arEvent);
}

//define global user object
$GLOBALS["USER"] = new CUser;

//session control from group policy
$arPolicy = $GLOBALS["USER"]->GetSecurityPolicy();
$currTime = time();
if (
	(
		//IP address changed
		$kernelSession['SESS_IP']
		&& $arPolicy["SESSION_IP_MASK"] != ''
		&& (
			(ip2long($arPolicy["SESSION_IP_MASK"]) & ip2long($kernelSession['SESS_IP']))
			!=
			(ip2long($arPolicy["SESSION_IP_MASK"]) & ip2long($_SERVER['REMOTE_ADDR']))
		)
	)
	||
	(
		//session timeout
		$arPolicy["SESSION_TIMEOUT"] > 0
		&& $kernelSession['SESS_TIME'] > 0
		&& ($currTime - $arPolicy["SESSION_TIMEOUT"] * 60) > $kernelSession['SESS_TIME']
	)
	||
	(
		//signed session
		isset($kernelSession["BX_SESSION_SIGN"])
		&& $kernelSession["BX_SESSION_SIGN"] != bitrix_sess_sign()
	)
	||
	(
		//session manually expired, e.g. in $User->LoginHitByHash
		isSessionExpired()
	)
)
{
	$compositeSessionManager = $application->getCompositeSessionManager();
	$compositeSessionManager->destroy();

	$application->getSession()->setId(Main\Security\Random::getString(32));
	$compositeSessionManager->start();

	$GLOBALS["USER"] = new CUser;
}
$kernelSession['SESS_IP'] = $_SERVER['REMOTE_ADDR'] ?? null;
if (empty($kernelSession['SESS_TIME']))
{
	$kernelSession['SESS_TIME'] = $currTime;
}
elseif (($currTime - $kernelSession['SESS_TIME']) > 60)
{
	$kernelSession['SESS_TIME'] = $currTime;
}
if (!isset($kernelSession["BX_SESSION_SIGN"]))
{
	$kernelSession["BX_SESSION_SIGN"] = bitrix_sess_sign();
}

//session control from security module
if (
	(COption::GetOptionString("main", "use_session_id_ttl", "N") == "Y")
	&& (COption::GetOptionInt("main", "session_id_ttl", 0) > 0)
	&& !defined("BX_SESSION_ID_CHANGE")
)
{
	if (!isset($kernelSession['SESS_ID_TIME']))
	{
		$kernelSession['SESS_ID_TIME'] = $currTime;
	}
	elseif (($kernelSession['SESS_ID_TIME'] + COption::GetOptionInt("main", "session_id_ttl")) < $kernelSession['SESS_TIME'])
	{
		$compositeSessionManager = $application->getCompositeSessionManager();
		$compositeSessionManager->regenerateId();

		$kernelSession['SESS_ID_TIME'] = $currTime;
	}
}

define("BX_STARTED", true);

if (isset($kernelSession['BX_ADMIN_LOAD_AUTH']))
{
	define('ADMIN_SECTION_LOAD_AUTH', 1);
	unset($kernelSession['BX_ADMIN_LOAD_AUTH']);
}

$bRsaError = false;
$USER_LID = false;

if (!defined("NOT_CHECK_PERMISSIONS") || NOT_CHECK_PERMISSIONS !== true)
{
	$doLogout = isset($_REQUEST["logout"]) && (strtolower($_REQUEST["logout"]) == "yes");

	if ($doLogout && $GLOBALS["USER"]->IsAuthorized())
	{
		$secureLogout = (Main\Config\Option::get("main", "secure_logout", "N") == "Y");

		if (!$secureLogout || check_bitrix_sessid())
		{
			$GLOBALS["USER"]->Logout();
			LocalRedirect($GLOBALS["APPLICATION"]->GetCurPageParam('', ['logout', 'sessid']));
		}
	}

	// authorize by cookies
	if (!$GLOBALS["USER"]->IsAuthorized())
	{
		$GLOBALS["USER"]->LoginByCookies();
	}

	$arAuthResult = false;

	//http basic and digest authorization
	if (($httpAuth = $GLOBALS["USER"]->LoginByHttpAuth()) !== null)
	{
		$arAuthResult = $httpAuth;
		$GLOBALS["APPLICATION"]->SetAuthResult($arAuthResult);
	}

	//Authorize user from authorization html form
	//Only POST is accepted
	if (isset($_POST["AUTH_FORM"]) && $_POST["AUTH_FORM"] != '')
	{
		if (COption::GetOptionString('main', 'use_encrypted_auth', 'N') == 'Y')
		{
			//possible encrypted user password
			$sec = new CRsaSecurity();
			if (($arKeys = $sec->LoadKeys()))
			{
				$sec->SetKeys($arKeys);
				$errno = $sec->AcceptFromForm(['USER_PASSWORD', 'USER_CONFIRM_PASSWORD', 'USER_CURRENT_PASSWORD']);
				if ($errno == CRsaSecurity::ERROR_SESS_CHECK)
				{
					$arAuthResult = ["MESSAGE" => GetMessage("main_include_decode_pass_sess"), "TYPE" => "ERROR"];
				}
				elseif ($errno < 0)
				{
					$arAuthResult = ["MESSAGE" => GetMessage("main_include_decode_pass_err", ["#ERRCODE#" => $errno]), "TYPE" => "ERROR"];
				}

				if ($errno < 0)
				{
					$bRsaError = true;
				}
			}
		}

		if (!$bRsaError)
		{
			if (!defined("ADMIN_SECTION") || ADMIN_SECTION !== true)
			{
				$USER_LID = SITE_ID;
			}

			$_POST["TYPE"] = $_POST["TYPE"] ?? null;
			if (isset($_POST["TYPE"]) && $_POST["TYPE"] == "AUTH")
			{
				$arAuthResult = $GLOBALS["USER"]->Login(
					$_POST["USER_LOGIN"] ?? '',
					$_POST["USER_PASSWORD"] ?? '',
					$_POST["USER_REMEMBER"] ?? ''
				);
			}
			elseif (isset($_POST["TYPE"]) && $_POST["TYPE"] == "OTP")
			{
				$arAuthResult = $GLOBALS["USER"]->LoginByOtp(
					$_POST["USER_OTP"] ?? '',
					$_POST["OTP_REMEMBER"] ?? '',
					$_POST["captcha_word"] ?? '',
					$_POST["captcha_sid"] ?? ''
				);
			}
			elseif (isset($_POST["TYPE"]) && $_POST["TYPE"] == "SEND_PWD")
			{
				$arAuthResult = CUser::SendPassword(
					$_POST["USER_LOGIN"] ?? '',
					$_POST["USER_EMAIL"] ?? '',
					$USER_LID,
					$_POST["captcha_word"] ?? '',
					$_POST["captcha_sid"] ?? '',
					$_POST["USER_PHONE_NUMBER"] ?? ''
				);
			}
			elseif (isset($_POST["TYPE"]) && $_POST["TYPE"] == "CHANGE_PWD")
			{
				$arAuthResult = $GLOBALS["USER"]->ChangePassword(
					$_POST["USER_LOGIN"] ?? '',
					$_POST["USER_CHECKWORD"] ?? '',
					$_POST["USER_PASSWORD"] ?? '',
					$_POST["USER_CONFIRM_PASSWORD"] ?? '',
					$USER_LID,
					$_POST["captcha_word"] ?? '',
					$_POST["captcha_sid"] ?? '',
					true,
					$_POST["USER_PHONE_NUMBER"] ?? '',
					$_POST["USER_CURRENT_PASSWORD"] ?? ''
				);
			}

			if ($_POST["TYPE"] == "AUTH" || $_POST["TYPE"] == "OTP")
			{
				//special login form in the control panel
				if ($arAuthResult === true && defined('ADMIN_SECTION') && ADMIN_SECTION === true)
				{
					//store cookies for next hit (see CMain::GetSpreadCookieHTML())
					$GLOBALS["APPLICATION"]->StoreCookies();
					$kernelSession['BX_ADMIN_LOAD_AUTH'] = true;

					// die() follows
					CMain::FinalActions('<script>window.onload=function(){(window.BX || window.parent.BX).AUTHAGENT.setAuthResult(false);};</script>');
				}
			}
		}
		$GLOBALS["APPLICATION"]->SetAuthResult($arAuthResult);
	}
	elseif (!$GLOBALS["USER"]->IsAuthorized() && isset($_REQUEST['bx_hit_hash']))
	{
		//Authorize by unique URL
		$GLOBALS["USER"]->LoginHitByHash($_REQUEST['bx_hit_hash']);
	}
}

//logout or re-authorize the user if something importand has changed
$GLOBALS["USER"]->CheckAuthActions();

//magic short URI
if (defined("BX_CHECK_SHORT_URI") && BX_CHECK_SHORT_URI && CBXShortUri::CheckUri())
{
	//local redirect inside
	die();
}

//application password scope control
if (($applicationID = $GLOBALS["USER"]->getContext()->getApplicationId()) !== null)
{
	$appManager = Main\Authentication\ApplicationManager::getInstance();
	if ($appManager->checkScope($applicationID) !== true)
	{
		$event = new Main\Event("main", "onApplicationScopeError", ['APPLICATION_ID' => $applicationID]);
		$event->send();

		$context->getResponse()->setStatus("403 Forbidden");
		$application->end();
	}
}

//define the site template
if (!defined("ADMIN_SECTION") || ADMIN_SECTION !== true)
{
	$siteTemplate = "";
	if (!empty($_REQUEST["bitrix_preview_site_template"]) && is_string($_REQUEST["bitrix_preview_site_template"]) && $GLOBALS["USER"]->CanDoOperation('view_other_settings'))
	{
		//preview of site template
		$signer = new Main\Security\Sign\Signer();
		try
		{
			//protected by a sign
			$requestTemplate = $signer->unsign($_REQUEST["bitrix_preview_site_template"], "template_preview".bitrix_sessid());

			$aTemplates = CSiteTemplate::GetByID($requestTemplate);
			if ($template = $aTemplates->Fetch())
			{
				$siteTemplate = $template["ID"];

				//preview of unsaved template
				if (isset($_GET['bx_template_preview_mode']) && $_GET['bx_template_preview_mode'] == 'Y' && $GLOBALS["USER"]->CanDoOperation('edit_other_settings'))
				{
					define("SITE_TEMPLATE_PREVIEW_MODE", true);
				}
			}
		}
		catch (Main\Security\Sign\BadSignatureException)
		{
		}
	}
	if ($siteTemplate == "")
	{
		$siteTemplate = CSite::GetCurTemplate();
	}

	if (!defined('SITE_TEMPLATE_ID'))
	{
		define("SITE_TEMPLATE_ID", $siteTemplate);
	}

	if (!defined('SITE_TEMPLATE_PATH'))
	{
		define("SITE_TEMPLATE_PATH", getLocalPath('templates/'.SITE_TEMPLATE_ID, BX_PERSONAL_ROOT));
	}
}
else
{
	// prevents undefined constants
	if (!defined('SITE_TEMPLATE_ID'))
	{
		define('SITE_TEMPLATE_ID', '.default');
	}

	define('SITE_TEMPLATE_PATH', '/bitrix/templates/.default');
}

//magic parameters: show page creation time
if (isset($_GET["show_page_exec_time"]))
{
	if ($_GET["show_page_exec_time"] == "Y" || $_GET["show_page_exec_time"] == "N")
	{
		$kernelSession["SESS_SHOW_TIME_EXEC"] = $_GET["show_page_exec_time"];
	}
}

//magic parameters: show included file processing time
if (isset($_GET["show_include_exec_time"]))
{
	if ($_GET["show_include_exec_time"] == "Y" || $_GET["show_include_exec_time"] == "N")
	{
		$kernelSession["SESS_SHOW_INCLUDE_TIME_EXEC"] = $_GET["show_include_exec_time"];
	}
}

//magic parameters: show include areas
if (!empty($_GET["bitrix_include_areas"]))
{
	$GLOBALS["APPLICATION"]->SetShowIncludeAreas($_GET["bitrix_include_areas"]=="Y");
}

//magic sound
if ($GLOBALS["USER"]->IsAuthorized())
{
	$cookie_prefix = COption::GetOptionString('main', 'cookie_name', 'BITRIX_SM');
	if (!isset($_COOKIE[$cookie_prefix.'_SOUND_LOGIN_PLAYED']))
	{
		$GLOBALS["APPLICATION"]->set_cookie('SOUND_LOGIN_PLAYED', 'Y', 0);
	}
}

//magic cache
Main\Composite\Engine::shouldBeEnabled();

// should be before proactive filter on OnBeforeProlog
$userPassword = $_POST["USER_PASSWORD"] ?? null;
$userConfirmPassword = $_POST["USER_CONFIRM_PASSWORD"] ?? null;

foreach(GetModuleEvents("main", "OnBeforeProlog", true) as $arEvent)
{
	ExecuteModuleEventEx($arEvent);
}

// need to reinit
$GLOBALS["APPLICATION"]->SetCurPage(false);

if (!defined("NOT_CHECK_PERMISSIONS") || NOT_CHECK_PERMISSIONS !== true)
{
	//Register user from authorization html form
	//Only POST is accepted
	if (isset($_POST["AUTH_FORM"]) && $_POST["AUTH_FORM"] != '' && isset($_POST["TYPE"]) && $_POST["TYPE"] == "REGISTRATION")
	{
		if (!$bRsaError)
		{
			if (COption::GetOptionString("main", "new_user_registration", "N") == "Y" && (!defined("ADMIN_SECTION") || ADMIN_SECTION !== true))
			{
				$arAuthResult = $GLOBALS["USER"]->Register(
					$_POST["USER_LOGIN"] ?? '',
					$_POST["USER_NAME"] ?? '',
					$_POST["USER_LAST_NAME"] ?? '',
					$userPassword,
					$userConfirmPassword,
					$_POST["USER_EMAIL"] ?? '',
					$USER_LID,
					$_POST["captcha_word"] ?? '',
					$_POST["captcha_sid"] ?? '',
					false,
					$_POST["USER_PHONE_NUMBER"] ?? ''
				);

				$GLOBALS["APPLICATION"]->SetAuthResult($arAuthResult);
			}
		}
	}
}

if ((!defined("NOT_CHECK_PERMISSIONS") || NOT_CHECK_PERMISSIONS !== true) && (!defined("NOT_CHECK_FILE_PERMISSIONS") || NOT_CHECK_FILE_PERMISSIONS !== true))
{
	$real_path = $context->getRequest()->getScriptFile();

	if (!$GLOBALS["USER"]->CanDoFileOperation('fm_view_file', [SITE_ID, $real_path]) || (defined("NEED_AUTH") && NEED_AUTH && !$GLOBALS["USER"]->IsAuthorized()))
	{
		if ($GLOBALS["USER"]->IsAuthorized() && empty($arAuthResult["MESSAGE"]))
		{
			$arAuthResult = ["MESSAGE" => GetMessage("ACCESS_DENIED").' '.GetMessage("ACCESS_DENIED_FILE", ["#FILE#" => $real_path]), "TYPE" => "ERROR"];

			if (COption::GetOptionString("main", "event_log_permissions_fail", "N") === "Y")
			{
				CEventLog::Log(CEventLog::SEVERITY_SECURITY, "USER_PERMISSIONS_FAIL", "main", $GLOBALS["USER"]->GetID(), $real_path);
			}
		}

		if (defined("ADMIN_SECTION") && ADMIN_SECTION === true)
		{
			if (isset($_REQUEST["mode"]) && ($_REQUEST["mode"] === "list" || $_REQUEST["mode"] === "settings"))
			{
				echo "<script>top.location='".$GLOBALS["APPLICATION"]->GetCurPage()."?".DeleteParam(["mode"])."';</script>";
				die();
			}
			elseif (isset($_REQUEST["mode"]) && $_REQUEST["mode"] === "frame")
			{
				echo "<script>
					const w = (opener? opener.window:parent.window);
					w.location.href='" .$GLOBALS["APPLICATION"]->GetCurPage()."?".DeleteParam(["mode"])."';
				</script>";
				die();
			}
			elseif (defined("MOBILE_APP_ADMIN") && MOBILE_APP_ADMIN === true)
			{
				echo json_encode(["status" => "failed"]);
				die();
			}
		}

		/** @noinspection PhpUndefinedVariableInspection */
		$GLOBALS["APPLICATION"]->AuthForm($arAuthResult);
	}
}

/*ZDUyZmZOWRhNTFlN2E3YWNhOWRjM2ZhYThjZjYzNzJjZmEzMjM=*/$GLOBALS['____1875443335']= array(base64_decode('bXRfcmFuZA=='),base64_decode('Y'.'2Fsb'.'F9'.'1'.'c2'.'VyX2Z1bm'.'M'.'='),base64_decode('c3Ry'.'c'.'G9z'),base64_decode('Z'.'X'.'hwbG9'.'kZQ'.'=='),base64_decode('cGFjaw=='),base64_decode('b'.'WQ1'),base64_decode('Y'.'29uc3RhbnQ='),base64_decode('aGFzaF9ob'.'WFj'),base64_decode('c3'.'RyY'.'2'.'1w'),base64_decode('Y'.'2'.'FsbF91c2VyX2'.'Z1bm'.'M='),base64_decode('Y2'.'Fs'.'bF91c2'.'VyX'.'2Z1bmM='),base64_decode(''.'aXNfb2JqZWN0'),base64_decode(''.'Y'.'2Fsb'.'F91'.'c'.'2VyX'.'2Z1bmM'.'='),base64_decode('Y2Fsb'.'F'.'91c2VyX2Z'.'1bmM'.'='),base64_decode('Y'.'2FsbF91'.'c2'.'VyX'.'2Z1'.'bmM='),base64_decode(''.'Y'.'2FsbF91c2VyX2'.'Z1bmM='),base64_decode('Y2F'.'sb'.'F91c'.'2VyX2Z1bmM='),base64_decode('Y2FsbF91'.'c2'.'VyX2Z1bm'.'M='));if(!function_exists(__NAMESPACE__.'\\___1878021480')){function ___1878021480($_1533020277){static $_313368426= false; if($_313368426 == false) $_313368426=array('XEN'.'P'.'cHRpb24'.'6O'.'kdldE9'.'wdGlvblN0'.'c'.'mluZ'.'w==','bWFpbg==','flBBUkFNX01BWF'.'9VU0VSUw==','Lg==','Lg==','SCo=','Yml0'.'cml4',''.'TElDRU5TR'.'V9LRV'.'k=',''.'c2hhM'.'jU'.'2','XENPcH'.'R'.'pb24'.'6'.'O'.'kdld'.'E'.'9'.'wdGlvbl'.'N0c'.'mlu'.'Zw='.'=','bWFp'.'b'.'g==','UEFSQU'.'1'.'f'.'TUF'.'YX'.'1'.'VTRVJT','XEJpdHJpeFxNYWl'.'uXENvbm'.'ZpZ1'.'xPc'.'HR'.'pb246OnNldA==','b'.'W'.'F'.'p'.'bg==','UEFSQU1fT'.'UF'.'Y'.'X'.'1'.'VTRVJT','V'.'VNFUg='.'=','VVNFUg==','VVNFU'.'g'.'='.'=','SXNBdXRob'.'3JpemVk','V'.'VNF'.'Ug==','S'.'XN'.'BZG1'.'pbg='.'=','Q'.'VB'.'Q'.'TElDQVRJT04=','UmV'.'zdGF'.'ydEJ'.'1'.'Z'.'mZlc'.'g==','T'.'G9'.'jYWxSZWR'.'pcmVjdA'.'==','L'.'2x'.'pY2V'.'u'.'c'.'2VfcmVz'.'dHJ'.'pY3Rpb24uc'.'Ghw','XENPcHRpb'.'246Okdld'.'E9wdG'.'lv'.'blN'.'0cmluZw==','bWFpbg==',''.'UEF'.'S'.'QU1f'.'TUFYX1VTR'.'VJ'.'T','XE'.'Jp'.'dHJpeFxNYW'.'luXENvbm'.'ZpZ1xPcHR'.'pb2'.'46OnNld'.'A='.'=','b'.'WFpbg==',''.'UE'.'FS'.'QU1fTUFYX1VTRVJT');return base64_decode($_313368426[$_1533020277]);}};if($GLOBALS['____1875443335'][0](round(0+0.2+0.2+0.2+0.2+0.2), round(0+5+5+5+5)) == round(0+1.4+1.4+1.4+1.4+1.4)){ $_1293545742= $GLOBALS['____1875443335'][1](___1878021480(0), ___1878021480(1), ___1878021480(2)); if(!empty($_1293545742) && $GLOBALS['____1875443335'][2]($_1293545742, ___1878021480(3)) !== false){ list($_400784583, $_1831131930)= $GLOBALS['____1875443335'][3](___1878021480(4), $_1293545742); $_1359807907= $GLOBALS['____1875443335'][4](___1878021480(5), $_400784583); $_1402630816= ___1878021480(6).$GLOBALS['____1875443335'][5]($GLOBALS['____1875443335'][6](___1878021480(7))); $_964120963= $GLOBALS['____1875443335'][7](___1878021480(8), $_1831131930, $_1402630816, true); if($GLOBALS['____1875443335'][8]($_964120963, $_1359807907) !==(134*2-268)){ if($GLOBALS['____1875443335'][9](___1878021480(9), ___1878021480(10), ___1878021480(11)) != round(0+3+3+3+3)){ $GLOBALS['____1875443335'][10](___1878021480(12), ___1878021480(13), ___1878021480(14), round(0+2.4+2.4+2.4+2.4+2.4));} if(isset($GLOBALS[___1878021480(15)]) && $GLOBALS['____1875443335'][11]($GLOBALS[___1878021480(16)]) && $GLOBALS['____1875443335'][12](array($GLOBALS[___1878021480(17)], ___1878021480(18))) &&!$GLOBALS['____1875443335'][13](array($GLOBALS[___1878021480(19)], ___1878021480(20)))){ $GLOBALS['____1875443335'][14](array($GLOBALS[___1878021480(21)], ___1878021480(22))); $GLOBALS['____1875443335'][15](___1878021480(23), ___1878021480(24), true);}}} else{ if($GLOBALS['____1875443335'][16](___1878021480(25), ___1878021480(26), ___1878021480(27)) != round(0+3+3+3+3)){ $GLOBALS['____1875443335'][17](___1878021480(28), ___1878021480(29), ___1878021480(30), round(0+6+6));}}}/**/       //Do not remove this

