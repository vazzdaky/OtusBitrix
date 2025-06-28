<?php

namespace Bitrix\Intranet\Integration\Templates\Air;

use Bitrix\Intranet\Integration\Templates\Bitrix24\ThemePicker;
use Bitrix\Main\Config\Configuration;
use Bitrix\Main\Config\Option;
use Bitrix\Main\ModuleManager;
use Bitrix\UI\Buttons;

final class AirTemplate
{
	static private ?bool $enabled = null;
	static private bool $applied = false;

	public static function isEnabled(): bool
	{
		if (self::$enabled === null)
		{
			self::$enabled = self::shouldBeEnabled();
		}

		return self::$enabled;
	}

	private static function shouldBeEnabled(): bool
	{
		if (defined('USE_AIR_SITE_TEMPLATE') && USE_AIR_SITE_TEMPLATE === true)
		{
			return true;
		}

		$useSiteTemplateOption = (bool)Option::get('intranet', 'use_air_site_template', false);
		if ($useSiteTemplateOption)
		{
			return true;
		}

		$userOption = \CUserOptions::getOption('intranet', 'use_air_site_template', false);
		if ($userOption)
		{
			return true;
		}

		$configuration = Configuration::getValue('intranet');
		if (is_array($configuration) && isset($configuration['air_template']))
		{
			if (isset($configuration['air_template']['enable']) && $configuration['air_template']['enable'] === true)
			{
				return true;
			}

			if (isset($configuration['air_template']['users']) && is_array($configuration['air_template']['users']))
			{
				return in_array($GLOBALS['USER']->getId(), $configuration['air_template']['users']);
			}
		}

		return false;
	}

	public static function isApplied(): bool
	{
		return self::$applied;
	}

	public static function tryApply(): bool
	{
		if (self::isEnabled())
		{
			self::apply();

			return true;
		}

		return false;
	}

	public static function getWorkAreaContent(): string
	{
		$bodyClass = $GLOBALS['APPLICATION']->getPageProperty('BodyClass');
		if (str_contains($bodyClass, 'no-background'))
		{
			return '';
		}

		return ' --ui-context-content-light';
	}

	public static function tryApplyDefaultTopMenu(): void
	{
		$content = $GLOBALS['APPLICATION']->getViewContent('above_pagetitle');
		if (!empty($content) || defined('AIR_TOP_HORIZONTAL_MENU_EXISTS') || defined("BX_BUFFER_SHUTDOWN"))
		{
			return;
		}

		$pageTitle = $GLOBALS['APPLICATION']->getTitle();
		if (empty($pageTitle))
		{
			$pageTitle = \Bitrix\Intranet\Portal::getInstance()->getSettings()->getTitle();
		}

		ob_start();
		$GLOBALS['APPLICATION']->includeComponent(
			'bitrix:main.interface.buttons',
			'',
			[
				'ID' => \Bitrix\Main\UuidGenerator::generateV4(),
				'ITEMS' =>[
					[
						'TEXT' => $pageTitle,
						'IS_ACTIVE' => true,
					]
				],
				'THEME' => 'air',
				'DISABLE_SETTINGS' => true,
			]
		);

		$content = ob_get_contents();
		ob_end_clean();

		$GLOBALS['APPLICATION']->addViewContent('above_pagetitle', $content);
	}

