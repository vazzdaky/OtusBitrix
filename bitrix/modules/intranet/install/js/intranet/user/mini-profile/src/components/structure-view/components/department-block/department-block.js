import { BIcon } from 'ui.icon-set.api.vue';
import { Avatar } from 'ui.vue3.components.avatar';

import { OpenActionService } from '../../../../classes/open-action-service';
import { IconSetMixin } from '../../../../mixins/icon-set-mixin';
import { LocMixin } from '../../../../mixins/loc-mixin';

import type { UserData } from '../../../../type';

import './style.css';

// @vue/component
export const DepartmentBlock = {
	name: 'DepartmentBlock',
	components: {
		BIcon,
		Avatar,
	},
	mixins: [LocMixin, IconSetMixin],
	props: {
		nodeId: {
			type: Number,
			required: true,
		},
		highlighted: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		employeeCount: {
			type: Number,
			required: true,
		},
		user: {
			/** @type UserData | null */
			type: [Object, null],
			default: () => {},
		},
		head: {
			/** @type UserData | null */
			type: [Object, null],
			default: () => {},
		},
	},
	computed: {
		employeeCountTitle(): string
		{
			const { employeeCount } = this;

			return this.locPlural('INTRANET_USER_MINI_PROFILE_EMPLOYEES_COUNT', employeeCount, { '#COUNT#': employeeCount });
		},
		isShowHead(): boolean
		{
			const { head, user } = this;

			return head && head.id !== user?.id;
		},
	},
	methods: {
		onTitleClick(): void
		{
			OpenActionService.openStructureNodeId(this.nodeId);
		},
		onUserClick(user: UserData): void
		{
			OpenActionService.openUserProfile(user.url);
		},
	},
	template: `
		<div 
			class="intranet-user-mini-profile__structure-view-department-block"
			:class="{'--highlighted': highlighted }"
		>
			<div class="intranet-user-mini-profile__structure-view-department-block__title"
				 :title="title"
				 @click="onTitleClick"
			>
				<span>{{ title }}</span>
				<div class="intranet-user-mini-profile__structure-view-department-block__title-chevron">
					<div class="intranet-user-mini-profile__structure-view-department-block__title-chevron-icon">
						<BIcon
							:name="outlineSet.CHEVRON_RIGHT_S"
							:size="20"
						/>
					</div>
				</div>
			</div>
			<div class="intranet-user-mini-profile__structure-view-department-block__employee-count">
				{{ employeeCountTitle }}
			</div>
			<div v-if="user"
				class="intranet-user-mini-profile__structure-view-department-block__user"
				@click="onUserClick(user)"
			>
				<div class="intranet-user-mini-profile__structure-view-department-block__user-avatar">
					<Avatar :options="{ picPath: user.avatar, size: 28, title: user.name }"/>
				</div>
				<div class="intranet-user-mini-profile__structure-view-department-block__user-info">
					<div 
						class="intranet-user-mini-profile__structure-view-department-block__user-info__name"
						:title="user.name"
					>
						{{ user.name }}
					</div>
					<div v-if="user.workPosition"
						class="intranet-user-mini-profile__structure-view-department-block__user-info__position"
						:title="user.workPosition"
					>
						{{ user.workPosition }}
					</div>
				</div>
			</div>
			<div v-if="isShowHead" 
				class="intranet-user-mini-profile__structure-view-department-block__head"
			>
				<div class="intranet-user-mini-profile__structure-view-department-block__head-title">
					{{ loc('INTRANET_USER_MINI_DETAILED_INFO_HEAD') }}
				</div>
				<div
					class="intranet-user-mini-profile__structure-view-department-block__head-info"
					@click="onUserClick(head)"
				>
					<div
						class="intranet-user-mini-profile__structure-view-department-block__head-info__avatar"
					>
						<Avatar :options="{ picPath: head.avatar, size: 20, title: head.name }"/>
					</div>
					<div
						class="intranet-user-mini-profile__structure-view-department-block__head-info__name"
						:title="head.name"
					>
						{{ head.name }}
					</div>
				</div>
			</div>
		</div>
	`,
};
