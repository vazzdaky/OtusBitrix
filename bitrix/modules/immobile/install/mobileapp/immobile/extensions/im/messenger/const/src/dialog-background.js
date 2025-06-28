/**
 * @module im/messenger/const/dialog-background
 */
jn.define('im/messenger/const/dialog-background', (require, exports, module) => {
	const DialogBackgroundId = Object.freeze({
		default: 'default',
		martaAi: 'martaAI',
		copilot: 'copilot',
		collab: 'collab',
	});

	module.exports = {
		DialogBackgroundId,
	};
});
