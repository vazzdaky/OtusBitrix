<?php

declare(strict_types=1);

namespace Bitrix\Tasks\V2\Internals;

use Bitrix\Tasks\Deadline\Internals\Repository\DeadlineUserOptionRepositoryInterface;
use Bitrix\Tasks\DI\AbstractContainer;
use Bitrix\Tasks\Internals\Registry\TaskRegistry;
use Bitrix\Tasks\Provider\Log\TaskLogProvider;
use Bitrix\Tasks\V2\Access\Factory\ControllerFactoryInterface;
use Bitrix\Tasks\V2\Access\Service\TaskAccessService;
use Bitrix\Tasks\V2\Access\Service\TaskRightService;
use Bitrix\Tasks\V2\Internals\Consistency\ConsistencyResolverInterface;
use Bitrix\Tasks\V2\Internals\Repository\ChatRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\ElapsedTimeRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\FavoriteTaskRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\FlowRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\GroupRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\Mapper\ElapsedTimeMapper;
use Bitrix\Tasks\V2\Internals\Repository\Mapper\OrmTaskMapper;
use Bitrix\Tasks\V2\Internals\Repository\TimerRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\PlannerRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\StageRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\TaskMemberRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\TaskRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\TaskUserFieldsRepository;
use Bitrix\Tasks\V2\Internals\Repository\TemplateRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Repository\UserOptionRepositoryInterface;
use Bitrix\Tasks\V2\Internals\Service\AutomationService;
use Bitrix\Tasks\V2\Internals\Service\CheckList\CheckListService;
use Bitrix\Tasks\V2\Internals\Service\CheckList\Prepare\Save\CheckListEntityFieldService;
use Bitrix\Tasks\V2\Internals\Service\Esg\EgressInterface;
use Bitrix\Tasks\V2\Internals\Service\Link\LinkService;
use Bitrix\Tasks\V2\Internals\Service\TariffService;
use Bitrix\Tasks\V2\Internals\Service\Task\AddService;
use Bitrix\Tasks\V2\Internals\Service\Task\DeleteService;
use Bitrix\Tasks\V2\Internals\Service\Task\ElapsedTimeService;
use Bitrix\Tasks\V2\Internals\Service\Task\FavoriteService;
use Bitrix\Tasks\V2\Internals\Service\PushService;
use Bitrix\Tasks\V2\Internals\Service\Task\MemberService;
use Bitrix\Tasks\V2\Internals\Service\Task\PlannerService;
use Bitrix\Tasks\V2\Internals\Service\Task\ResultService;
use Bitrix\Tasks\V2\Internals\Repository\Compatibility;
use Bitrix\Tasks\V2\Internals\Service\Task\StatusService;
use Bitrix\Tasks\V2\Internals\Service\Task\TimeManagementService;
use Bitrix\Tasks\V2\Internals\Service\Task\TimerService;
use Bitrix\Tasks\V2\Internals\Service\Task\UpdateService;
use Bitrix\Tasks\V2\Internals\Service\Task\UserOptionService;
use Bitrix\Tasks\V2\Internals\Service\Task\ViewService;
use Bitrix\Tasks\V2\Provider\TaskProvider;

class Container extends AbstractContainer
{
	public function getDeleteService(): DeleteService
	{
		return $this->getRuntimeObjectWithDi(DeleteService::class);
	}

	public function getAddService(): AddService
	{
		return $this->getRuntimeObjectWithDi(AddService::class);
	}

	public function getCheckListEntityFieldService(): CheckListEntityFieldService
	{
		return $this->getRuntimeObjectWithDi(CheckListEntityFieldService::class);
	}

	public function getCheckListService(): CheckListService
	{
		return $this->getRuntimeObjectWithDi(CheckListService::class);
	}

	public function getTariffService(): TariffService
	{
		return $this->getRuntimeObjectWithDi(TariffService::class);
	}

	public function getViewService(): ViewService
	{
		return $this->getRuntimeObjectWithDi(ViewService::class);
	}

	public function getLinkService(): LinkService
	{
		return $this->getRuntimeObjectWithDi(LinkService::class);
	}

	public function getMemberService(): MemberService
	{
		return $this->getRuntimeObjectWithDi(MemberService::class);
	}

	public function getTimeManagementService(): TimeManagementService
	{
		return $this->getRuntimeObjectWithDi(TimeManagementService::class);
	}

	public function getPlannerService(): PlannerService
	{
		return $this->getRuntimeObjectWithDi(PlannerService::class);
	}

