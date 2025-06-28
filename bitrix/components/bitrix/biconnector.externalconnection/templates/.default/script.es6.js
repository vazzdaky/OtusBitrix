import { ajax as Ajax, Dom, Event, Loc, Tag, Text, Reflection } from 'main.core';
import { BaseEvent } from 'main.core.events';
import { Popup } from 'main.popup';
import { Button, ButtonColor, ButtonManager, ButtonState } from 'ui.buttons';
import { Slider as ImportSlider } from 'biconnector.dataset-import';

type SettingField = {
	name: string,
	type: string,
	code: string,
	placeholder: string,
}

type Props = {
	sourceFields: { id: number, title: string, type: string, active: boolean },
	fieldsConfig: { [key: string]: SettingField[] },
	supportedDatabases: { code: string; name: string }[],
	closeAfterCreate: boolean,
}

class ExternalConnectionForm
{
	#node: HTMLElement;
	#props: Props;
	#checkConnectButton: Button;
	#connectionStatusNode: HTMLElement;

	constructor(props: Props)
	{
		this.#props = props;
		this.#initForm();
	}

	#initForm()
	{
		this.#node = document.querySelector('#connection-form');

		this.#initHint();
		const fieldsNode = Tag.render`
			<div class="fields-wrapper"></div>
		`;
		Dom.append(fieldsNode, this.#node);
		this.#initFields();

		const buttonBlock = Tag.render`
			<div class="db-connection-button-block">
				<div class="db-connection-button"></div>
				<div class="db-connection-status"></div>
			</div>
		`;
		Dom.append(buttonBlock, this.#node);

		this.#initCheckConnectButton();
		this.#initConnectionStatusBlock();
	}

	#initHint()
	{
		const hint = Tag.render`
			<div class="db-connection-hint">
				${Loc.getMessage('EXTERNAL_CONNECTION_HINT', {
					'[link]': '<a class="ui-link" onclick="top.BX.Helper.show(`redirect=detail&code=23508958`)">',
					'[/link]': '</a>',
				})}
			</div>
		`;
		Dom.append(hint, this.#node);
	}

	#initFields()
	{
		const fieldsNode = this.#node.querySelector('.fields-wrapper');
		const sourceFields = this.#props.sourceFields ?? {};
		const fields = Tag.render`
			<div class="form-fields">
				<div class="ui-form-row">
					<div class="ui-form-label">
						<div class="ui-ctl-label-text">${Loc.getMessage('EXTERNAL_CONNECTION_FIELD_TYPE')}</div>
					</div>
					<div class="ui-ctl ui-ctl-after-icon ui-ctl-dropdown ui-ctl-w100">
						<div class="ui-ctl-after ui-ctl-icon-angle"></div>
						<select class="ui-ctl-element" data-code="type"></select>
					</div>
				</div>
				<div class="ui-form-row">
					<div class="ui-form-label">
						<div class="ui-ctl-label-text">${Loc.getMessage('EXTERNAL_CONNECTION_FIELD_NAME')}</div>
					</div>
					<div class="ui-form-content">
						<div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
							<input 
								type="text" 
								class="ui-ctl-element" 
								placeholder="${Loc.getMessage('EXTERNAL_CONNECTION_FIELD_NAME_PLACEHOLDER')}" 
								data-code="title"
								value="${sourceFields.title ?? ''}"
							>
						</div>
					</div>
				</div>
			</div>
		`;
		Dom.append(fields, fieldsNode);

		const typeSelector = fieldsNode.querySelector('[data-code="type"]');
		this.#props.supportedDatabases.forEach((database) => {
			Dom.append(
				Tag.render`
					<option 
						value="${database.code}" 
						${sourceFields.type === database.code ? 'selected' : ''}
					>
						${database.name}
					</option>
				`,
				typeSelector,
			);
		});
		Event.bind(typeSelector, 'input', this.#onChangeType.bind(this));

		if (sourceFields.id)
		{
			const fieldId = Tag.render`
				<input hidden value="${sourceFields.id}" data-code="id">
			`;
			Dom.append(fieldId, fields);

			Dom.attr(typeSelector, 'disabled', true);
		}

		const fieldConfig = this.#props.fieldsConfig;
		const connectionType = sourceFields.type ?? this.#props.supportedDatabases[0].code;
		fieldConfig[connectionType].forEach((field: SettingField) => {
			let fieldType = field.type;
			if (field.code === 'password')
			{
				fieldType = 'password';
			}
			const fieldNode = Tag.render`
				<div class="ui-form-row">
					<div class="ui-form-label">
						<div class="ui-ctl-label-text">${field.name}</div>
					</div>
					<div class="ui-form-content">
						<div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
							<input 
								type="${fieldType}" 
								class="ui-ctl-element" 
								data-code="${field.code}"
								placeholder="${field.placeholder}" 
								value="${sourceFields[field.code] ?? ''}"
							>
						</div>
					</div>
				</div>
			`;
			Dom.append(fieldNode, fields);
			Event.bind(fieldNode, 'input', () => this.#clearConnectionStatus());
		});
	}

	#onChangeType(event)
	{
		this.#props.sourceFields.type = event.target.value;
		Dom.clean(this.#node.querySelector('.fields-wrapper'));
		this.#initFields();
		this.#clearConnectionStatus();
	}

	#initCheckConnectButton()
	{
		const connectButton = new Button({
			text: Loc.getMessage('EXTERNAL_CONNECTION_CHECK_BUTTON'),
			color: ButtonColor.PRIMARY,
			onclick: (button: Button, event: BaseEvent) => {
				event.preventDefault();
				this.#onCheckConnectClick()
					.catch(() => {});
			},
			noCaps: true,
		});
		connectButton.renderTo(this.#node.querySelector('.db-connection-button'));
		this.#checkConnectButton = connectButton;
	}

	#initConnectionStatusBlock()
	{
		this.#connectionStatusNode = this.#node.querySelector('.db-connection-status');
	}

	#clearConnectionStatus()
	{
		Dom.clean(this.#connectionStatusNode);
	}

	#updateConnectionStatus(succedeed: boolean, errorMessage: string)
	{
		Dom.clean(this.#connectionStatusNode);
		let status = null;
		if (succedeed)
		{
			status = Tag.render`
				<div class="db-connection-success">
					<div class="ui-icon-set --check" style="--ui-icon-set__icon-size: 18px; --ui-icon-set__icon-color: var(--ui-color-palette-green-50);"></div>
					${Loc.getMessage('EXTERNAL_CONNECTION_CHECK_SUCCESS')}
				</div>
			`;
		}
		else
		{
			status = Tag.render`
				<div class="db-connection-error">
					<div class="ui-icon-set --warning" style="--ui-icon-set__icon-size: 18px; --ui-icon-set__icon-color: var(--ui-color-palette-red-60);"></div>
					${errorMessage.replaceAll(/\s+/g, ' ')}
				</div>
			`;
		}
		Dom.append(status, this.#connectionStatusNode);
	}

	#getConnectionValues(): Object
	{
		const result = {};
		this.#node.querySelectorAll('[data-code]').forEach((field) => {
			result[field.getAttribute('data-code')] = field.value;
		});

		return result;
	}

	#onCheckConnectClick(): Promise
	{
		this.#checkConnectButton.setState(ButtonState.WAITING);

		return new Promise((resolve, reject) => {
			Ajax.runAction('biconnector.externalsource.source.checkConnectionByData', {
				data: {
					data: this.#getConnectionValues(),
				},
			})
				.then((response) => {
					this.#updateConnectionStatus(true);
					this.#checkConnectButton.setState(null);

					resolve(response);
				})
				.catch((response) => {
					this.#updateConnectionStatus(false, response.errors[0].message);
					this.#checkConnectButton.setState(null);

					reject();
				})
			;
		});
	}

	onClickSave()
	{
		const saveButton = ButtonManager.createFromNode(document.querySelector('#connection-button-save'));
		saveButton.setWaiting(true);
		const connectionValues = this.#getConnectionValues();
		if (this.#props.sourceFields.id)
		{
			connectionValues.id = this.#props.sourceFields.id;
		}

		this.#onCheckConnectClick()
			.then(() => {
				return Ajax.runAction('biconnector.externalsource.source.save', {
					data: {
						data: connectionValues,
					},
				});
			})
			.then((response) => {
				BX.SidePanel.Instance.postMessage(window, 'BIConnector:ExternalConnection:onConnectionSave', {
					connection: response.data.connection,
				});
				if (this.#props.closeAfterCreate)
				{
					this.#closeSlider();
				}
				else
				{
					this.#showSaveSuccessPopup(response.data.connection);
					saveButton.setWaiting(false);
				}
			})
			.catch((response) => {
				saveButton.setWaiting(false);
				if (response.errors?.length > 0)
				{
					BX.UI.Notification.Center.notify({
						content: response.errors[0].message,
					});
				}
				else
				{
					console.error(response);
				}
				BX.SidePanel.Instance.postMessage(window, 'BIConnector:ExternalConnection:onConnectionCreationError');
			});
	}

	#showSaveSuccessPopup(connection: { id: any, name: string, type: string })
	{
		let popup: ?Popup = null;

		// show for new or active sources only
		const showCreateDatasetButton = !(Object.hasOwn(this.#props.sourceFields, 'id')) || this.#props.sourceFields.active;
		const createDatasetButton = showCreateDatasetButton ? Tag.render`
			<a class="ui-btn ui-btn-md ui-btn-primary">
				${Loc.getMessage('EXTERNAL_CONNECTION_CREATE_DATASET')}
			</a>
		` : false;

		const closeButton = Tag.render`
			<a class="ui-btn ui-btn-md ui-btn-light-border">
				${Loc.getMessage('EXTERNAL_CONNECTION_CLOSE')}
			</a>
		`;

		const onPopupClose = () => {
			this.#closeSlider();
		};

		const sourceType = this.#props.sourceFields.type ?? this.#props.supportedDatabases[0].code;

		Event.bind(createDatasetButton, 'click', () => {
			onPopupClose();
			ImportSlider.open(sourceType, 0, {
				connectionId: connection.id,
				connectionType: connection.type,
			});
		});

		Event.bind(closeButton, 'click', () => {
			onPopupClose();
		});

		const isEditMode = Boolean(this.#props.sourceFields.id);
		const popupMessageCode = isEditMode ? 'EXTERNAL_CONNECTION_EDIT_SUCCESS' : 'EXTERNAL_CONNECTION_SAVE_SUCCESS';
		const popupText = Loc.getMessage(
			popupMessageCode,
			{ '#CONNECTION_TITLE#': Text.encode(this.#getConnectionValues().title) },
		);

		const popupContent = Tag.render`
			<div class="biconnector-popup--full-height">
				<div class="biconnector-save-progress-popup">
					<div class="biconnector-save-progress-popup__content">
						<div class="biconnector-save-progress-popup__success-logo"></div>
						<div class="biconnector-save-progress-popup__texts">
							<h3 class="biconnector-save-progress-popup__header">${popupText}</h3>
						</div>
						<div class="biconnector-save-progress-popup__buttons">
							${createDatasetButton}
							${closeButton}
						</div>
					</div>
				</div>
			</div>
		`;

		popup = new Popup({
			content: popupContent,
			autoHide: true,
			events: {
				onPopupClose,
				onPopupDestroy: onPopupClose,
			},
			fixed: true,
			width: 500,
			minHeight: 299,
			closeIcon: true,
			noAllPaddings: true,
			overlay: true,
		});

		popup.show();
	}

	#closeSlider()
	{
		BX.SidePanel.Instance.postMessage(window, 'BIConnector:ExternalConnection:onConnectionSliderClose');
		BX.SidePanel.Instance.getTopSlider().close();
	}
}

Reflection.namespace('BX.BIConnector').ExternalConnectionForm = ExternalConnectionForm;
