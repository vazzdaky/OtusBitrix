<?php

namespace Bitrix\HumanResources\Type;

use Bitrix\HumanResources\Access\Permission\PermissionDictionary;
use Bitrix\HumanResources\Access\StructureActionDictionary;
use Bitrix\HumanResources\Item\Access\AccessInfo;
use Bitrix\HumanResources\Internals\Trait\ValuesTrait;
/**
 * Enumerations used for validating actions related to structure nodes
 */
enum StructureAction: string
{
	case ViewAction = 'view';
	case CreateAction = 'create';
	case UpdateAction = 'update';
	case DeleteAction = 'delete';
	case AddMemberAction = 'addMember';
	case RemoveMemberAction = 'removeMember';
	case InviteUserAction = 'inviteUser';
	case EditSettingsAction = 'editSettings';

	use ValuesTrait;

	/**
	 * returns action and permissions ids which are used by the StructureAccessController
	 *
	 * @param NodeEntityType $nodeEntityType
	 *
	 * @return AccessInfo
	 */
	public function getAccessInfoByEntityType(NodeEntityType $nodeEntityType = NodeEntityType::DEPARTMENT): AccessInfo
	{
		return match ($nodeEntityType)
		{
			NodeEntityType::DEPARTMENT => $this->getDepartmentAccessInfo(),
			NodeEntityType::TEAM => $this->getTeamAccessInfo(),
			default => throw new \InvalidArgumentException('Invalid node entity type.'),
		};
	}

	private function getDepartmentAccessInfo(): AccessInfo
	{
		return match ($this)
		{
			self::ViewAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_STRUCTURE_VIEW,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_STRUCTURE_VIEW,
			),
			self::CreateAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_DEPARTMENT_CREATE,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_DEPARTMENT_CREATE,
			),
			self::UpdateAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_USERS_ACCESS_EDIT,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_DEPARTMENT_EDIT,
			),
			self::DeleteAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_DEPARTMENT_DELETE,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_DEPARTMENT_DELETE,
			),
			self::AddMemberAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_EMPLOYEE_ADD_TO_DEPARTMENT,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_EMPLOYEE_ADD_TO_DEPARTMENT,
			),
			self::RemoveMemberAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_EMPLOYEE_REMOVE_FROM_DEPARTMENT,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_EMPLOYEE_REMOVE_FROM_DEPARTMENT,
			),
			self::InviteUserAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_USER_INVITE,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_USER_INVITE,
			),
			default => throw new \InvalidArgumentException('Unavailable structure action for department'),
		};
	}

	private function getTeamAccessInfo(): AccessInfo
	{
		return match ($this)
		{
			self::ViewAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_VIEW,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_VIEW,
			),
			self::CreateAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_CREATE,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_CREATE,
			),
			self::UpdateAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_EDIT,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_EDIT,
			),
			self::DeleteAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_DELETE,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_DELETE,
			),
			self::AddMemberAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_MEMBER_ADD,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_MEMBER_ADD,
			),
			self::RemoveMemberAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_MEMBER_REMOVE,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_MEMBER_REMOVE,
			),
			self::EditSettingsAction => new AccessInfo(
				actionId: StructureActionDictionary::ACTION_TEAM_SETTINGS_EDIT,
				permissionId: PermissionDictionary::HUMAN_RESOURCES_TEAM_SETTINGS_EDIT,
			),
			default => throw new \InvalidArgumentException('Unavailable structure action for team'),
		};
	}
}