	public function getPlannerRepository(): PlannerRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(PlannerRepositoryInterface::class);
	}

	public function getTimerService(): TimerService
	{
		return $this->getRuntimeObjectWithDi(TimerService::class);
	}

	public function getTimerRepository(): TimerRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(TimerRepositoryInterface::class);
	}

	public function getOrmTaskMapper(): OrmTaskMapper
	{
		return $this->getRuntimeObjectWithDi(OrmTaskMapper::class);
	}

	public function getDeadlineRepository(): DeadlineUserOptionRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(DeadlineUserOptionRepositoryInterface::class);
	}

	public function getStageRepository(): StageRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(StageRepositoryInterface::class);
	}

	public function getTaskRuleService(): TaskRightService
	{
		return $this->getRuntimeObjectWithDi(TaskRightService::class);
	}

	public function getTaskAccessService(): TaskAccessService
	{
		return $this->getRuntimeObjectWithDi(TaskAccessService::class);
	}

	public function getUserOptionRepository(): UserOptionRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(UserOptionRepositoryInterface::class);
	}

	public function getUserOptionService(): UserOptionService
	{
		return $this->getRuntimeObjectWithDi(UserOptionService::class);
	}

	public function getElapsedTimeMapper(): ElapsedTimeMapper
	{
		return $this->getRuntimeObjectWithDi(ElapsedTimeMapper::class);
	}

	public function getElapsedTimeService(): ElapsedTimeService
	{
		return $this->getRuntimeObjectWithDi(ElapsedTimeService::class);
	}

	public function getElapsedTimeRepository(): ElapsedTimeRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(ElapsedTimeRepositoryInterface::class);
	}

	public function getStatusService(): StatusService
	{
		return $this->getRuntimeObjectWithDi(StatusService::class);
	}

	public function getUpdateService(): UpdateService
	{
		return $this->getRuntimeObjectWithDi(UpdateService::class);
	}

	public function getFavoriteService(): FavoriteService
	{
		return $this->getRuntimeObjectWithDi(FavoriteService::class);
	}

	public function getTaskMemberRepository(): TaskMemberRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(TaskMemberRepositoryInterface::class);
	}

	public function getTaskCompatabilityRepository(): Compatibility\TaskRepository
	{
		return $this->getRegisteredObject(Compatibility\TaskRepository::class);
	}

	public function getFavoriteTaskRepository(): FavoriteTaskRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(FavoriteTaskRepositoryInterface::class);
	}

	public function getTaskLogProvider(): TaskLogProvider
	{
		return $this->getRegisteredObject(TaskLogProvider::class);
	}

	public function getAccessControllerFactory(): ControllerFactoryInterface
	{
		return $this->getRegisteredObject('tasks.access.controller.factory');
	}

	public function getTaskRepository(): TaskRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(TaskRepositoryInterface::class);
	}

	public function getRegistry(): TaskRegistry
	{
		return $this->getRegisteredObject('tasks.task.registry');
	}

	public function getGroupRepository(): GroupRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(GroupRepositoryInterface::class);
	}

	public function getFlowRepository(): FlowRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(FlowRepositoryInterface::class);
	}

	public function getTemplateRepository(): TemplateRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(TemplateRepositoryInterface::class);
	}

	public function getEgressController(): EgressInterface
	{
		return $this->getRuntimeObjectWithDi(EgressInterface::class);
	}

	public function getChatRepository(): ChatRepositoryInterface
	{
		return $this->getRuntimeObjectWithDi(ChatRepositoryInterface::class);
	}

	public function getResultService(): ResultService
	{
		return $this->getRuntimeObjectWithDi(ResultService::class);
	}

	public function getConsistencyResolver(): ConsistencyResolverInterface
	{
		return $this->getRuntimeObjectWithDi(ConsistencyResolverInterface::class);
	}

	public function getPushService(): PushService
	{
		return $this->getRuntimeObjectWithDi(PushService::class);
	}

	public function getAutomationService(): AutomationService
	{
		return $this->getRuntimeObjectWithDi(AutomationService::class);
	}

	public function getTaskUserFieldsRepository(): TaskUserFieldsRepository
	{
		return $this->getRuntimeObjectWithDi(TaskUserFieldsRepository::class);
	}

	public function getTaskProvider(): TaskProvider
	{
		return $this->getRuntimeObjectWithDi(TaskProvider::class);
	}
}
