/**
 * @module im/messenger/controller/sidebar-v2/controller/group-chat
 */
jn.define('im/messenger/controller/sidebar-v2/controller/group-chat', (require, exports, module) => {
	const { Loc } = require('im/messenger/controller/sidebar-v2/loc');
	const { SidebarBaseController } = require('im/messenger/controller/sidebar-v2/controller/base');
	const { GroupChatSidebarView } = require('im/messenger/controller/sidebar-v2/controller/group-chat/src/view');
	const { SidebarLinksTab } = require('im/messenger/controller/sidebar-v2/tabs/links');
	const { SidebarFilesTab } = require('im/messenger/controller/sidebar-v2/tabs/files');
	const { SidebarAudioTab } = require('im/messenger/controller/sidebar-v2/tabs/audio');
	const { SidebarMediaTab } = require('im/messenger/controller/sidebar-v2/tabs/media');
	const { SidebarParticipantsTab } = require('im/messenger/controller/sidebar-v2/tabs/participants');
	const {
		SidebarContextMenuActionId,
		SidebarContextMenuActionPosition,
	} = require('im/messenger/controller/sidebar-v2/const');
	const { Icon } = require('assets/icons');
	const { onAddParticipants } = require('im/messenger/controller/sidebar-v2/user-actions/participants');
	const { onLeaveChat } = require('im/messenger/controller/sidebar-v2/user-actions/user');
	const { onDeleteChat } = require('im/messenger/controller/sidebar-v2/user-actions/chat');
	const {
		createSearchButton,
		createMuteButton,
		createVideoCallButton,
		createAudioCallButton,
		createAutoDeleteButton,
	} = require('im/messenger/controller/sidebar-v2/ui/primary-button/factory');


	class GroupChatSidebarController extends SidebarBaseController
	{
		createView(defaultProps)
		{
			return new GroupChatSidebarView(defaultProps);
		}

		getWidgetTitle()
		{
			return Loc.getMessage('IMMOBILE_SIDEBAR_V2_COMMON_CHAT_TITLE');
		}

		// region context menu

		getHeaderContextMenuItems()
		{
			return [
				{
					id: SidebarContextMenuActionId.ADD_PARTICIPANTS,
					title: Loc.getMessage('IMMOBILE_SIDEBAR_V2_COMMON_ACTION_ADD_PARTICIPANTS'),
					icon: Icon.ADD_PERSON,
					testId: 'sidebar-context-menu-add-participants',
					sort: SidebarContextMenuActionPosition.MIDDLE,
					onItemSelected: () => {
						onAddParticipants({
							dialogId: this.dialogId,
							store: this.store,
						}).catch((error) => {
							this.logger.error('onAddParticipants', error);
						});
					},
				},
				...super.getHeaderContextMenuItems(),
			];
		}

		handleDeleteDialogAction()
		{
			onDeleteChat(this.dialogId);
		}

		async handleEditDialogAction()
		{
			this.logger.info('handleEditDialogAction');
			const { UpdateGroupChat } = await requireLazy('im:messenger/controller/chat-composer');

			try
			{
				new UpdateGroupChat({ dialogId: this.dialogId, parentWidget: this.widget }).openGroupChatView();
				this.analyticsService.sendDialogEditHeaderMenuClick(this.dialogId);
			}
			catch (error)
			{
				this.logger.error('handleEditDialogAction', error);
			}
		}

		handleLeaveDialogAction()
		{
			onLeaveChat(this.dialogId);
		}

		// endregion

		// region primary actions

		/**
		 * @return {SidebarPrimaryActionButton[]}
		 */
		getPrimaryActionButtons()
		{
			const muted = this.dialogHelper.isMuted;

			return [
				createVideoCallButton({
					onClick: () => this.handleVideoCallAction(),
					disabled: !this.permissionManager.canCall(),
				}),
				createAudioCallButton({
					onClick: () => this.handleAudioCallAction(),
					disabled: !this.permissionManager.canCall(),
				}),
				createSearchButton({
					onClick: () => this.handleSearchAction(),
				}),
				createMuteButton({
					onClick: () => this.handleToggleMuteAction(),
					muted,
				}),
				!this.dialogHelper.isGeneral && createAutoDeleteButton({
					onClick: (ref) => this.handleToggleAutoDeleteAction(ref),
					selected: this.dialogHelper.isMessagesAutoDeleteDelayEnabled,
				}),
			];
		}

		// endregion

		// region tabs

		createTabs()
		{
			const props = this.getTabsProps();

			return [
				new SidebarParticipantsTab(props),
				new SidebarMediaTab(props),
				new SidebarFilesTab(props),
				new SidebarLinksTab(props),
				new SidebarAudioTab(props),
			];
		}

		// endregion
	}

	module.exports = {
		GroupChatSidebarController,
		ControllerClass: GroupChatSidebarController,
	};
});
