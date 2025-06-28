<?php

namespace Bitrix\HumanResources\Access\Role\System;

use Bitrix\HumanResources\Access\Permission\PermissionDictionary;
use Bitrix\HumanResources\Access\Permission\PermissionVariablesDictionary;

class Employee extends Base
{
	public function getPermissions(): array
	{
		return [
			PermissionDictionary::HUMAN_RESOURCES_STRUCTURE_VIEW => PermissionVariablesDictionary::VARIABLE_ALL,
			PermissionDictionary::HUMAN_RESOURCES_DEPARTMENT_CREATE => PermissionVariablesDictionary::VARIABLE_NONE,
			PermissionDictionary::HUMAN_RESOURCES_DEPARTMENT_DELETE => PermissionVariablesDictionary::VARIABLE_NONE,
			PermissionDictionary::HUMAN_RESOURCES_DEPARTMENT_EDIT => PermissionVariablesDictionary::VARIABLE_NONE,
			PermissionDictionary::HUMAN_RESOURCES_EMPLOYEE_ADD_TO_DEPARTMENT => PermissionVariablesDictionary::VARIABLE_NONE,
			PermissionDictionary::HUMAN_RESOURCES_EMPLOYEE_REMOVE_FROM_DEPARTMENT => PermissionVariablesDictionary::VARIABLE_NONE,
			PermissionDictionary::HUMAN_RESOURCES_USER_INVITE => PermissionVariablesDictionary::VARIABLE_NONE,

			PermissionDictionary::HUMAN_RESOURCES_USERS_ACCESS_EDIT => PermissionVariablesDictionary::VARIABLE_NONE,
			PermissionDictionary::HUMAN_RESOURCES_FIRE_EMPLOYEE => PermissionVariablesDictionary::VARIABLE_NONE,
		];
	}
}