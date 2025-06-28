/* eslint-disable */
this.BX = this.BX || {};
this.BX.Tasks = this.BX.Tasks || {};
this.BX.Tasks.V2 = this.BX.Tasks.V2 || {};
(function (exports,ui_vue3,ui_vue3_mixins_locMixin,main_core_events,main_popup,ui_vue3_vuex,ui_notificationManager,ui_uploader_tileWidget,ui_iconSet_outline,tasks_v2_component_addTaskButton,tasks_v2_component_fields_title,tasks_v2_component_fields_importance,tasks_v2_component_fields_description,tasks_v2_component_elements_fieldList,tasks_v2_component_fields_responsible,tasks_v2_component_fields_deadline,tasks_v2_component_fields_group,tasks_v2_provider_service_taskService,tasks_v2_provider_service_checkListService,main_core,ui_vue3_components_button,tasks_v2_core,tasks_v2_const,tasks_v2_component_elements_hint,tasks_v2_component_fields_checkList,tasks_v2_component_fields_files,tasks_v2_lib_fieldHighlighter,tasks_v2_lib_analytics,tasks_v2_provider_service_fileService,ui_iconSet_api_vue,ui_iconSet_api_core) {
	'use strict';

	// @vue/component
	const FullCardButton = {
	  components: {
	    Hint: tasks_v2_component_elements_hint.Hint,
	    UiButton: ui_vue3_components_button.Button
	  },
	  inject: ['analytics'],
	  props: {
	    taskId: {
	      type: [Number, String],
	      required: true
	    },
	    isOpening: {
	      type: Boolean,
	      required: true
	    }
	  },
	  emits: ['update:isOpening'],
	  setup(props) {
	    return {
	      AirButtonStyle: ui_vue3_components_button.AirButtonStyle,
	      ButtonSize: ui_vue3_components_button.ButtonSize,
	      fileService: tasks_v2_provider_service_fileService.fileService.get(props.taskId)
	    };
	  },
	  data() {
	    return {
	      isHintShown: false,
	      hintBindElement: null
	    };
	  },
	  computed: {
	    task() {
	      return this.$store.getters[`${tasks_v2_const.Model.Tasks}/getById`](this.taskId);
	    },
	    checkLists() {
	      var _this$task;
	      return (_this$task = this.task) != null && _this$task.checklist ? this.$store.getters[`${tasks_v2_const.Model.CheckList}/getByIds`](this.task.checklist) : [];
	    },
	    isDisabled() {
	      return this.isUploading || this.isCheckListUploading;
	    },
	    isUploading() {
	      return this.fileService.isUploading();
	    },
	    isCheckListUploading() {
	      var _this$task$checklist;
	      return (_this$task$checklist = this.task.checklist) == null ? void 0 : _this$task$checklist.some(itemId => tasks_v2_provider_service_fileService.fileService.get(itemId, tasks_v2_provider_service_fileService.EntityTypes.CheckListItem).isUploading());
	    }
	  },
	  methods: {
	    handleClick() {
	      if (this.isUploading) {
	        this.highlightFiles();
	      } else if (this.isCheckListUploading) {
	        this.highlightChecklist();
	      } else {
	        this.openFullCard();
	      }
	    },
	    highlightFiles() {
	      this.hintBindElement = tasks_v2_lib_fieldHighlighter.fieldHighlighter.setContainer(this.$root.$el).addChipHighlight(tasks_v2_component_fields_files.filesMeta.id);
	      this.showHint();
	    },
	    highlightChecklist() {
	      this.hintBindElement = tasks_v2_lib_fieldHighlighter.fieldHighlighter.setContainer(this.$root.$el).addChipHighlight(tasks_v2_component_fields_checkList.checkListMeta.id);
	      this.showHint();
	    },
	    showHint() {
	      const removeHighlight = () => {
	        this.isHintShown = false;
	        main_core.Event.unbind(window, 'keydown', removeHighlight);
	      };
	      main_core.Event.bind(window, 'keydown', removeHighlight);
	      this.isHintShown = true;
	    },
	    openFullCard() {
	      if (this.isOpening) {
	        return;
	      }
	      this.$emit('update:isOpening', true);
	      const features = tasks_v2_core.Core.getParams().features;
	      tasks_v2_lib_analytics.analytics.sendOpenFullCard(this.analytics);
	      if (features.isMiniformEnabled && !features.isV2Enabled) {
	        main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.OpenSliderCard}:${this.taskId}`, {
	          task: this.task,
	          checkLists: this.checkLists
	        });
	      } else {
	        main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.OpenFullCard}:${this.taskId}`, this.taskId);
	      }
	    }
	  },
	  template: `
		<div
			class="tasks-compact-card-full-button-container"
			:class="{ '--disabled': isDisabled }"
			@click="handleClick"
		>
			<UiButton
				class="tasks-compact-card-full-button"
				:text="loc('TASKS_V2_TCC_FULL_CARD_BTN')"
				:size="ButtonSize.SMALL"
				:style="AirButtonStyle.PLAIN_NO_ACCENT"
				:loading="isOpening"
				:dataset="{taskButtonId: 'full'}"
				:disabled="isDisabled"
			/>
		</div>
		<Hint
			v-if="isHintShown"
			:bindElement="hintBindElement"
			@close="isHintShown = false"
		>
			{{ loc('TASKS_V2_TCC_FILE_IS_UPLOADING') }}
		</Hint>
	`
	};

	// @vue/component
	const DropZone = {
	  components: {
	    BIcon: ui_iconSet_api_vue.BIcon
	  },
	  setup() {
	    return {
	      Main: ui_iconSet_api_core.Main
	    };
	  },
	  template: `
		<div class="tasks-compact-card-drop-zone-container">
			<div class="tasks-compact-card-drop-zone">
				<BIcon :name="Main.ATTACH"/>
				<div class="tasks-compact-card-drop-zone-text">{{ loc('TASKS_V2_TCC_DROP_ZONE') }}</div>
			</div>
		</div>
	`
	};

	// @vue/component
	const App = {
	  name: 'TaskCompactCard',
	  components: {
	    BIcon: ui_iconSet_api_vue.BIcon,
	    FieldTitle: tasks_v2_component_fields_title.Title,
	    DescriptionInline: tasks_v2_component_fields_description.DescriptionInline,
	    Importance: tasks_v2_component_fields_importance.Importance,
	    FieldList: tasks_v2_component_elements_fieldList.FieldList,
	    UiButton: ui_vue3_components_button.Button,
	    AddTaskButton: tasks_v2_component_addTaskButton.AddTaskButton,
	    CheckListPopup: tasks_v2_component_fields_checkList.CheckListPopup,
	    FullCardButton,
	    DropZone
	  },
	  mixins: [ui_uploader_tileWidget.DragOverMixin],
	  provide() {
	    return {
	      analytics: this.analytics,
	      cardType: tasks_v2_const.CardType.Compact
	    };
	  },
	  props: {
	    taskId: {
	      type: [Number, String],
	      default: () => main_core.Text.getRandom()
	    },
	    groupId: {
	      type: [Number],
	      required: false,
	      default: null
	    },
	    deadlineTs: {
	      type: [Number, null],
	      required: false,
	      default: null
	    },
	    analytics: {
	      type: Object,
	      default: () => ({})
	    }
	  },
	  setup() {
	    return {
	      ButtonSize: ui_vue3_components_button.ButtonSize,
	      AirButtonStyle: ui_vue3_components_button.AirButtonStyle,
	      Outline: ui_iconSet_api_core.Outline
	    };
	  },
	  data() {
	    return {
	      openingFullCard: false,
	      isCheckListPopupShown: false,
	      chipsEventHandlers: {
	        showCheckList: this.showCheckListPopup
	      },
	      creationError: false,
	      popupCount: 0
	    };
	  },
	  computed: {
	    ...ui_vue3_vuex.mapGetters({
	      titleFieldOffsetHeight: `${tasks_v2_const.Model.Interface}/titleFieldOffsetHeight`,
	      currentUserId: `${tasks_v2_const.Model.Interface}/currentUserId`,
	      defaultDeadline: `${tasks_v2_const.Model.Interface}/defaultDeadline`
	    }),
	    hasDefaultDeadline() {
	      return this.defaultDeadline.defaultDeadlineDate !== '';
	    },
	    defaultDeadlineTs() {
	      return new Date(this.defaultDeadline.defaultDeadlineDate).getTime();
	    },
	    task() {
	      return this.$store.getters[`${tasks_v2_const.Model.Tasks}/getById`](this.taskId);
	    },
	    group() {
	      return this.$store.getters[`${tasks_v2_const.Model.Groups}/getById`](this.task.groupId);
	    },
	    checkLists() {
	      var _this$task;
	      return (_this$task = this.task) != null && _this$task.checklist ? this.$store.getters[`${tasks_v2_const.Model.CheckList}/getByIds`](this.task.checklist) : [];
	    },
	    isEdit() {
	      return main_core.Type.isNumber(this.taskId) && this.taskId > 0;
	    },
	    primaryFields() {
	      return [{
	        title: tasks_v2_component_fields_responsible.responsibleMeta.title,
	        component: tasks_v2_component_fields_responsible.Responsible,
	        props: {
	          taskId: this.taskId,
	          context: this.$options.name
	        }
	      }, {
	        title: tasks_v2_component_fields_deadline.deadlineMeta.title,
	        component: tasks_v2_component_fields_deadline.Deadline,
	        props: {
	          taskId: this.taskId
	        }
	      }];
	    },
	    chips() {
	      return [tasks_v2_component_fields_files.FilesChip, tasks_v2_component_fields_checkList.CheckListChip, tasks_v2_component_fields_group.GroupChip];
	    },
	    titleDisabled() {
	      return !this.task.rights.edit || this.isCheckListPopupShown;
	    }
	  },
	  created() {
	    var _this$group;
	    if (!this.isEdit) {
	      this.destroy();
	      const payload = {
	        id: this.taskId,
	        creatorId: this.currentUserId,
	        responsibleId: this.currentUserId,
	        ...(this.groupId ? {
	          groupId: this.groupId
	        } : {})
	      };
	      if (this.deadlineTs !== null) {
	        payload.deadlineTs = this.deadlineTs;
	      } else if (this.hasDefaultDeadline) {
	        payload.deadlineTs = this.defaultDeadlineTs;
	      }
	      this.insert(payload);
	    }
	    this.fileService = tasks_v2_provider_service_fileService.fileService.get(this.taskId);
	    tasks_v2_lib_analytics.analytics.sendOpenCard(this.analytics, {
	      collabId: ((_this$group = this.group) == null ? void 0 : _this$group.type) === tasks_v2_const.GroupType.Collab ? this.group.id : null
	    });
	  },
	  mounted() {
	    this.resizeObserver = new ResizeObserver(async entries => {
	      const title = entries.find(({
	        target
	      }) => target === this.$refs.title);
	      if (title) {
	        await this.updateTitleFieldOffsetHeight(title.contentRect.height);
	      }
	    });
	    this.resizeObserver.observe(this.$refs.title);
	    this.subscribeEvents();
	    this.fileService.getAdapter().getUploader().assignDropzone(this.$el);
	  },
	  beforeUnmount() {
	    if (this.resizeObserver) {
	      this.resizeObserver.disconnect();
	    }
	    this.unsubscribeEvents();
	  },
	  unmounted() {
	    if (!this.isEdit && this.openingFullCard === false) {
	      this.destroy();
	    }
	  },
	  methods: {
	    ...ui_vue3_vuex.mapActions(tasks_v2_const.Model.Tasks, ['insert', 'delete']),
	    ...ui_vue3_vuex.mapActions(tasks_v2_const.Model.Interface, ['updateTitleFieldOffsetHeight']),
	    close() {
	      main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.CloseCard}:${this.taskId}`);
	    },
	    async addTask() {
	      var _this$task2, _this$$refs, _this$$refs$descripti;
	      const [id, error] = await tasks_v2_provider_service_taskService.taskService.add(this.task);
	      if (!id) {
	        this.creationError = true;
	        ui_notificationManager.Notifier.notify({
	          id: 'task-message-add-error',
	          text: error.message
	        });
	        this.sendAddTaskAnalytics(false);
	        return;
	      }
	      this.sendAddTaskAnalytics(true);
	      tasks_v2_lib_analytics.analytics.sendDescription(this.analytics, {
	        hasDescription: main_core.Type.isStringFilled((_this$task2 = this.task) == null ? void 0 : _this$task2.description),
	        hasScroll: (_this$$refs = this.$refs) == null ? void 0 : (_this$$refs$descripti = _this$$refs.description) == null ? void 0 : _this$$refs$descripti.hasScroll()
	      });
	      if (this.checkLists.length > 0) {
	        await tasks_v2_provider_service_checkListService.checkListService.save(id, this.checkLists);
	      }
	      tasks_v2_provider_service_fileService.fileService.replace(this.taskId, id);
	      const baseEvent = new main_core_events.BaseEvent({
	        data: id,
	        compatData: ['ADD', {
	          task: this.task,
	          options: {}
	        }]
	      });
	      main_core.Event.EventEmitter.emit(tasks_v2_const.EventName.NotifyGrid, baseEvent);
	      const features = tasks_v2_core.Core.getParams().features;
	      if (features.isMiniformEnabled && !features.isV2Enabled) {
	        this.close();
	        return;
	      }
	      main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.OpenFullCard}:${this.taskId}`, id);
	      this.close();
	    },
	    sendAddTaskAnalytics(isSuccess) {
	      var _this$group2;
	      const collabId = ((_this$group2 = this.group) == null ? void 0 : _this$group2.type) === tasks_v2_const.GroupType.Collab ? this.group.id : null;
	      if (this.checkLists.length > 0) {
	        const checkLists = this.checkLists.filter(({
	          parentId
	        }) => parentId === 0);
	        const checkListsItems = this.checkLists.filter(({
	          parentId
	        }) => parentId !== 0);
	        tasks_v2_lib_analytics.analytics.sendAddTaskWithCheckList(this.analytics, {
	          isSuccess,
	          collabId,
	          viewersCount: this.task.auditorsIds.length,
	          checklistCount: checkLists.length,
	          checklistItemsCount: checkListsItems.length
	        });
	      } else {
	        tasks_v2_lib_analytics.analytics.sendAddTask(this.analytics, {
	          isSuccess,
	          collabId,
	          viewersCount: this.task.auditorsIds.length,
	          coexecutorsCount: this.task.accomplicesIds.length
	        });
	      }
	    },
	    handleShowingPopup(event) {
	      main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.ShowOverlay}:${this.taskId}`, {
	        taskId: this.taskId
	      });
	      this.externalPopup = event.popupInstance;
	      this.adjustCardPopup(true);
	      this.fileService.getAdapter().getUploader().unassignDropzone(this.$el);
	    },
	    handleHidingPopup() {
	      main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.HideOverlay}:${this.taskId}`);
	      main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.AdjustPosition}:${this.taskId}`);
	      this.externalPopup = null;
	      this.fileService.getAdapter().getUploader().assignDropzone(this.$el);
	    },
	    handleResizingPopup() {
	      this.adjustCardPopup();
	    },
	    adjustCardPopup(animate = false) {
	      if (!this.externalPopup) {
	        main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.AdjustPosition}:${this.taskId}`);
	        return;
	      }
	      main_core.Event.EventEmitter.emit(`${tasks_v2_const.EventName.AdjustPosition}:${this.taskId}`, {
	        titleFieldHeight: this.titleFieldOffsetHeight,
	        innerPopup: this.externalPopup,
	        animate
	      });
	    },
	    showCheckListPopup() {
	      this.isCheckListPopupShown = true;
	    },
	    closeCheckListPopup() {
	      this.isCheckListPopupShown = false;
	    },
	    getEventListeners(chip, handlers) {
	      const listeners = {};
	      if (chip.emits) {
	        Object.keys(handlers).forEach(event => {
	          if (chip.emits.includes(event)) {
	            listeners[event] = handlers[event];
	          }
	        });
	      }
	      return listeners;
	    },
	    subscribeEvents() {
	      main_core_events.EventEmitter.subscribe('BX.Main.Popup:onShow', this.handlePopupShow);
	      main_core.Event.bind(document, 'keydown', this.handleKeyDown, {
	        capture: true
	      });
	    },
	    unsubscribeEvents() {
	      main_core_events.EventEmitter.unsubscribe('BX.Main.Popup:onShow', this.handlePopupShow);
	      main_core.Event.unbind(document, 'keydown', this.handleKeyDown, {
	        capture: true
	      });
	    },
	    handlePopupShow(event) {
	      const popup = event.getCompatData()[0];
	      const onClose = () => {
	        popup.unsubscribe('onClose', onClose);
	        popup.unsubscribe('onDestroy', onClose);
	        this.popupCount--;
	      };
	      popup.subscribe('onClose', onClose);
	      popup.subscribe('onDestroy', onClose);
	      this.popupCount++;
	    },
	    handleKeyDown(event) {
	      if (this.popupCount > 0) {
	        return;
	      }
	      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
	        this.$refs.addTaskButton.handleClick();
	      } else if (event.key === 'Escape') {
	        this.close();
	      }
	    },
	    destroy() {
	      this.delete(this.taskId);
	      tasks_v2_provider_service_fileService.fileService.delete(this.taskId);
	    }
	  },
	  template: `
		<div v-drop class="tasks-compact-card-container">
			<div v-if="task" class="tasks-compact-card" :data-task-id="taskId" data-task-compact>
				<div class="tasks-compact-card-fields">
					<div
						class="tasks-compact-card-fields-title"
						:class="{'--no-gap': task.description.length > 0}"
						ref="title"
					>
						<FieldTitle :taskId="taskId" :disabled="titleDisabled"/>
						<Importance :taskId="taskId"/>
						<BIcon
							class="tasks-compact-card-fields-close"
							:name="Outline.CROSS_L"
							data-task-button-id="close"
							@click="close"
						/>
					</div>
					<DescriptionInline ref="description" :taskId="taskId"/>
					<div class="tasks-compact-card-fields-list">
						<FieldList :fields="primaryFields"/>
					</div>
					<CheckListPopup
						v-if="isCheckListPopupShown"
						:taskId="taskId"
						@show="handleShowingPopup"
						@close="handleHidingPopup(); closeCheckListPopup();"
						@resize="handleResizingPopup"
					/>
				</div>
				<div class="tasks-compact-card-footer">
					<div class="tasks-compact-card-chips">
						<template v-for="(chip, index) of chips" :key="index">
							<component
								:is="chip"
								v-bind="{ taskId, isAutonomous: true }"
								v-on="getEventListeners(chip, chipsEventHandlers)"
							/>
						</template>
					</div>
					<div class="tasks-compact-card-buttons">
						<div class="tasks-compact-card-main-buttons">
							<AddTaskButton
								ref="addTaskButton"
								:taskId="taskId"
								:size="ButtonSize.MEDIUM"
								v-model:hasError="creationError"
								@addTask="addTask"
							/>
							<UiButton
								:text="loc('TASKS_V2_TCC_CANCEL_BTN')"
								:size="ButtonSize.MEDIUM"
								:style="AirButtonStyle.PLAIN"
								:dataset="{
									taskButtonId: 'cancel',
								}"
								@click="close"
							/>
						</div>
						<FullCardButton v-model:isOpening="openingFullCard" :taskId="taskId"/>
					</div>
				</div>
			</div>
			<DropZone/>
		</div>
	`
	};

	var _params = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("params");
	var _application = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("application");
	var _mountApplication = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("mountApplication");
	var _unmountApplication = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("unmountApplication");
	var _subscribe = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("subscribe");
	var _unsubscribe = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("unsubscribe");
	var _closeCard = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("closeCard");
	var _openFullCard = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("openFullCard");
	var _openSliderCard = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("openSliderCard");
	var _showOverlay = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("showOverlay");
	var _hideOverlay = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("hideOverlay");
	var _adjustPosition = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("adjustPosition");
	class TaskCompactCard extends main_core_events.EventEmitter {
	  constructor(params = {}) {
	    super(params);
	    Object.defineProperty(this, _unsubscribe, {
	      value: _unsubscribe2
	    });
	    Object.defineProperty(this, _subscribe, {
	      value: _subscribe2
	    });
	    Object.defineProperty(this, _unmountApplication, {
	      value: _unmountApplication2
	    });
	    Object.defineProperty(this, _mountApplication, {
	      value: _mountApplication2
	    });
	    Object.defineProperty(this, _params, {
	      writable: true,
	      value: void 0
	    });
	    Object.defineProperty(this, _application, {
	      writable: true,
	      value: null
	    });
	    Object.defineProperty(this, _closeCard, {
	      writable: true,
	      value: () => {
	        this.emit('closeCard');
	      }
	    });
	    Object.defineProperty(this, _openFullCard, {
	      writable: true,
	      value: baseEvent => {
	        babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId = baseEvent.getData();
	        this.emit('openFullCard', babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId);
	      }
	    });
	    Object.defineProperty(this, _openSliderCard, {
	      writable: true,
	      value: baseEvent => {
	        const task = baseEvent.getData().task;
	        const checkLists = baseEvent.getData().checkLists;
	        const data = tasks_v2_provider_service_taskService.TaskMappers.mapModelToSliderData(task, checkLists);
	        const path = tasks_v2_core.Core.getParams().paths.editPath;
	        BX.SidePanel.Instance.open(path, {
	          requestMethod: 'post',
	          requestParams: data,
	          cacheable: false
	        });
	        babelHelpers.classPrivateFieldLooseBase(this, _closeCard)[_closeCard]();
	      }
	    });
	    Object.defineProperty(this, _showOverlay, {
	      writable: true,
	      value: () => {
	        this.emit('showOverlay');
	      }
	    });
	    Object.defineProperty(this, _hideOverlay, {
	      writable: true,
	      value: () => {
	        this.emit('hideOverlay');
	      }
	    });
	    Object.defineProperty(this, _adjustPosition, {
	      writable: true,
	      value: (baseEvent = null) => {
	        var _baseEvent$getData;
	        this.emit('adjustPosition', (_baseEvent$getData = baseEvent == null ? void 0 : baseEvent.getData()) != null ? _baseEvent$getData : {});
	      }
	    });
	    this.setEventNamespace('Tasks:TaskCompactCard');
	    babelHelpers.classPrivateFieldLooseBase(this, _params)[_params] = params;
	    babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId = main_core.Type.isUndefined(babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId) ? 0 : babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId;
	  }
	  async mountCard(container) {
	    await babelHelpers.classPrivateFieldLooseBase(this, _mountApplication)[_mountApplication](container);
	    babelHelpers.classPrivateFieldLooseBase(this, _adjustPosition)[_adjustPosition]();
	    babelHelpers.classPrivateFieldLooseBase(this, _subscribe)[_subscribe]();
	  }
	  unmountCard() {
	    babelHelpers.classPrivateFieldLooseBase(this, _unmountApplication)[_unmountApplication]();
	    babelHelpers.classPrivateFieldLooseBase(this, _unsubscribe)[_unsubscribe]();
	  }
	}
	async function _mountApplication2(container) {
	  await tasks_v2_core.Core.init();
	  const application = ui_vue3.BitrixVue.createApp(App, babelHelpers.classPrivateFieldLooseBase(this, _params)[_params]);
	  application.mixin(ui_vue3_mixins_locMixin.locMixin);
	  application.use(tasks_v2_core.Core.getStore());
	  application.mount(container);
	  babelHelpers.classPrivateFieldLooseBase(this, _application)[_application] = application;
	}
	function _unmountApplication2() {
	  babelHelpers.classPrivateFieldLooseBase(this, _application)[_application].unmount();
	}
	function _subscribe2() {
	  main_core_events.EventEmitter.subscribe(`${tasks_v2_const.EventName.CloseCard}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _closeCard)[_closeCard]);
	  main_core_events.EventEmitter.subscribe(`${tasks_v2_const.EventName.OpenFullCard}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _openFullCard)[_openFullCard]);
	  main_core_events.EventEmitter.subscribe(`${tasks_v2_const.EventName.OpenSliderCard}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _openSliderCard)[_openSliderCard]);
	  main_core_events.EventEmitter.subscribe(`${tasks_v2_const.EventName.ShowOverlay}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _showOverlay)[_showOverlay]);
	  main_core_events.EventEmitter.subscribe(`${tasks_v2_const.EventName.HideOverlay}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _hideOverlay)[_hideOverlay]);
	  main_core_events.EventEmitter.subscribe(`${tasks_v2_const.EventName.AdjustPosition}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _adjustPosition)[_adjustPosition]);
	}
	function _unsubscribe2() {
	  main_core_events.EventEmitter.unsubscribe(`${tasks_v2_const.EventName.CloseCard}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _closeCard)[_closeCard]);
	  main_core_events.EventEmitter.unsubscribe(`${tasks_v2_const.EventName.OpenFullCard}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _openFullCard)[_openFullCard]);
	  main_core_events.EventEmitter.unsubscribe(`${tasks_v2_const.EventName.OpenSliderCard}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _openSliderCard)[_openSliderCard]);
	  main_core_events.EventEmitter.unsubscribe(`${tasks_v2_const.EventName.ShowOverlay}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _showOverlay)[_showOverlay]);
	  main_core_events.EventEmitter.unsubscribe(`${tasks_v2_const.EventName.HideOverlay}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _hideOverlay)[_hideOverlay]);
	  main_core_events.EventEmitter.unsubscribe(`${tasks_v2_const.EventName.AdjustPosition}:${babelHelpers.classPrivateFieldLooseBase(this, _params)[_params].taskId}`, babelHelpers.classPrivateFieldLooseBase(this, _adjustPosition)[_adjustPosition]);
	}

	exports.TaskCompactCard = TaskCompactCard;

}((this.BX.Tasks.V2.Application = this.BX.Tasks.V2.Application || {}),BX.Vue3,BX.Vue3.Mixins,BX.Event,BX.Main,BX.Vue3.Vuex,BX.UI.NotificationManager,BX.UI.Uploader,BX,BX.Tasks.V2.Component,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Component.Elements,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Provider.Service,BX.Tasks.V2.Provider.Service,BX,BX.Vue3.Components,BX.Tasks.V2,BX.Tasks.V2.Const,BX.Tasks.V2.Component.Elements,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Component.Fields,BX.Tasks.V2.Lib,BX.Tasks.V2.Lib,BX.Tasks.V2.Provider.Service,BX.UI.IconSet,BX.UI.IconSet));
//# sourceMappingURL=task-compact-card.bundle.js.map