	/**
	 * @example $APPLICATION->addBufferContent([AirTemplate::class, 'getDefaultTopMenu']);
	 */
	public static function getDefaultTopMenu(): string
	{
		$content = $GLOBALS['APPLICATION']->getViewContent('above_pagetitle');
		if (!empty($content) || defined('AIR_TOP_HORIZONTAL_MENU_EXISTS') || defined("BX_BUFFER_SHUTDOWN"))
		{
			return '';
		}

		$trace = \Bitrix\Main\Diag\Helper::getBackTrace(0, DEBUG_BACKTRACE_IGNORE_ARGS);
		foreach ($trace as $traceLine)
		{
			if (
				isset($traceLine['function']) &&
				in_array(
					$traceLine['function'],
					['ob_end_flush', 'ob_end_clean', 'LocalRedirect', 'ForkActions', 'fastcgi_finish_request']
				)
			)
			{
				return '';
			}
		}

		$pageTitle = $GLOBALS['APPLICATION']->getTitle();
		if (empty($pageTitle))
		{
			$pageTitle = \Bitrix\Intranet\Portal::getInstance()->getSettings()->getTitle();
		}

		ob_start();
		$GLOBALS['APPLICATION']->includeComponent(
			'bitrix:main.interface.buttons',
			'',
			[
				'ID' => \Bitrix\Main\UuidGenerator::generateV4(),
				'ITEMS' =>[
					[
						'TEXT' => $pageTitle,
						'IS_ACTIVE' => true,
					]
				],
				'THEME' => 'air',
				'DISABLE_SETTINGS' => true,
			]
		);

		$result = ob_get_contents();
		ob_end_clean();

		return $result;
	}

	public static function showJsTitle(): void
	{
		$GLOBALS['APPLICATION']->addBufferContent([AirTemplate::class, 'getJsTitle']);
	}

	public static function getJsTitle(): string
	{
		$title = $GLOBALS['APPLICATION']->getTitle('title', true);
		$title = html_entity_decode($title, ENT_QUOTES, SITE_CHARSET);

		return \CUtil::jsEscape($title);
	}

	public static function shouldShowImBar(): bool
	{
		return self::isMessengerEnabled() && !self::isMessengerEmbedded();
	}

	public static function isMessengerEnabled(): bool
	{
		return ModuleManager::isModuleInstalled('im') && \CBXFeatures::isFeatureEnabled('WebMessenger');
	}

	public static function isMessengerEmbedded(): bool
	{
		return defined('BX_IM_FULLSCREEN') && BX_IM_FULLSCREEN;
	}

	public static function getBodyClasses(): string
	{
		$bodyClasses = 'template-bitrix24 template-air';
		$bodyClasses .= ' ' . ThemePicker::getInstance()->getBodyClasses();

		if (!self::shouldShowImBar())
		{
			$bodyClasses .= ' im-bar-mode-off';
		}

		return $bodyClasses;
	}

	public static function getCompositeBodyClasses(): string
	{
		$bodyClasses = [];

		$request = \Bitrix\Main\Context::getCurrent()->getRequest();
		if (str_starts_with($request->getRequestUri(), SITE_DIR . 'online/'))
		{
			$bodyClasses[] = 'im-chat-embedded';
		}

		return empty($bodyClasses) ? '' : '"'. join("', '", $bodyClasses). '"';
	}

	public static function getGoTopButton(): Buttons\Button
	{
		$goTopButton = new Buttons\Button([
			'air' => true,
			'icon' => Buttons\Icon::ANGLE_UP,
			'size' => Buttons\Size::SMALL,
		]);

		$goTopButton->addAttribute('id', 'goTopButton');
		$goTopButton->setStyle(Buttons\AirButtonStyle::OUTLINE);
		$goTopButton->setCollapsed();
		if (method_exists($goTopButton, 'setUniqId'))
		{
			$goTopButton->setUniqId('goTopButton');
		}

		return $goTopButton;
	}

	private static function apply(): void
	{
		if (self::$applied)
		{
			return;
		}

		if (!defined('AIR_SITE_TEMPLATE'))
		{
			define('AIR_SITE_TEMPLATE', true);
		}

		if  (!defined('SITE_TEMPLATE_PATH'))
		{
			define('SITE_TEMPLATE_PATH', '/bitrix/templates/air');
		}

		if (!defined('DEFAULT_COMPONENT_TEMPLATE_ID'))
		{
			define('DEFAULT_COMPONENT_TEMPLATE_ID', 'air');
		}

		self::$applied = true;
	}
}
