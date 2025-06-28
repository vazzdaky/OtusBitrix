<?php

namespace Bitrix\Intranet\Internal\Repository\Mapper;

use Bitrix\Intranet\Entity\User;

class UserMapper
{
	public function convertFromArray(array $userData): User
	{
		$active = null;
		if (!empty($userData['ACTIVE']))
		{
			$active = $userData['ACTIVE'] === 'Y';
		}

		return new User(
			id: $userData['ID'] ?? null,
			login: $userData['LOGIN'] ?? null,
			email: $userData['EMAIL'] ?? null,
			name: $userData['NAME'] ?? null,
			lastName: $userData['LAST_NAME'] ?? null,
			confirmCode: $userData["CONFIRM_CODE"] ?? null,
			groupIds: $userData['GROUP_ID'] ?? null,
			phoneNumber: $userData['PHONE_NUMBER'] ?? null,
			xmlId: $userData['XML_ID'] ?? null,
			active: $active,
			externalAuthId: $userData['EXTERNAL_AUTH_ID'] ?? null,
			authPhoneNumber: $userData['AUTH_PHONE_NUMBER'] ?? null,
			secondName: $userData['SECOND_NAME'] ?? null,
			personalPhoto: $userData['PERSONAL_PHOTO'] ?? null,
			lid: $userData['LID'] ?? null,
			languageId: $userData['LANGUAGE_ID'] ?? null,
			personalMobile: $userData['PERSONAL_MOBILE'] ?? null,
			password: $userData['PASSWORD'] ?? null,
			ufCrmEntity: $userData['UF_USER_CRM_ENTITY'] ?? null
		);
	}

	public function convertToArray(User $user): array
	{
		$userData = [
			'ID' => $user->getId() ?? null,
			'LOGIN' => $user->getLogin() ?? null,
			'EMAIL' => $user->getEmail() ?? null,
			'CONFIRM_CODE' => $user->getConfirmCode() ?? null,
			'NAME' => $user->getName() ?? null,
			'LAST_NAME' => $user->getLastName() ?? null,
			'GROUP_ID' => $user->getGroupIds(),
			'LID' => $user->getLid() ?? null,
			'PERSONAL_PHOTO' => $user->getPersonalPhoto() ?? null,
			'LANGUAGE_ID' => $user->getLanguageId() ?? null,
			'XML_ID' => $user->getXmlId() ?? null,
			'EXTERNAL_AUTH_ID' => $user->getExternalAuthId() ?? null,
			'SECOND_NAME' => $user->getSecondName() ?? null,
			'PASSWORD' => $user->getPassword() ?? null,
			'UF_USER_CRM_ENTITY' => $user->getUfCrmEntity() ?? null,
		];

		if ($user->getPhoneNumber())
		{
			$userData['PHONE_NUMBER'] = $user->getPhoneNumber();
		}

		if ($user->getPersonalMobile())
		{
			$userData['PERSONAL_MOBILE'] = $user->getPersonalMobile();
		}

		if (!is_null($user->getActive()))
		{
			$userData['ACTIVE'] = $user->getActive() ? 'Y' : 'N';
		}

		return $userData;
	}
}