import { Type } from 'main.core';
import type { PopupOptions } from 'main.popup';

import { Item } from 'ui.entity-selector';
import { BMenu, MenuItemDesign, type MenuOptions, type MenuItemOptions } from 'ui.vue3.components.menu';
import { Popup } from 'ui.vue3.components.popup';
import { BIcon } from 'ui.icon-set.api.vue';
import { Outline } from 'ui.icon-set.api.core';
import 'ui.icon-set.outline';

import { EntitySelectorEntity, Model } from 'tasks.v2.const';
import { UserSelectorDialog } from 'tasks.v2.lib.user-selector-dialog';
import { heightTransition } from 'tasks.v2.lib.height-transition';
import { hrefClick } from 'tasks.v2.lib.href-click';
import { userService } from 'tasks.v2.provider.service.user-service';
import type { TaskModel } from 'tasks.v2.model.tasks';
import type { UserModel } from 'tasks.v2.model.users';
import type { ItemId } from 'tasks.v2.lib.entity-selector-dialog';
import { UserAvatarListUsers } from 'tasks.v2.component.elements.user-avatar-list';

import { participantMeta } from './participant-meta';
import './participant-list.css';

const maxUsers = 4;

// @vue/component
export const ParticipantList = {
	name: 'TaskParticipantList',
	components: {
		BIcon,
		UserAvatarListUsers,
		BMenu,
		Popup,
	},
	props: {
		taskId: {
			type: [Number, String],
			required: true,
		},
		dataset: {
			type: Object,
			required: true,
		},
		context: {
			type: String,
			required: true,
		},
		users: {
			type: Array,
			required: true,
		},
	},
	emits: ['update'],
	setup(): Object
	{
		return {
			Outline,
		};
	},
	data(): Object
	{
		return {
			menuUserId: null,
			addBackgroundHovered: false,
			isDialogShown: false,
			isPopupShown: false,
		};
	},
	computed: {
		task(): TaskModel
		{
			return this.$store.getters[`${Model.Tasks}/getById`](this.taskId);
		},
		withActionMenu(): boolean
		{
			return Type.isNumber(this.taskId) && this.taskId > 0;
		},
		testId(): string
		{
			return `${this.$options.name}-${this.context}-${this.taskId}`;
		},
		popupOptions(): Function
		{
			return (): PopupOptions => ({
				id: 'tasks-participant-list-more-popup',
				bindElement: this.$refs.more,
				padding: 18,
				maxWidth: 300,
				maxHeight: window.innerHeight / 2 - 40,
				offsetTop: 8,
				offsetLeft: -18,
				targetContainer: document.body,
			});
		},
		menuOptions(): MenuOptions
		{
			const userId = this.menuUserId;

			return {
				id: 'tasks-participant-list-menu-user',
				bindElement: this.$refs.userList.getNode(userId) ?? this.$refs.popupUserList.getNode(userId),
				items: this.getMenuItems(userId),
				offsetTop: 8,
				targetContainer: document.body,
			};
		},
		moreFormatted(): string
		{
			return this.loc('TASKS_V2_PARTICIPANT_LIST_MORE_COUNT', {
				'#COUNT#': this.popupUsers.length,
			});
		},
		displayedUsers(): UserModel[]
		{
			return this.users.slice(0, maxUsers - (this.usersLength > maxUsers));
		},
		popupUsers(): UserModel[]
		{
			return this.users.slice(maxUsers - (this.usersLength > maxUsers));
		},
		usersLength(): number
		{
			return this.users.length;
		},
		readonly(): boolean
		{
			return !this.task.rights.edit;
		},
	},
	watch: {
		usersLength(): void
		{
			if (this.popupUsers.length === 0)
			{
				this.isPopupShown = false;
			}
		},
	},
	mounted(): void
	{
		heightTransition.animate(this.$el);
	},
	updated(): void
	{
		heightTransition.animate(this.$el);
	},
	beforeUnmount(): void
	{
		this.selector?.destroy();
	},
	methods: {
		handleClick(userId: number): void
		{
			if (this.readonly)
			{
				hrefClick(userService.getUrl(userId));

				return;
			}

			if (this.withActionMenu)
			{
				this.showMenu(userId);
			}
			else
			{
				this.showDialog();
			}
		},
		showMenu(userId: number): void
		{
			if (this.menuUserId !== userId)
			{
				setTimeout((): void => {
					this.menuUserId = userId;
				});
			}
		},
		showDialog(): void
		{
			if (this.selector?.getDialog().isOpen())
			{
				return;
			}

			this.selector ??= this.createDialog();
			this.selector.selectItemsByIds(this.getPreselected(this.users));

			this.selector.show(window.innerHeight < 700 ? this.$refs.anchor : this.$refs.users);
		},
		createDialog(): UserSelectorDialog
		{
			const dialog = new UserSelectorDialog({
				taskId: this.taskId,
				preselected: this.getPreselected(this.users),
				dialogOptions: {
					...participantMeta.dialogOptions(this.taskId, this.context),
					height: window.innerHeight / 2 - 80,
				},
			});

			dialog.getDialog().getPopup().subscribeFromOptions({
				onShow: (): void => {
					this.isDialogShown = true;
				},
				onClose: (): void => {
					this.isDialogShown = false;
					if (dialog.getDialog().isLoaded())
					{
						this.updateUsers(this.getSelectedUsers());
					}
				},
			});

			return dialog;
		},
		getSelectedUsers(): UserModel[]
		{
			return this.selector.getDialog().getSelectedItems().map((item: Item) => ({
				id: item.getId(),
				name: item.getTitle(),
				image: item.getAvatar(),
			}));
		},
		getMenuItems(userId: number): MenuItemOptions[]
		{
			return [
				{
					title: this.loc('TASKS_V2_PARTICIPANT_LIST_USER_MENU_PROFILE'),
					icon: Outline.PERSON,
					dataset: {
						id: `UserMenuProfile-${this.testId}`,
					},
					onClick: (): void => hrefClick(userService.getUrl(userId)),
				},
				{
					design: MenuItemDesign.Alert,
					title: this.loc('TASKS_V2_PARTICIPANT_LIST_USER_MENU_REMOVE'),
					icon: Outline.TRASHCAN,
					dataset: {
						id: `UserMenuRemove-${this.testId}`,
					},
					onClick: (): void => this.removeUser(userId),
				},
			];
		},
		removeUser(userId: number): void
		{
			const isSelectorShown = this.selector?.getDialog().isOpen();
			const users = isSelectorShown ? this.getSelectedUsers() : this.users;
			const usersWithoutRemoved = users.filter(({ id }) => id !== userId);
			if (isSelectorShown)
			{
				this.selector.selectItemsByIds(this.getPreselected(usersWithoutRemoved));
			}

			this.updateUsers(usersWithoutRemoved);
		},
		updateUsers(users: UserModel[]): void
		{
			this.$emit('update', users);
		},
		getPreselected(users: UserModel[]): ItemId[]
		{
			return users.map(({ id }) => [EntitySelectorEntity.User, id]);
		},
	},
	template: `
		<div class="tasks-field-participant-list" v-bind="dataset" ref="users">
			<div v-if="usersLength > 0" class="tasks-field-users">
				<div
					v-if="!readonly"
					class="tasks-field-users-add-background"
					@click="showDialog"
					@mouseenter="addBackgroundHovered = true"
					@mouseleave="addBackgroundHovered = false"
				></div>
				<UserAvatarListUsers
					:users="displayedUsers"
					:withCross="!withActionMenu"
					ref="userList"
					@onClick="(userId) => handleClick(userId)"
					@onCrossClick="(userId) => removeUser(userId)"
				>
					<template #addButton>
						<BIcon
							class="tasks-field-user-add"
							:class="{ '--active': addBackgroundHovered || isDialogShown }"
							:name="Outline.PLUS_L"
							@click="showDialog"
						/>
					</template>
				</UserAvatarListUsers>
				<div
					v-if="popupUsers.length > 0"
					class="tasks-field-participant-list-more"
					ref="more"
					@click="isPopupShown = true"
				>
					{{ moreFormatted }}
				</div>
			</div>
			<div v-else class="tasks-field-participant-list-empty" @click="showDialog">
				<BIcon :name="Outline.PERSON"/>
				<div class="tasks-field-participant-list-empty-text">
					{{ loc('TASKS_V2_PARTICIPANT_LIST_ADD') }}
				</div>
			</div>
			<div class="tasks-field-participant-list-anchor" ref="anchor"></div>
		</div>
		<BMenu v-if="menuUserId" :options="menuOptions" @close="menuUserId = null"/>
		<Popup
			v-if="isPopupShown"
			:options="popupOptions()"
			@close="isPopupShown = false"
		>
			<div class="tasks-field-users --popup">
				<UserAvatarListUsers
					:users="popupUsers"
					:withCross="!withActionMenu"
					ref="popupUserList"
					@onClick="(userId) => handleClick(userId)"
					@onCrossClick="(userId) => removeUser(userId)"
				/>
			</div>
		</Popup>
	`,
};
