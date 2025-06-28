<?php

namespace Bitrix\Tasks\V2\Internals\Async;

enum QueueId: string
{
	case AddDavSync = 'add_task_dav_sync';
	case UpdateDavSync = 'update_task_dav_sync';
	case AddSearchIndex = 'add_task_search_index';
	case UpdateSearchIndex = 'update_task_search_index';
	case AddLastActivity = 'add_task_last_activity';
	case UpdateTopic = 'update_task_topic';
	case RecountSort = 'recount_task_sort';
}
