<?php

namespace Bitrix\Intranet\Public\Facade\Invitation;

use Bitrix\Intranet\Entity\Collection\DepartmentCollection;
use Bitrix\Intranet\Entity\Collection\UserCollection;
use Bitrix\Intranet\Entity\User;
use Bitrix\Intranet\Enum\LinkEntityType;
use Bitrix\Intranet\Infrastructure\InvitationLinkValidator;
use Bitrix\Intranet\Integration\HumanResources\DepartmentAssigner;
use Bitrix\Intranet\Integration\HumanResources\PermissionInvitation;
use Bitrix\Intranet\Internal\Access\InvitationLinkPermission;
use Bitrix\Intranet\Repository\HrDepartmentRepository;
use Bitrix\Main\AccessDeniedException;
use Bitrix\Main\ArgumentException;
use Bitrix\Main\LoaderException;
use Bitrix\Main\ObjectPropertyException;
use Bitrix\Main\SystemException;

class DepartmentInvitationLinkFacade extends InvitationLinkFacade
{
	private PermissionInvitation $permission;
	private HrDepartmentRepository $departmentRepository;
	private InvitationLinkPermission $linkPermission;

	/**
	 * @throws LoaderException
	 */
	public function __construct(mixed $payload)
	{
		parent::__construct($payload);
		$this->departmentRepository = new HrDepartmentRepository();
		$this->permission = new PermissionInvitation($this->getInvitingUserId());
		$this->linkPermission = new InvitationLinkPermission();
	}

	public function isActual(): bool
	{
		return (new InvitationLinkValidator($this->payload->inviting_user_id, LinkEntityType::USER))
			->validate($this->payload->link_code);
	}

	/**
	 * @throws ObjectPropertyException
	 * @throws SystemException
	 * @throws ArgumentException
	 */
	public function getDepartmentCollection(): DepartmentCollection
	{
		$departmentIds = is_array($this->payload->departments_ids) ? $this->payload->departments_ids : [];

		return $this->departmentRepository->findAllByIds($departmentIds);
	}

	/**
	 * @throws ObjectPropertyException
	 * @throws SystemException
	 * @throws ArgumentException
	 */
	public function filteredByPermissionDepartmentCollection(): DepartmentCollection
	{
		return $this->getDepartmentCollection()
			->filter(fn($department) => $this->permission->canInviteToDepartment($department));
	}

	/**
	 * @throws AccessDeniedException
	 */
	public function checkAccess(): void
	{
		if (!$this->linkPermission->isEnabled())
		{
			throw new AccessDeniedException('Quick registration is disabled.');
		}

		if (!$this->isActual())
		{
			throw new AccessDeniedException('The invitation link is invalid or expired.');
		}

		if ($this->filteredByPermissionDepartmentCollection()->empty())
		{
			throw new AccessDeniedException('You do not have permission to invite users to the selected departments.');
		}
	}

	/**
	 * @throws SystemException
	 */
	protected function afterRegister(User $user): User
	{
		(new DepartmentAssigner($this->filteredByPermissionDepartmentCollection()))->assignUsers(
			new UserCollection($user),
		);

		return $user;
	}

	public function onBeforeUserRegister(array &$data): void
	{
		$data['SITE_ID'] = SITE_ID;
		$data['UF_DEPARTMENT'] = null;
	}

	/**
	 * @throws ObjectPropertyException
	 * @throws SystemException
	 * @throws ArgumentException
	 */
}