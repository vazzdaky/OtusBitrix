<?php

declare(strict_types=1);

namespace Bitrix\Tasks\Deadline\Entity;

use Bitrix\Main\Type\DateTime;
use Bitrix\Main\Validation\Rule\Max;
use Bitrix\Main\Validation\Rule\Min;
use Bitrix\Tasks\Deadline\Configuration;
use Bitrix\Tasks\Deadline\SkipNotificationPeriod;
use Bitrix\Tasks\Integration\Calendar\Calendar;
use Bitrix\Tasks\V2\Entity\AbstractEntity;

class DeadlineUserOption extends AbstractEntity
{
	private const SECONDS_IN_DAY = 60 * 60 * 24;
	private const SECONDS_IN_WEEK = self::SECONDS_IN_DAY * 7;
	private const SECONDS_IN_MONTH = self::SECONDS_IN_DAY * 31;

	public ?int $id = null;

	public function __construct(
		#[Min(0)]
		public int $userId,
		#[Min(0)]
		#[Max(Configuration::MAX_DEFAULT_DEADLINE_IN_SECONDS)]
		public int $defaultDeadlineInSeconds = 0,
		public bool $isExactDeadlineTime = false,
		public SkipNotificationPeriod $skipNotificationPeriod = SkipNotificationPeriod::DEFAULT,
		public ?DateTime $skipNotificationStartDate = null,
	)
	{
	}

	public function getDefaultDeadlineDate(
		bool $matchWorkTime = false,
		DateTime $originalDate = new DateTime(),
	): ?DateTime
	{
		if ($this->defaultDeadlineInSeconds === 0)
		{
			return null;
		}

		$calendar = Calendar::createFromPortalSchedule();
		$schedule = $calendar->getSchedule();

		$date = $originalDate->toUserTime();

		$closestDate = $calendar->getClosestDate(
			date: $date,
			offsetInSeconds: $this->defaultDeadlineInSeconds,
			matchSchedule: $this->isExactDeadlineTime && $matchWorkTime,
			matchWorkTime: $matchWorkTime,
		);

		return ($this->isExactDeadlineTime) ? $closestDate : $schedule->getShiftEnd($closestDate);
	}

	public function getNotificationSkipPeriod(): SkipNotificationPeriod
	{
		if (!$this->isNotificationSkipped())
		{
			return SkipNotificationPeriod::DEFAULT;
		}

		return $this->skipNotificationPeriod;
	}

	public function isNotificationSkipped(): bool
	{
		if ($this->skipNotificationPeriod === SkipNotificationPeriod::DEFAULT)
		{
			return false;
		}
		if ($this->skipNotificationPeriod === SkipNotificationPeriod::FOREVER)
		{
			return true;
		}

		$startDate = $this->skipNotificationStartDate;

		$now = new DateTime();

		$secondsPassed = $now->getTimestamp() - $startDate->getTimestamp();

		return match ($this->skipNotificationPeriod)
		{
			SkipNotificationPeriod::DAY =>
				$startDate->format('j') === $now->format('j')
				&& $secondsPassed < self::SECONDS_IN_DAY,

			SkipNotificationPeriod::WEEK =>
				$startDate->format('W') === $now->format('W')
				&& $secondsPassed < self::SECONDS_IN_WEEK,

			SkipNotificationPeriod::MONTH =>
				$startDate->format('n') === $now->format('n')
				&& $secondsPassed < self::SECONDS_IN_MONTH,

			default => false,
		};
	}

	public function toArray(): array
	{
		$matchWorkTime = true; // by default true, todo: will be replaced by the special option

		return [
			'id' => $this->id,
			'userId' => $this->userId,
			'defaultDeadlineInSeconds' => $this->defaultDeadlineInSeconds,
			'isExactDeadlineTime' => $this->isExactDeadlineTime,
			'skipNotificationPeriod' => $this->skipNotificationPeriod->value,
			'skipNotificationStartDate' => $this->skipNotificationStartDate,
			'defaultDeadlineDate' => $this->getDefaultDeadlineDate($matchWorkTime)
				?->format('Y-m-d H:i'),
		];
	}

	public static function mapFromArray(array $props): static
	{
		$deadlineUserOption = new self(
			(int)($props['userId'] ?? 0),
			(int)($props['defaultDeadlineInSeconds'] ?? 0),
			(bool)($props['isExactDeadlineTime'] ?? false),
			SkipNotificationPeriod::tryFrom($props['skipNotificationPeriod'] ?? ''),
			$props['skipNotificationStartDate'] ?? null,
		);

		if (isset($props['id']))
		{
			$deadlineUserOption->id = (int)$props['id'];
		}

		return $deadlineUserOption;
	}

	public function getId(): ?int
	{
		return $this->id;
	}
}
