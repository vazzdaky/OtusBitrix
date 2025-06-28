import { getData, postData } from 'humanresources.company-structure.api';
import { getNodeColorSettings } from 'humanresources.company-structure.utils';
import type { TreeItem } from './types';

const createTreeDataStore = (treeData: Array<TreeItem>): Map<number, TreeItem> => {
	const dataMap = new Map();
	treeData.forEach((item) => {
		const { id, parentId, colorName, entityType } = item;
		const mapItem = dataMap.get(id) ?? {};
		const teamColor = getNodeColorSettings(colorName, entityType);
		dataMap.set(id, { ...mapItem, ...item, teamColor });
		if (parentId === 0)
		{
			return;
		}

		const mapParentItem = dataMap.get(parentId) ?? {};
		const children = mapParentItem.children ?? [];
		dataMap.set(parentId, {
			...mapParentItem,
			children: [...children, id],
		});
	});

	return dataMap;
};

export const chartAPI = {
	removeDepartment: (id: Number): Promise<void> => {
		return getData('humanresources.api.Structure.Node.delete', { nodeId: id });
	},
	getDepartmentsData: (): Promise<Array<TreeItem>> => {
		return getData('humanresources.api.Structure.get', {}, { tool: 'structure', category: 'structure', event: 'open_structure' });
	},
	getCurrentDepartments: (): Promise<number[]> => {
		return getData('humanresources.api.Structure.Node.current');
	},
	getDictionary: (): Promise<string> => {
		return getData('humanresources.api.Structure.dictionary');
	},
	getUserId: (): Promise<number> => {
		return getData('humanresources.api.User.getCurrentId');
	},
	firstTimeOpened: (): Promise<void> => {
		return postData('humanresources.api.User.firstTimeOpen');
	},
	createTreeDataStore,
};
