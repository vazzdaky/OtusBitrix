import { StepBlock } from '../layout/step-block';
import { BaseStep } from './base-step';
import { FormatTable } from './data-type/format-table';
import { SyncFieldsButton } from './data-type/sync-fields-button';
import '../css/fields-settings.css';

export const FieldsSettingsStep = {
	emits: ['parsingOptionsChanged', 'settingsChanged', 'syncFields'],
	extends: BaseStep,
	props: {
		syncFieldsProps: {
			type: Object,
			default: {
				supported: false,
				disabled: true,
			},
		},
	},
	computed: {
		fieldsSettings()
		{
			return this.$store.state.config.fieldsSettings;
		},
		defaultTitle()
		{
			return this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELDS_SETTINGS_HEADER');
		},
		defaultHint()
		{
			if (this.isEditMode)
			{
				return this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELDS_SETTINGS_HINT_EDIT')
					.replace('[link]', '<a onclick="top.BX.Helper.show(`redirect=detail&code=23378698`)">')
					.replace('[/link]', '</a>')
				;
			}

			return this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELDS_SETTINGS_HINT')
				.replace('[link]', '<a onclick="top.BX.Helper.show(`redirect=detail&code=23378698`)">')
				.replace('[/link]', '</a>')
			;
		},
		unvalidatedRows()
		{
			const rows = {};

			this.$store.state.config.fieldsSettings.forEach((field, index) => {
				const invalidFields = {};

				if (!field.id)
				{
					const nameValidationResult = this.validateName(field.name);
					if (!nameValidationResult.result)
					{
						invalidFields.name = nameValidationResult;
					}
				}

				if (Object.keys(invalidFields).length > 0)
				{
					rows[index] = invalidFields;
				}
			});

			return rows;
		},
		isEditMode()
		{
			return this.$store.getters.isEditMode;
		},
		isSyncSupported(): boolean
		{
			return this.syncFieldsProps.supported;
		},
		isSyncDisabled(): boolean
		{
			return this.syncFieldsProps.disabled;
		},
	},
	methods: {
		validateName(name)
		{
			const isNotEmpty = name.length > 0;
			if (!isNotEmpty)
			{
				return {
					result: false,
					message: this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELD_VALIDATION_EMPTY_ERROR'),
				};
			}

			const isTooLong = name.length > 32;
			if (isTooLong)
			{
				return {
					result: false,
					message: this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELD_VALIDATION_FIELD_TOO_LONG'),
				};
			}

			// only numbers, uppercase letters and underscores; starts with a letter
			const areCharactersValid = /^[A-Z](?=.*[A-Z_])[A-Z0-9_]*$/.test(name);
			if (!areCharactersValid)
			{
				return {
					result: false,
					message: this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELD_VALIDATION_FIELD_INVALID_CHARS'),
				};
			}

			const isAlreadyUsed = this.$store.getters.previewHeaders.reduce((
				count,
				value,
			) => (name === value ? count + 1 : count), 0) > 1;
			if (isAlreadyUsed)
			{
				return {
					result: false,
					message: this.$Bitrix.Loc.getMessage('DATASET_IMPORT_FIELD_VALIDATION_FIELD_ALREADY_USED'),
				};
			}

			return {
				result: true,
			};
		},
		onRowToggled(event)
		{
			this.$store.commit('toggleRowVisibility', event.index);
			this.$emit('settingsChanged');
		},
		onHeaderToggled(event)
		{
			if (this.$store.getters.areAllRowsVisible)
			{
				this.$store.commit('setAllRowsInvisible');
			}
			else
			{
				this.$store.commit('setAllRowsVisible');
			}

			this.$emit('settingsChanged');
		},
		onRowFieldChanged(event)
		{
			this.fieldsSettings[event.index][event.fieldName] = event.value;
			this.$store.commit('setFieldRowSettings', {
				index: event.index,
				settings: this.fieldsSettings[event.index],
			});

			if (event.fieldName === 'type')
			{
				this.$emit('parsingOptionsChanged');
			}

			this.$emit('settingsChanged');

			this.validate();
		},
		validate()
		{
			const result = Object.keys(this.unvalidatedRows).length === 0;

			this.$emit('validation', result);

			return result;
		},
		showValidationErrors()
		{
			this.$refs.formatTable.showValidationErrors();
		},
	},
	components: {
		Step: StepBlock,
		FormatTable,
		SyncFieldsButton,
	},
	// language=Vue
	template: `
		<Step
			:title="displayedTitle"
			:hint="displayedHint"
			:is-open-initially="isOpenInitially"
			:disabled="disabled"
			ref="stepBlock"
		>
			<SyncFieldsButton v-if="isSyncSupported" :disabled="isSyncDisabled" @button-click="this.$emit('syncFields')"/>
			<div class="ui-form-row fields-settings">
				<FormatTable
					:fields-settings="fieldsSettings"
					@row-toggle="onRowToggled"
					@header-toggle="onHeaderToggled"
					@row-field-changed="onRowFieldChanged"
					:unvalidated-rows="unvalidatedRows"
					ref="formatTable"
				/>
			</div>
		</Step>
	`,
};
