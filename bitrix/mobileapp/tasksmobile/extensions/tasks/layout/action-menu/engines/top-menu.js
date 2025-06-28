/**
 * @module tasks/layout/action-menu/engines/top-menu
 */
jn.define('tasks/layout/action-menu/engines/top-menu', (require, exports, module) => {
	const { UIMenu } = require('layout/ui/menu');
	const { BaseEngine } = require('tasks/layout/action-menu/engines/base');

	class TopMenuEngine extends BaseEngine
	{
		show(actions, options)
		{
			// eslint-disable-next-line no-undef
			this.menu = new UIMenu(this.prepareItems(actions));

			this.menu.show(options);
		}

		close(callback)
		{
			this.menu?.hide();

			if (callback)
			{
				callback();
			}
		}

		/**
		 * @private
		 * @param {{
		 *     id: string,
		 *     title: string,
		 *     onClickCallback: function,
		 *     isDestructive?: boolean,
		 *     sectionCode?: string,
		 *     data?: { svgUri?: string, outlineIconUri?: string, outlineIconContent?: BaseIcon },
		 * }[]} actions
		 * @return {object[]}
		 */
		prepareItems(actions)
		{
			return actions.map((action) => {
				const icon = action.data?.outlineIconContent;
				const iconUrl = icon ? undefined : (action.data?.outlineIconUri || action.data?.svgUri);

				return {
					...action,
					testId: action.id,
					icon,
					iconUrl,
					onItemSelected: action.onClickCallback,
				};
			});
		}
	}

	module.exports = { TopMenuEngine };
});
