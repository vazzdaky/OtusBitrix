<?php

namespace Bitrix\Crm\RepeatSale;

use Bitrix\Bitrix24\Feature;
use Bitrix\Crm\Traits\Singleton;
use Bitrix\Main\Event;

class AgentsManager
{
	use Singleton;

	public const SCHEDULER_AGENT_NAME = 'Bitrix\\Crm\\Agent\\RepeatSale\\SchedulerAgent::run();';
	public const JOB_EXECUTOR_AGENT_NAME = 'Bitrix\\Crm\\Agent\\RepeatSale\\JobExecutorAgent::run();';

	private const AGENT_NAMES = [
		self::SCHEDULER_AGENT_NAME,
		self::JOB_EXECUTOR_AGENT_NAME,
	];

	protected \CAgent $cAgent;

	public static function onLicenseHasChanged(Event $event): void
	{
		$licenseType = $event->getParameter('licenseType');

		if ($licenseType === null)
		{
			return;
		}

		$agentsManager = new self();
		if (Feature::isFeatureEnabledFor('crm_repeat_sale', $licenseType))
		{
			$agentsManager->enableAgents();
		}
		else
		{
			$agentsManager->disableAgents();
		}
	}

	protected function __construct()
	{
		$this->cAgent = new \CAgent();
	}

	public function addAgents(): void
	{
		$agents = $this->getList();

		if (!isset($agents[self::SCHEDULER_AGENT_NAME]))
		{
			/**
			 * @see \Bitrix\Crm\Agent\RepeatSale\SchedulerAgent
			 */
			$this->cAgent::AddAgent(
				'\\Bitrix\\Crm\\Agent\\RepeatSale\\SchedulerAgent::run();',
				'crm',
				'Y',
				3600 * 4,
				'',
				'Y',
				\ConvertTimeStamp(time() + \CTimeZone::GetOffset() + 10, 'FULL'),
			);
		}

		if (!isset($agents[self::JOB_EXECUTOR_AGENT_NAME]))
		{
			/**
			 * @see \Bitrix\Crm\Agent\RepeatSale\JobExecutorAgent
			 */
			$this->cAgent::AddAgent(
				'\\Bitrix\\Crm\\Agent\\RepeatSale\\JobExecutorAgent::run();',
				'crm',
				'Y',
				60, // @todo set correct interval
				'',
				'Y',
				\ConvertTimeStamp(time() + \CTimeZone::GetOffset() + 80, 'FULL'),
			);
		}
	}

	public function enableAgents(): void
	{
		$fields = ['ACTIVE' => 'Y'];
		$this->updateAgents($fields);
	}

	public function disableAgents(): void
	{
		$fields = ['ACTIVE' => 'N'];
		$this->updateAgents($fields);
	}

	private function updateAgents(array $fields): void
	{
		$agents = $this->getList();

		foreach ($agents as $agent)
		{
			$this->cAgent::Update($agent['ID'], $fields);
		}
	}

	private function getList(): array
	{
		$result = [];
		foreach (self::AGENT_NAMES as $agentName)
		{
			$data = $this->getAgentDataByName($agentName);
			if (empty($data))
			{
				continue;
			}

			$result[$data['NAME']] = $data;
		}

		return $result;
	}

	private function getAgentDataByName(string $agentName): array
	{
		$res = $this->cAgent::GetList([], ['=NAME' => $agentName]);
		if ($agent = $res->Fetch())
		{
			return $agent;
		}

		return [];
	}
}
