import type { GroupDto, StageDto } from 'tasks.v2.provider.service.group-service';
import type { FlowDto } from 'tasks.v2.provider.service.flow-service';
import type { UserDto } from 'tasks.v2.provider.service.user-service';

export type TaskDto = {
	id: number,
	title: string,
	description: string,
	creator: UserDto,
	createdTs: number,
	responsible: UserDto,
	deadlineTs: number,
	needsControl: boolean,
	fileIds: number[],
	checklist: number[] | string[],
	containsChecklist: boolean,
	group: GroupDto,
	stage: StageDto,
	flow: FlowDto,
	priority: Priority,
	status: Status,
	statusChangedTs: number,
	accomplices: UserDto[],
	auditors: UserDto[],
	parent: TaskDto,
	chatId: number,
	rights: { [right: string]: boolean },
};

export type TaskSliderData = {
	TITLE: string,
	DESCRIPTION: string,
	RESPONSIBLE_ID: number,
	GROUP_ID: number,
	DEADLINE_TS: number,
	IS_IMPORTANT: string,
	FILE_IDS: string[],
	CHECKLIST: CheckList,
};

type Priority = 'low' | 'average' | 'high';

type Status = 'pending' | 'in_progress' | 'supposedly_completed' | 'completed' | 'deferred' | 'declined';

type CheckList = {
	any: any,
};
