import { sendData, type AnalyticsOptions } from 'ui.analytics';
import { FileOrigin } from 'ui.uploader.core';

import { Core } from 'tasks.v2.core';
import { Analytics, CardType } from 'tasks.v2.const';
import type { AnalyticsParams } from 'tasks.v2.application.task-card';

export const analytics = new class
{
	sendOpenCard(params: AnalyticsParams, options: {
		collabId: number,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.ClickCreate,
			type: Analytics.Type.TaskMini,
			c_section: params.context,
			c_sub_section: params.additionalContext,
			c_element: params.element,
			status: Analytics.Status.Success,
			p2: Core.getParams().analytics.userType,
			...(options.collabId ? { p4: Analytics.Params.CollabId(options.collabId) } : {}),
		});
	}

	sendOpenFullCard(params: AnalyticsParams): void
	{
		this.#sendData({
			event: Analytics.Event.FillTaskFormView,
			type: Analytics.Type.TaskMini,
			c_section: params.context,
			c_sub_section: Analytics.SubSection.Full,
			c_element: Analytics.Element.FullFormButton,
			status: Analytics.Status.Success,
		});
	}

	sendAddTask(params: AnalyticsParams, options: {
		isSuccess: boolean,
		collabId: number,
		viewersCount: number,
		coexecutorsCount: number,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.TaskCreate,
			type: Analytics.Type.TaskMini,
			c_section: params.context,
			c_sub_section: params.additionalContext,
			c_element: params.element,
			status: options.isSuccess ? Analytics.Status.Success : Analytics.Status.Error,
			p2: Core.getParams().analytics.userType,
			p3: Analytics.Params.ViewersCount(options.viewersCount),
			...(options.collabId ? { p4: Analytics.Params.CollabId(options.collabId) } : {}),
			p5: Analytics.Params.CoexecutorsCount(options.coexecutorsCount),
		});
	}

	sendAddTaskWithCheckList(params: AnalyticsParams, options: {
		isSuccess: boolean,
		collabId: number,
		viewersCount: number,
		checklistCount: number,
		checklistItemsCount: number,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.TaskCreateWithChecklist,
			type: Analytics.Type.TaskMini,
			c_section: params.context,
			c_sub_section: params.additionalContext,
			c_element: params.element,
			status: Analytics.Status.Success,
			p2: Core.getParams().analytics.userType,
			p3: Analytics.Params.ViewersCount(options.viewersCount),
			...(options.collabId ? { p4: Analytics.Params.CollabId(options.collabId) } : {}),
			p5: Analytics.Params.ChecklistCount(options.checklistCount, options.checklistItemsCount),
		});
	}

	sendDescription(params: AnalyticsParams, options: {
		hasDescription: boolean,
		hasScroll: boolean,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.DescriptionTask,
			type: Analytics.Type.TaskMini,
			c_section: params.context,
			c_sub_section: Analytics.SubSection.TaskCard,
			status: Analytics.Status.Success,
			p2: Analytics.Params.HasDescription(options.hasDescription),
			p3: Analytics.Params.HasScroll(options.hasScroll),
		});
	}

	sendAddProject(params: AnalyticsParams, options: {
		cardType: string,
		viewersCount: number,
		coexecutorsCount: number,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.AddProject,
			type: this.#getTypeFromCardType(options.cardType),
			c_section: params.context,
			c_element: Analytics.Element.ProjectButton,
			status: Analytics.Status.Success,
			p3: Analytics.Params.ViewersCount(options.viewersCount),
			p5: Analytics.Params.CoexecutorsCount(options.coexecutorsCount),
		});
	}

	sendDeadlineSet(params: AnalyticsParams, options: {
		cardType: string,
		element: string,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.DeadlineSet,
			type: this.#getTypeFromCardType(options.cardType),
			c_section: params.context,
			c_sub_section: Analytics.SubSection.TaskCard,
			c_element: options.element,
			status: Analytics.Status.Success,
		});
	}

	sendAssigneeChange(params: AnalyticsParams, options: {
		cardType: string,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.AssigneeChange,
			type: this.#getTypeFromCardType(options.cardType),
			c_section: params.context,
			c_sub_section: Analytics.SubSection.TaskCard,
			c_element: Analytics.Element.ChangeButton,
			status: Analytics.Status.Success,
		});
	}

	sendAttachFile(params: AnalyticsParams, options: {
		cardType: string,
		collabId: number,
		fileOrigin: string,
		fileSize: number,
		fileExtension: string,
		filesCount: number,
	}): void
	{
		const subSection = {
			[FileOrigin.CLIENT]: Analytics.SubSection.MyFiles,
		}[options.fileOrigin] ?? Analytics.SubSection.Bitrix24Files;

		this.#sendData({
			event: Analytics.Event.AttachFile,
			type: this.#getTypeFromCardType(options.cardType),
			c_section: params.context,
			c_sub_section: subSection,
			c_element: Analytics.Element.UploadButton,
			status: Analytics.Status.Success,
			p1: Analytics.Params.FileSize(options.fileSize),
			p2: Core.getParams().analytics.userType,
			p3: Analytics.Params.FilesCount(options.filesCount),
			...(options.collabId ? { p4: Analytics.Params.CollabId(options.collabId) } : {}),
			p5: Analytics.Params.FileExtension(options.fileExtension),
		});
	}

	sendAddChecklist(params: AnalyticsParams, options: {
		cardType: string,
		isNewTask: boolean,
		viewersCount: number,
		checklistPointsCount: number,
		coexecutorsCount: number,
	}): void
	{
		this.#sendData({
			event: Analytics.Event.AddChecklist,
			type: this.#getTypeFromCardType(options.cardType),
			c_section: params.context,
			c_sub_section: options.isNewTask ? Analytics.TaskState.New : Analytics.TaskState.Existing,
			c_element: Analytics.Element.CheckListButton,
			status: Analytics.Status.Success,
			p3: Analytics.Params.ViewersCount(options.viewersCount),
			p4: Analytics.Params.ChecklistPointsCount(options.checklistPointsCount),
			p5: Analytics.Params.CoexecutorsCount(options.coexecutorsCount),
		});
	}

	#sendData(data: AnalyticsOptions): void
	{
		sendData({
			tool: Analytics.Tool.Tasks,
			category: Analytics.Category.TaskOperations,
			...data,
		});
	}

	#getTypeFromCardType(cardType: string): string
	{
		return {
			[CardType.Compact]: Analytics.Type.TaskMini,
			[CardType.Full]: Analytics.Type.Task,
		}[cardType];
	}
}();
