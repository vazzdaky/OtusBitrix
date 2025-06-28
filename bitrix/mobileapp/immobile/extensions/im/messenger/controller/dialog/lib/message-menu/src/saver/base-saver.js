/**
 * @module im/messenger/controller/dialog/lib/message-menu/src/saver/base-saver
 */
jn.define('im/messenger/controller/dialog/lib/message-menu/src/saver/base-saver', (require, exports, module) => {
	const { getLogger } = require('im/messenger/lib/logger');
	const { Analytics } = require('im/messenger/const');
	const { showSuccessSaveToast, showSaveFailureToast } = require(
		'im/messenger/controller/dialog/lib/message-menu/src/saver/save-toast',
	);

	/**
	 * @abstract
	 * @class BaseSaver
	 */
	class BaseSaver
	{
		/**
		 * @typedef {Object} SaverProps
		 * @property {DialogLocator} locator
		 * @property {DialogId} dialogId
		 * @property {MessageHelper} messageHelper
		 * @param {SaverProps} props
		 */
		constructor(props)
		{
			/** @type {DialogLocator} */
			this.dialogLocator = props.locator;
			/** @type {DialogView} */
			this.view = props.locator.get('view').ui;
			/** @type {DialogId} */
			this.dialogId = props.dialogId;
			/** @type {MessageHelper} */
			this.messageHelper = props.messageHelper;
			this.logger = getLogger('dialog--message-menu-file-saver');
		}

		/**
		 * @abstract
		 * @public
		 * @returns {Promise<void>}
		 */
		async save()
		{
			throw new Error(`${this.constructor.name}.save() method should be implemented in child class`);
		}

		/**
		 * @abstract
		 * @protected
		 * @returns {'DISK'|'DEVICE'}
		 */
		getType()
		{
			throw new Error(`${this.constructor.name}.getType() method should be implemented in child class`);
		}

		/**
		 * @protected
		 * @returns {sendAnalyticsParams}
		 */
		getAnalyticsParams()
		{
			const fileType = this.messageHelper.isMediaMessage
				? Analytics.Type.media
				: Analytics.Type.file;

			return {
				fileType,
				dialogId: this.dialogId,
			};
		}

		/**
		 * @returns {Array<FilesModelState>}
		 */
		getFiles()
		{
			return this.messageHelper.filesModel;
		}

		showSuccessSaveToast()
		{
			showSuccessSaveToast({
				to: this.getType(),
				messageHelper: this.messageHelper,
				view: this.view,
			});
		}

		showSaveFailureToast()
		{
			showSaveFailureToast({
				to: this.getType(),
				messageHelper: this.messageHelper,
				view: this.view,
			});
		}
	}

	module.exports = {
		BaseSaver,
	};
});
