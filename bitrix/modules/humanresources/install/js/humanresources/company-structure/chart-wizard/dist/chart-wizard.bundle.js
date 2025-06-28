/* eslint-disable */
this.BX = this.BX || {};
this.BX.Humanresources = this.BX.Humanresources || {};
(function (exports,ui_notification,ui_dialogs_messagebox,ui_vue3_pinia,main_loader,main_core_cache,ui_iconSet_api_core,ui_iconSet_crm,ui_iconSet_api_vue,ui_hint,humanresources_companyStructure_structureComponents,main_core,ui_entitySelector,humanresources_companyStructure_api,humanresources_companyStructure_chartStore,ui_analytics,humanresources_companyStructure_permissionChecker,humanresources_companyStructure_utils) {
	'use strict';

	const HeadUsers = {
	  name: 'headUsers',
	  components: {
	    UserListActionMenu: humanresources_companyStructure_structureComponents.UserListActionMenu
	  },
	  props: {
	    users: {
	      type: Array,
	      required: true
	    },
	    showPlaceholder: {
	      type: Boolean,
	      default: true
	    },
	    isTeamEntity: {
	      type: Boolean,
	      default: false
	    },
	    isExistingDepartment: {
	      type: Boolean,
	      default: true
	    },
	    userType: {
	      type: String,
	      default: 'head'
	    },
	    teamColor: {
	      type: [Object, null],
	      default: null
	    }
	  },
	  data() {
	    return {
	      headsVisible: false
	    };
	  },
	  created() {
	    this.userTypes = {
	      head: 'head',
	      deputy: 'deputy'
	    };
	  },
	  computed: {
	    headItemsCount() {
	      return this.isExistingDepartment ? 1 : 2;
	    },
	    defaultAvatar() {
	      return '/bitrix/js/humanresources/company-structure/org-chart/src/images/default-user.svg';
	    },
	    placeholderAvatar() {
	      if (!this.isTeamEntity || !this.teamColor) {
	        return '/bitrix/js/humanresources/company-structure/chart-wizard/src/components/tree-preview/images/placeholder-avatar.svg';
	      }
	      return `/bitrix/js/humanresources/company-structure/chart-wizard/src/components/tree-preview/images/${this.teamColor.avatarImage}`;
	    },
	    dropdownItems() {
	      return this.users.map(user => {
	        const workPosition = user.workPosition || this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_HEAD_POSITION');
	        return {
	          ...user,
	          workPosition
	        };
	      });
	    },
	    titleBar() {
	      return this.userType === this.userTypes.deputy ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_DEPUTY_TITLE') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_HEAD_TITLE');
	    },
	    isDeputy() {
	      return this.userType === this.userTypes.deputy;
	    }
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    }
	  },
	  template: `
		<div
			class="chart-wizard-tree-preview__node_head"
			:class="{ '--deputy': isDeputy }"
			v-for="(user, index) in users.slice(0, headItemsCount)"
		>
			<img
				:src="user.avatar || defaultAvatar"
				class="chart-wizard-tree-preview__node_head-avatar --placeholder"
				:class="{ '--deputy': isDeputy, '--old': isExistingDepartment }"
			/>
			<div class="chart-wizard-tree-preview__node_head-text" :class="{'--deputy': isDeputy }">
				<span
					class="chart-wizard-tree-preview__node_head-name --crop"
					:class="{'--old': isExistingDepartment }"
				>
					{{ user.name }}
				</span>
				<span
					v-if="!isDeputy"
					class="chart-wizard-tree-preview__node_head-position --crop"
					:class="{'--old': isExistingDepartment }"
				>
					{{ user.workPosition || loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_HEAD_POSITION') }}
				</span>
			</div>
			<span
				v-if="index === headItemsCount - 1 && users.length > headItemsCount"
				class="chart-wizard-tree-preview__node_head-rest"
				:class="{ '--active': headsVisible }"
				ref="showMoreHeadUserWizardList"
				:data-test-id="'hr-company-structure_chart-wizard-tree__preview-' + userType + '-rest'"
				@click.stop="headsVisible = true"
			>
					{{ '+' + String(users.length - headItemsCount) }}
			</span>
		</div>
		<div
			v-if="users.length === 0 && showPlaceholder"
			class="chart-wizard-tree-preview__node_head"
			:class="{ '--deputy': isDeputy }"
		>
			<img
				:src="placeholderAvatar"
				class="chart-wizard-tree-preview__node_head-avatar --placeholder"
				:class="{'--deputy': isDeputy, '--old': isExistingDepartment  }"
			/>
			<div class="chart-wizard-tree-preview__node_head-text">
				<span
					class="chart-wizard-tree-preview__placeholder_name"
					:class="{'--deputy': isDeputy, '--team': isTeamEntity }"
					:style="{ 'background-color': teamColor ? teamColor.namePlaceholder : false }"
				></span>
				<span
					v-if="!isDeputy"
					class="chart-wizard-tree-preview__node_head-position --crop"
				>
					{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_HEAD_POSITION') }}
				</span>
			</div>
		</div>

		<UserListActionMenu
			v-if="headsVisible"
			:id="isDeputy ? 'wizard-head-list-popup-deputy' : 'wizard-head-list-popup-head' "
			:items="dropdownItems"
			:width="228"
			:bindElement="$refs.showMoreHeadUserWizardList[0]"
			@close="headsVisible = false"
			:titleBar="titleBar"
		/>
	`
	};

	const TreeNode = {
	  name: 'treeNode',
	  components: {
	    HeadUsers
	  },
	  props: {
	    name: String,
	    heads: Array,
	    userCount: Number,
	    nodeId: Number,
	    entityType: {
	      type: String,
	      default: humanresources_companyStructure_utils.EntityTypes.department
	    },
	    /** @type NodeColorSettingsType | null */
	    teamColor: {
	      type: [Object, null],
	      default: null
	    }
	  },
	  data() {
	    return {
	      isShowLoader: false
	    };
	  },
	  created() {
	    this.memberRoles = humanresources_companyStructure_api.getMemberRoles(this.departmentData.entityType);
	  },
	  watch: {
	    isShowLoader(newValue) {
	      if (!newValue) {
	        return;
	      }
	      this.$nextTick(() => {
	        const {
	          loaderContainer
	        } = this.$refs;
	        const loader = new main_loader.Loader({
	          size: 30
	        });
	        loader.show(loaderContainer);
	      });
	    }
	  },
	  computed: {
	    departmentData() {
	      if (this.isExistingDepartment) {
	        if (!this.isHeadsLoaded) {
	          this.loadHeads([this.nodeId]);
	        }
	        return this.departments.get(this.nodeId);
	      }
	      return {
	        name: this.name,
	        heads: this.heads,
	        userCount: this.userCount,
	        entityType: this.entityType
	      };
	    },
	    isExistingDepartment() {
	      return Boolean(this.nodeId);
	    },
	    employeesCount() {
	      var _this$heads;
	      return (this.userCount || 0) - (((_this$heads = this.heads) == null ? void 0 : _this$heads.length) || 0);
	    },
	    headUsers() {
	      var _this$departmentData$;
	      return (_this$departmentData$ = this.departmentData.heads) == null ? void 0 : _this$departmentData$.filter(head => {
	        return head.role === this.memberRoles.head;
	      });
	    },
	    deputyUsers() {
	      var _this$departmentData$2;
	      return (_this$departmentData$2 = this.departmentData.heads) == null ? void 0 : _this$departmentData$2.filter(head => {
	        return head.role === this.memberRoles.deputyHead;
	      });
	    },
	    showInfo() {
	      return this.nodeId ? humanresources_companyStructure_permissionChecker.PermissionChecker.getInstance().hasPermission(humanresources_companyStructure_permissionChecker.PermissionActions.structureView, this.nodeId) : true;
	    },
	    isHeadsLoaded(departmentId) {
	      const {
	        heads
	      } = this.departments.get(this.nodeId);
	      return Boolean(heads);
	    },
	    isTeamEntity() {
	      return this.departmentData.entityType === humanresources_companyStructure_utils.EntityTypes.team;
	    },
	    dataTestIdSuffix() {
	      return this.isExistingDepartment ? '' : '_new';
	    },
	    ...ui_vue3_pinia.mapState(humanresources_companyStructure_chartStore.useChartStore, ['departments'])
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    locPlural(phraseCode, count) {
	      return main_core.Loc.getMessagePlural(phraseCode, count, {
	        '#COUNT#': count
	      });
	    },
	    async loadHeads(departmentIds) {
	      const store = humanresources_companyStructure_chartStore.useChartStore();
	      try {
	        this.isShowLoader = true;
	        await store.loadHeads(departmentIds);
	      } finally {
	        this.isShowLoader = false;
	      }
	    },
	    formatDataTestId(prefix) {
	      return prefix + this.dataTestIdSuffix;
	    }
	  },
	  template: `
		<div
			class="chart-wizard-tree-preview__node"
			:class="{ '--new': !isExistingDepartment, '--old': isExistingDepartment,'--team': isTeamEntity }"
		>
			<div 
				class="chart-wizard-tree-preview__node_summary" 
				:class="{ '--old': isExistingDepartment, '--team': isTeamEntity }"
				:style="{ '--team-border-color': teamColor?.previewBorder }"
			>
				<div 
					class="chart-wizard-tree-preview__node_name --crop"
					:data-test-id="formatDataTestId('chart-wizard-tree-preview__node_name')"
					:style="{ 'background-color': teamColor ? teamColor.headBackground : false }"
				>
					<span
						v-if="!departmentData.name" 
						class="chart-wizard-tree-preview__placeholder_node_name"
						:class="{ '--team': isTeamEntity }"
						:style="{ 'background-color': teamColor ? teamColor.namePlaceholder : false }"
					></span>
					{{departmentData.name}}
				</div>
				<div 
					class="chart-wizard-tree-preview__node_content"
					:data-test-id="formatDataTestId('chart-wizard-tree-preview__head_list')"
				>
					<div
						class="chart-wizard-tree-preview__head_list"
						:data-test-id="formatDataTestId('chart-wizard-tree-preview__head_list')"
					>
						<HeadUsers
							v-if="showInfo && headUsers"
							:users="headUsers"
							:showPlaceholder="!isExistingDepartment"
							:isTeamEntity="isTeamEntity"
							:isExistingDepartment="isExistingDepartment"
							:teamColor="teamColor"
						/> 
					</div>
					<div v-if="isShowLoader" ref="loaderContainer"></div>
					<div
						v-if="showInfo && !isExistingDepartment"
						class="chart-wizard-tree-preview__node_employees"
					>
						<div
							class="chart-wizard-tree-preview__node_employees-list"
							:data-test-id="formatDataTestId('chart-wizard-tree-preview__node_employees-list')"
						>
							<p class="chart-wizard-tree-preview__node_employees-title">
								{{
									isTeamEntity 
									? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TREE_PREVIEW_TEAM_EMPLOYEES_TITLE') 
									: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TREE_PREVIEW_EMPLOYEES_TITLE')
								}}
							</p>
							<span class="chart-wizard-tree-preview__node_employees_count">
								{{locPlural('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TREE_PREVIEW_EMPLOYEES_COUNT', employeesCount)}}
							</span>
						</div>
						<div 
							class="chart-wizard-tree-preview__node_deputies"
							:data-test-id="formatDataTestId('chart-wizard-tree-preview__node_deputies-list')"
						>
							<p class="chart-wizard-tree-preview__node_employees-title">
								{{loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TREE_PREVIEW_DEPUTIES_TITLE')}}
							</p>
							<HeadUsers
								:users="deputyUsers"
								:isTeamEntity="isTeamEntity"
								:isExistingDepartment="isExistingDepartment"
								userType="deputy"
								:teamColor="teamColor"
							/>
						</div>
					</div>
				</div>
			</div>
			<slot v-if="isExistingDepartment"></slot>
		</div>
	`
	};

	const TreePreview = {
	  name: 'treePreview',
	  components: {
	    TreeNode
	  },
	  props: {
	    parentId: {
	      type: [Number, null],
	      required: true
	    },
	    name: {
	      type: String,
	      required: true
	    },
	    heads: {
	      type: Array,
	      required: true
	    },
	    userCount: {
	      type: Number,
	      required: true
	    },
	    entityType: {
	      type: String,
	      default: humanresources_companyStructure_utils.EntityTypes.department
	    },
	    /** @type NodeColorSettingsType | null */
	    teamColor: {
	      type: [Object, null],
	      default: null
	    }
	  },
	  computed: {
	    rootId() {
	      const parentNode = this.departments.get(this.parentId);
	      if (parentNode) {
	        var _parentNode$parentId;
	        return (_parentNode$parentId = parentNode.parentId) != null ? _parentNode$parentId : 0;
	      }
	      return 0;
	    },
	    companyName() {
	      const {
	        name
	      } = [...this.departments.values()].find(department => {
	        return department.parentId === 0;
	      });
	      return name;
	    },
	    isTeamEntity() {
	      return this.entityType === humanresources_companyStructure_utils.EntityTypes.team;
	    },
	    ...ui_vue3_pinia.mapState(humanresources_companyStructure_chartStore.useChartStore, ['departments'])
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    }
	  },
	  template: `
		<div class="chart-wizard-tree-preview">
			<div class="chart-wizard-tree-preview__header">
				<span class="chart-wizard-tree-preview__header_text">
					{{
						isTeamEntity
							? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TREE_PREVIEW_TEAM_TITLE')
							: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TREE_PREVIEW_DEPARTMENT_TITLE')
					}}
				</span>
				<span class="chart-wizard-tree-preview__header_name">
					{{ companyName }}
				</span>
			</div>
			<TreeNode
				v-if="rootId"
				:nodeId="rootId"
			>
				<TreeNode :nodeId="parentId">
					<TreeNode
						:name="name"
						:heads="heads"
						:userCount="userCount"
						:entityType="entityType"
						:teamColor="teamColor"
					></TreeNode>
				</TreeNode>
			</TreeNode>
			<TreeNode
				v-else-if="parentId"
				:nodeId="parentId"
			>
				<TreeNode
					:name="name"
					:heads="heads"
					:userCount="userCount"
					:entityType="entityType"
					:teamColor="teamColor"
				></TreeNode>
			</TreeNode>
			<TreeNode
				v-else
				:name="name"
				:heads="heads"
				:userCount="userCount"
				:entityType="entityType"
				:teamColor="teamColor"
			></TreeNode>
		</div>
	`
	};

	// @vue/component
	const TeamColorPicker = {
	  name: 'TeamColorPicker',
	  components: {
	    BasePopup: humanresources_companyStructure_structureComponents.BasePopup
	  },
	  props: {
	    /** @type NodeColorSettingsType */
	    modelValue: {
	      type: Object,
	      required: true
	    },
	    bindElement: {
	      type: HTMLElement,
	      required: true
	    }
	  },
	  emits: ['action', 'close', 'update:modelValue'],
	  computed: {
	    popupConfig() {
	      const popupWidth = 164;
	      const pickerWidth = 41;
	      const initialPopupOffset = 39;
	      const angleWidth = 33;
	      return {
	        width: popupWidth,
	        height: 116,
	        bindElement: this.bindElement,
	        borderRadius: 12,
	        contentNoPaddings: true,
	        contentPadding: 0,
	        padding: 0,
	        offsetTop: 4,
	        offsetLeft: pickerWidth / 2 - popupWidth / 2 + initialPopupOffset,
	        angleOffset: popupWidth / 2 - angleWidth / 2
	      };
	    },
	    nodeColorsSettingsDict() {
	      return humanresources_companyStructure_utils.NodeColorsSettingsDict;
	    }
	  },
	  methods: {
	    close() {
	      this.$emit('close');
	    }
	  },
	  template: `
		<BasePopup
			:config="popupConfig"
			:id="'chart_wizard__department__color-picker_popup'"
			@close="close"
		>
			<div
				class="chart_wizard__department__color-picker_popup-container"
				:data-test-id="'wizard-department-color-picker-popup'"
			>
				<div v-for="item in nodeColorsSettingsDict" 
					 class="chart_wizard__department__color-picker_color-item"
					 :class=" {'--active': item.name === modelValue.name }"
					 @click="$emit('update:modelValue', item)"
					 :data-test-id="'wizard-department-color-picker-item-'+item.name"
				>
					<div class="chart_wizard__department__color-picker_color-item_inner"
						 :style="{ 'background-color': item.pickerColor }"
					></div>
				</div>
			</div>
		</BasePopup>
	`
	};

	// @vue/component
	const Department = {
	  name: 'department',
	  components: {
	    TeamColorPicker
	  },
	  props: {
	    parentId: {
	      type: [Number, null],
	      required: true
	    },
	    name: {
	      type: String,
	      required: true
	    },
	    description: {
	      type: String,
	      required: true
	    },
	    shouldErrorHighlight: {
	      type: Boolean,
	      required: true
	    },
	    isEditMode: {
	      type: Boolean
	    },
	    entityType: {
	      type: String,
	      required: true
	    },
	    teamColor: {
	      type: [Object, null],
	      default: null
	    },
	    refToFocus: {
	      type: String,
	      default: null
	    }
	  },
	  emits: ['applyData'],
	  data() {
	    return {
	      deniedError: false,
	      showColorPicker: false,
	      teamColorValue: this.teamColor
	    };
	  },
	  watch: {
	    isTeamEntity() {
	      // tag selector is not valid now
	      this.recreateTagSelector();
	    }
	  },
	  created() {
	    this.selectedParentDepartment = this.parentId;
	    this.departmentName = this.name;
	    this.departmentDescription = this.description;
	    this.departmentSelectorCashe = new main_core_cache.MemoryCache();
	    this.departmentsSelector = this.getOrCreateTagSelector();
	  },
	  mounted() {
	    this.departmentsSelector.renderTo(this.$refs['tag-selector']);
	  },
	  activated() {
	    this.teamColorValue = this.teamColor;
	    this.$emit('applyData', {
	      isDepartmentDataChanged: false,
	      isValid: this.departmentName !== '' && this.selectedParentDepartment !== null && !this.deniedError
	    });
	    if (this.refToFocus && this.$refs[this.refToFocus]) {
	      this.$refs[this.refToFocus].focus();
	    } else {
	      this.$refs.title.focus();
	    }
	  },
	  methods: {
	    recreateTagSelector() {
	      this.$refs['tag-selector'].innerHTML = '';
	      this.departmentsSelector = this.getOrCreateTagSelector();
	      this.departmentsSelector.renderTo(this.$refs['tag-selector']);
	    },
	    createTagSelector() {
	      const locked = this.parentId === 0 && this.isEditMode;
	      let preselectedItems = this.parentId ? [['structure-node', this.parentId]] : [];
	      if (!this.isEditMode) {
	        const permissionChecker = humanresources_companyStructure_permissionChecker.PermissionChecker.getInstance();
	        const permissionAction = this.isTeamEntity ? humanresources_companyStructure_permissionChecker.PermissionActions.teamCreate : humanresources_companyStructure_permissionChecker.PermissionActions.departmentCreate;
	        if (permissionChecker && !permissionChecker.hasPermission(permissionAction, this.parentId)) {
	          preselectedItems = [['structure-node', 0]];
	        }
	      }
	      const isTabEmpty = tab => tab.getRootNode().getChildren().count() === 0;
	      const selector = new ui_entitySelector.TagSelector({
	        events: {
	          onTagAdd: event => {
	            const {
	              tag
	            } = event.data;
	            this.selectedParentDepartment = tag.id;
	          },
	          onTagRemove: () => {
	            this.selectedParentDepartment = null;
	            this.applyData();
	          }
	        },
	        multiple: false,
	        locked,
	        dialogOptions: {
	          width: 425,
	          height: 350,
	          dropdownMode: true,
	          hideOnDeselect: true,
	          entities: [{
	            id: 'structure-node',
	            options: {
	              selectMode: 'departmentsOnly',
	              restricted: this.isEditMode ? 'update' : 'create',
	              includedNodeEntityTypes: this.includedNodeEntityTypesInDialog,
	              useMultipleTabs: true
	            }
	          }],
	          preselectedItems,
	          events: {
	            onLoad: event => {
	              var _target$selectedItems, _target$selectedItems2, _target$selectedItems3;
	              const dialog = selector.getDialog();
	              dialog.getTabs().filter(tab => isTabEmpty(tab)).forEach(tab => tab.setVisible(false));
	              if (this.isEditMode) {
	                return;
	              }
	              const permissionChecker = humanresources_companyStructure_permissionChecker.PermissionChecker.getInstance();
	              if (!permissionChecker) {
	                return;
	              }
	              const target = event.target;
	              const selectedItem = (_target$selectedItems = target.selectedItems) == null ? void 0 : (_target$selectedItems2 = _target$selectedItems.values()) == null ? void 0 : (_target$selectedItems3 = _target$selectedItems2.next()) == null ? void 0 : _target$selectedItems3.value;
	              const nodes = target.items.get('structure-node');
	              const permissionAction = this.isTeamEntity ? humanresources_companyStructure_permissionChecker.PermissionActions.teamCreate : humanresources_companyStructure_permissionChecker.PermissionActions.departmentCreate;
	              for (const [, node] of nodes) {
	                var _selectedItem$id;
	                if (permissionChecker.hasPermission(permissionAction, node.id) && !permissionChecker.hasPermission(permissionAction, (_selectedItem$id = selectedItem == null ? void 0 : selectedItem.id) != null ? _selectedItem$id : 0)) {
	                  node.select();
	                  break;
	                }
	              }
	            },
	            onLoadError: () => {
	              this.selectedParentDepartment = null;
	              this.applyData();
	            },
	            'Item:onSelect': event => {
	              var _target$selectedItems4, _target$selectedItems5, _target$selectedItems6;
	              this.deniedError = false;
	              const target = event.target;
	              const selectedItem = (_target$selectedItems4 = target.selectedItems) == null ? void 0 : (_target$selectedItems5 = _target$selectedItems4.values()) == null ? void 0 : (_target$selectedItems6 = _target$selectedItems5.next()) == null ? void 0 : _target$selectedItems6.value;
	              const permissionChecker = humanresources_companyStructure_permissionChecker.PermissionChecker.getInstance();
	              if (!permissionChecker) {
	                return;
	              }
	              const permissionCreateAction = this.isTeamEntity ? humanresources_companyStructure_permissionChecker.PermissionActions.teamCreate : humanresources_companyStructure_permissionChecker.PermissionActions.departmentCreate;
	              const permissionEditAction = this.isTeamEntity ? humanresources_companyStructure_permissionChecker.PermissionActions.teamEdit : humanresources_companyStructure_permissionChecker.PermissionActions.departmentEdit;
	              const permissionAction = this.isEditMode ? permissionEditAction : permissionCreateAction;
	              if (!permissionChecker.hasPermission(permissionAction, selectedItem.id)) {
	                this.deniedError = true;
	              }
	              this.applyData();
	            }
	          }
	        }
	      });
	      return selector;
	    },
	    getOrCreateTagSelector() {
	      const key = String(this.isTeamEntity);
	      return this.departmentSelectorCashe.remember(key, () => this.createTagSelector());
	    },
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    applyData() {
	      this.$emit('applyData', {
	        name: this.departmentName,
	        description: this.departmentDescription,
	        parentId: this.selectedParentDepartment,
	        teamColor: this.teamColorValue,
	        isDepartmentDataChanged: true,
	        isValid: this.departmentName !== '' && this.selectedParentDepartment !== null && !this.deniedError
	      });
	    }
	  },
	  computed: {
	    includedNodeEntityTypesInDialog() {
	      return this.isTeamEntity ? ['department', 'team'] : ['department'];
	    },
	    isTeamEntity() {
	      return this.entityType === humanresources_companyStructure_utils.EntityTypes.team;
	    },
	    namePlaceholder() {
	      return this.isTeamEntity ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_NAME_PLACEHOLDER_MSGVER_1') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_NAME_PLACEHOLDER');
	    },
	    descriptionPlaceholder() {
	      return this.isTeamEntity ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_DESCR_PLACEHOLDER') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_DESCR_PLACEHOLDER');
	    },
	    higherLevelDepartmentContainer() {
	      // for team entity department tag selector should be placed after name and description
	      // to presumably encourage user to fill in the description field
	      return this.isTeamEntity ? '.chart-wizard__department_higher_bottom' : '.chart-wizard__department_higher_top';
	    }
	  },
	  template: `
		<div class="chart-wizard__department">
			<div class="chart-wizard__form">
				<Teleport defer :to="higherLevelDepartmentContainer">
					<span class="chart-wizard__department_item-label">
						{{
							isTeamEntity
								? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_HIGHER_WITH_TEAM_LABEL')
								: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_HIGHER_LABEL')
						}}
					</span>
					<div
						:class="{ 'ui-ctl-warning': deniedError || (selectedParentDepartment === null && shouldErrorHighlight) }"
						ref="tag-selector"
					></div>
					<div
						v-if="deniedError || (selectedParentDepartment === null && shouldErrorHighlight)"
						class="chart-wizard__department_item-error"
					>
						<div class="ui-icon-set --warning"></div>
						<span
							v-if="deniedError"
							class="chart-wizard__department_item-error-message"
						>
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ADD_TO_DEPARTMENT_DENIED_MSG_VER_1') }}
						</span>
						<span
							v-else
							class="chart-wizard__department_item-error-message"
						>
							{{
								isTeamEntity
									? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_PARENT_ERROR')
									: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_PARENT_ERROR')
							}}
						</span>
					</div>
				</Teleport>
				<div
					v-show="!isTeamEntity"
					class="chart-wizard__department_item chart-wizard__department_higher_top">
				</div>
				<div class="chart-wizard__department_item">
					<span class="chart-wizard__department_item-label">
						{{
							isTeamEntity
								? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_TEAM_NAME_LABEL')
								: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_NAME_LABEL') 
						}}
					</span>
					<div class="chart-wizard__department_control-wrapper">
						<div
							class="ui-ctl ui-ctl-textbox"
							:class="{ 'ui-ctl-warning': shouldErrorHighlight && departmentName === '' }"
						>
							<input
								v-model="departmentName"
								type="text"
								maxlength="255"
								class="ui-ctl-element"
								ref="title"
								:placeholder="namePlaceholder"
								@input="applyData()"
							/>
						</div>
						<div v-if="isTeamEntity" 
							 class="chart-wizard__department__color-picker" 
							 @click="showColorPicker = true"
							 ref="TeamColorPicker"
							 :data-test-id="'wizard-department-color-picker'"
							 :class="{ '--active': showColorPicker }"
						>
							<div class="chart-wizard__department__color-picker_inner"
								 :style="{ 'background-color': teamColorValue?.pickerColor }"
							></div>
						</div>
					</div>
					<div
						v-if="shouldErrorHighlight && departmentName === ''"
						class="chart-wizard__department_item-error"
					>
						<div class="ui-icon-set --warning"></div>
						<span class="chart-wizard__department_item-error-message">
							{{
								isTeamEntity
									? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_NAME_ERROR')
									: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_NAME_ERROR')
							}}
						</span>
					</div>
				</div>
				<div class="chart-wizard__department_item">
					<span class="chart-wizard__department_item-label">
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_DESCR_LABEL') }}
					</span>
					<div class="ui-ctl ui-ctl-textarea ui-ctl-no-resize">
						<textarea
							v-model="departmentDescription"
							maxlength="255"
							class="ui-ctl-element"
							ref="description"
							:placeholder="descriptionPlaceholder"
							@change="applyData()"
						>
						</textarea>
					</div>
				</div>
				<div
					v-show="isTeamEntity"
					class="chart-wizard__department_item chart-wizard__department_higher_bottom"
				></div>
			</div>
			<TeamColorPicker
				v-if="showColorPicker"
				:bindElement="$refs.TeamColorPicker"
				v-model="teamColorValue"
				@update:model-value="applyData()"
				@close="showColorPicker = false"
			/>
		</div>
	`
	};

	const MenuOption = Object.freeze({
	  moveUsers: 'moveUsers',
	  addUsers: 'addUsers'
	});
	const ChangeSaveModeControl = {
	  name: 'changeSaveModeControl',
	  emits: ['saveModeChanged'],
	  components: {
	    RouteActionMenu: humanresources_companyStructure_structureComponents.RouteActionMenu
	  },
	  created() {
	    this.menuItems = this.getMenuItems();
	  },
	  data() {
	    return {
	      menuVisible: false,
	      actionId: MenuOption.moveUsers
	    };
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    onActionMenuItemClick(actionId) {
	      this.actionId = actionId;
	      this.$emit('saveModeChanged', actionId);
	    },
	    getMenuItems() {
	      return [{
	        id: MenuOption.moveUsers,
	        title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_MOVE_USERS_TITLE'),
	        description: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_MOVE_USERS_DESCRIPTION'),
	        bIcon: {
	          name: ui_iconSet_api_core.Main.PERSON_ARROW_LEFT_1,
	          size: 20,
	          color: humanresources_companyStructure_utils.getColorCode('paletteBlue50')
	        }
	      }, {
	        id: MenuOption.addUsers,
	        title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_ADD_USERS_TITLE'),
	        description: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_ADD_USERS_DESCRIPTION'),
	        bIcon: {
	          name: ui_iconSet_api_core.CRM.PERSON_PLUS_2,
	          size: 20,
	          color: humanresources_companyStructure_utils.getColorCode('paletteBlue50')
	        }
	      }];
	    }
	  },
	  computed: {
	    getControlButtonText() {
	      const phraseCode = this.actionId === MenuOption.moveUsers ? 'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_MOVE_USERS_TITLE' : 'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_ADD_USERS_TITLE';
	      return this.loc(phraseCode);
	    }
	  },
	  template: `
		<div
			class="chart-wizard__change-save-mode-control-container"
		>
			<span>{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_SAVE_MODE_CONTROL_TEXT') }}</span>
			<a
				class="chart-wizard__change-save-mode-control-button"
				:class="{ '--focused': menuVisible }"
				ref='changeSaveModeButton'
				@click="menuVisible = true"
			>
				{{ getControlButtonText }}
			</a>
		</div>
		<RouteActionMenu
			v-if="menuVisible"
			:id="'hr-wizard-save-mode-menu'"
			:items="menuItems"
			:width="302"
			:bindElement="$refs.changeSaveModeButton"
			@action="onActionMenuItemClick"
			@close="menuVisible = false"
		/>
	`
	};

	const Employees = {
	  name: 'employees',
	  components: {
	    ChangeSaveModeControl
	  },
	  emits: ['applyData', 'saveModeChanged'],
	  props: {
	    heads: {
	      type: Array,
	      required: true
	    },
	    employeesIds: {
	      type: Array,
	      required: true
	    },
	    isEditMode: {
	      type: Boolean,
	      required: true
	    },
	    entityType: {
	      type: String,
	      required: true
	    }
	  },
	  created() {
	    this.memberRoles = humanresources_companyStructure_api.getMemberRoles(this.entityType);
	    this.selectedUsers = new Set();
	    this.departmentHeads = [];
	    this.departmentEmployees = [];
	    this.removedUsers = [];
	    this.headSelector = this.getUserSelector(humanresources_companyStructure_api.memberRolesKeys.head);
	    this.deputySelector = this.getUserSelector(humanresources_companyStructure_api.memberRolesKeys.deputyHead);
	    this.employeesSelector = this.getUserSelector(humanresources_companyStructure_api.memberRolesKeys.employee);
	    this.userCount = 0;

	    // store initial users to control applyData method in tagSelector
	    this.initialUsers = this.heads.reduce((set, item) => set.add(item.id), new Set());
	  },
	  mounted() {
	    this.headSelector.renderTo(this.$refs['head-selector']);
	    this.deputySelector.renderTo(this.$refs['deputy-selector']);
	    this.employeesSelector.renderTo(this.$refs['employees-selector']);
	  },
	  watch: {
	    entityType(entityType) {
	      const prevMemberRoles = this.memberRoles;
	      const rolesKeys = Object.keys(prevMemberRoles);
	      this.memberRoles = humanresources_companyStructure_api.getMemberRoles(entityType);
	      this.departmentHeads = this.departmentHeads.map(item => {
	        const roleKey = rolesKeys.find(key => prevMemberRoles[key] === item.role);
	        return {
	          ...item,
	          role: this.memberRoles[roleKey]
	        };
	      });
	      this.departmentEmployees = this.departmentEmployees.map(item => ({
	        ...item,
	        role: this.memberRoles.employee
	      }));
	    },
	    employeesIds: {
	      handler(payload) {
	        this.employeesIds.forEach(item => this.initialUsers.add(item));
	        const preselectedEmployees = payload.map(employeeId => ['user', employeeId]);
	        const {
	          dialog
	        } = this.employeesSelector;
	        dialog.setPreselectedItems(preselectedEmployees);
	        dialog.load();
	      }
	    }
	  },
	  methods: {
	    getPreselectedItems(role) {
	      if (this.memberRoles.employee === role) {
	        return this.employeesIds.map(employeeId => ['user', employeeId]);
	      }
	      return this.heads.filter(head => head.role === role).map(head => {
	        return ['user', head.id];
	      });
	    },
	    getUserSelector(roleKey) {
	      const selector = new ui_entitySelector.TagSelector({
	        events: {
	          onTagAdd: event => {
	            const {
	              tag
	            } = event.getData();
	            this.selectedUsers.add(tag.id);
	            this.onSelectorToggle(tag, this.memberRoles[roleKey]);
	            if (this.initialUsers.has(tag.id)) {
	              this.initialUsers.delete(tag.id);
	            } else {
	              this.applyData();
	            }
	          },
	          onTagRemove: event => {
	            const {
	              tag
	            } = event.getData();
	            this.selectedUsers.delete(tag.id);
	            this.onSelectorToggle(tag, this.memberRoles[roleKey]);
	            this.applyData();
	          }
	        },
	        multiple: true,
	        dialogOptions: {
	          preselectedItems: this.getPreselectedItems(this.memberRoles[roleKey]),
	          popupOptions: {
	            events: {
	              onBeforeShow: () => {
	                dialog.setHeight(250);
	                if (dialog.isLoaded()) {
	                  this.toggleUsers(dialog);
	                }
	              }
	            }
	          },
	          events: {
	            onShow: () => {
	              const {
	                dialog
	              } = selector;
	              const container = dialog.getContainer();
	              const {
	                top
	              } = container.getBoundingClientRect();
	              const offset = top + container.offsetHeight - document.body.offsetHeight;
	              if (offset > 0) {
	                const margin = 5;
	                dialog.setHeight(container.offsetHeight - offset - margin);
	              }
	            },
	            onLoad: event => {
	              this.toggleUsers(dialog);
	              const users = event.target.items.get('user');
	              users.forEach(user => {
	                user.setLink('');
	              });
	            },
	            'SearchTab:onLoad': () => {
	              this.toggleUsers(dialog);
	            }
	          },
	          height: 250,
	          width: 380,
	          entities: [{
	            id: 'user',
	            options: {
	              intranetUsersOnly: true,
	              inviteEmployeeLink: true
	            }
	          }],
	          dropdownMode: true,
	          hideOnDeselect: false
	        }
	      });
	      const dialog = selector.getDialog();
	      return selector;
	    },
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    toggleUsers(dialog) {
	      const items = dialog.getItems();
	      items.forEach(item => {
	        const hidden = this.selectedUsers.has(item.id) && !dialog.selectedItems.has(item);
	        item.setHidden(hidden);
	      });
	    },
	    onSelectorToggle(tag, role) {
	      const item = tag.selector.dialog.getItem(['user', tag.id]);
	      const userData = humanresources_companyStructure_utils.getUserDataBySelectorItem(item, role);
	      const isEmployee = role === this.memberRoles.employee;
	      if (!tag.rendered) {
	        this.removedUsers = this.removedUsers.filter(user => user.id !== userData.id);
	        if (isEmployee) {
	          this.departmentEmployees = [...this.departmentEmployees, {
	            ...userData
	          }];
	        } else {
	          this.departmentHeads = [...this.departmentHeads, {
	            ...userData
	          }];
	        }
	        this.userCount += 1;
	        return;
	      }
	      const {
	        preselectedItems = []
	      } = tag.selector.dialog;
	      const parsedPreselected = preselectedItems.flat().filter(item => item !== 'user');
	      if (parsedPreselected.includes(userData.id)) {
	        this.removedUsers = [...this.removedUsers, {
	          ...userData,
	          role
	        }];
	      }
	      if (isEmployee) {
	        this.departmentEmployees = this.departmentEmployees.filter(employee => employee.id !== tag.id);
	      } else {
	        this.departmentHeads = this.departmentHeads.filter(head => head.id !== tag.id);
	      }
	      this.userCount -= 1;
	    },
	    applyData() {
	      this.$emit('applyData', {
	        heads: this.departmentHeads,
	        employees: this.departmentEmployees,
	        removedUsers: this.removedUsers,
	        userCount: this.userCount,
	        isDepartmentDataChanged: true
	      });
	    },
	    handleSaveModeChangedChanged(actionId) {
	      this.$emit('saveModeChanged', actionId);
	    }
	  },
	  computed: {
	    isTeamEntity() {
	      return this.entityType === humanresources_companyStructure_utils.EntityTypes.team;
	    },
	    employeeTitle() {
	      return this.isTeamEntity ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_TEAM_EMPLOYEES_TITLE') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_EMPLOYEES_TITLE');
	    }
	  },
	  template: `
		<div class="chart-wizard__employee">
			<div class="chart-wizard__form">
				<div class="chart-wizard__employee_item">
					<span class="chart-wizard__employee_item-label">
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_HEAD_TITLE') }}
					</span>
					<div
						class="chart-wizard__employee_selector"
						ref="head-selector"
						data-test-id="hr-company-structure_chart-wizard__employees-head-selector"
					/>
					<span class="chart-wizard__employee_item-description">
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_HEAD_DESCR') }}
					</span>
				</div>
				<div class="chart-wizard__employee_item">
					<span class="chart-wizard__employee_item-label">
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_DEPUTY_TITLE') }}
					</span>
					<div
						class="chart-wizard__employee_selector"
						ref="deputy-selector"
						data-test-id="hr-company-structure_chart-wizard__employees-deputy-selector"
					/>
					<span class="chart-wizard__employee_item-description">
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEE_DEPUTY_DESCR') }}
					</span>
				</div>
				<div class="chart-wizard__employee_item">
					<span class="chart-wizard__employee_item-label">
						{{ employeeTitle }}
					</span>
					<div
						class="chart-wizard__employee_selector"
						ref="employees-selector"
						data-test-id="hr-company-structure_chart-wizard__employees-employee-selector"
					/>
				</div>
				<div v-if="!isTeamEntity" class="chart-wizard__employee_item --change-save-mode-control">
					<ChangeSaveModeControl
						v-if="!isEditMode"
						@saveModeChanged="handleSaveModeChangedChanged"
					></ChangeSaveModeControl>
					<div class="chart-wizard__change-save-mode-control-container" v-else>
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_EDIT_WIZARD_EMPLOYEE_SAVE_MODE_TEXT') }}
					</div>
				</div>
			</div>
		</div>
	`
	};

	/**
	 * ui.hint with reactive content
	 */
	const ResponsiveHint = {
	  name: 'ResponsiveHint',
	  props: {
	    content: {
	      type: String,
	      required: true
	    },
	    width: {
	      type: Number,
	      default: 300
	    },
	    extraClasses: {
	      type: Object
	    },
	    top: {
	      type: Boolean,
	      default: false
	    },
	    alignCenter: {
	      type: Boolean,
	      default: false
	    }
	  },
	  created() {
	    this.hint = null;
	  },
	  mounted() {
	    const container = this.$refs['hint-container'];
	    const parameters = {
	      width: this.width
	    };
	    if (this.top) {
	      parameters.bindOptions = {
	        position: 'top'
	      };
	    }
	    if (this.alignCenter) {
	      parameters.offsetLeft = container.offsetWidth / 2 - this.width / 2 + 39;
	      parameters.angle = {
	        offset: this.width / 2 - 33 / 2
	      };
	    }
	    main_core.Event.bind(this.$refs['hint-container'], 'mouseenter', () => {
	      this.hint = main_core.Reflection.getClass('BX.UI.Hint').createInstance({
	        popupParameters: {
	          ...parameters
	        } // destruct parameters to recreate hint
	      });

	      this.hint.show(this.$refs['hint-container'], this.content);
	    });
	    main_core.Event.bind(this.$refs['hint-container'], 'mouseleave', () => {
	      var _this$hint;
	      (_this$hint = this.hint) == null ? void 0 : _this$hint.hide(); // hide() function also destroys popup
	    });
	  },

	  unmounted() {
	    var _this$hint2;
	    (_this$hint2 = this.hint) == null ? void 0 : _this$hint2.hide();
	  },
	  template: `
		<span class="ui-hint" ref="hint-container" :class="extraClasses">
			<span class="ui-hint-icon"/>
		</span>
	`
	};

	// @vue/component
	const DefaultHint = {
	  name: 'DefaultHint',
	  components: {
	    ResponsiveHint
	  },
	  props: {
	    content: {
	      type: String,
	      required: true
	    },
	    width: {
	      type: Number,
	      default: 300
	    }
	  },
	  template: `
		<ResponsiveHint :content=content :classes="{ 'ui-hint': true }">
			<span class="ui-hint-icon"/>
		</ResponsiveHint>
	`
	};

	const BindChat = {
	  name: 'bindChat',
	  emits: ['applyData'],
	  components: {
	    DefaultHint,
	    BIcon: ui_iconSet_api_vue.BIcon
	  },
	  props: {
	    heads: {
	      type: Array,
	      required: false
	    },
	    name: {
	      type: String,
	      required: true
	    },
	    entityType: {
	      type: String,
	      required: true
	    }
	  },
	  data() {
	    // this boolean values are true by default but false if no heads specified
	    return {
	      createDefaultChat: true,
	      createDefaultChannel: true
	    };
	  },
	  created() {
	    this.chatSelector = this.getChatSelector();
	    this.channelSelector = this.getChannelSelector();
	    this.chats = [];
	    this.channels = [];
	    if (!this.headsCreated) {
	      this.createDefaultChat = false;
	      this.createDefaultChannel = false;
	    }
	  },
	  mounted() {
	    this.chatSelector.renderTo(this.$refs['chat-selector']);
	    this.channelSelector.renderTo(this.$refs['channel-selector']);
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    getChatSelector() {
	      const options = {
	        multiple: true,
	        events: {
	          onTagAdd: event => {
	            const {
	              tag
	            } = event.getData();
	            this.chats.push(Number(tag.id.replace('chat', '')));
	            this.applyData();
	          },
	          onTagRemove: event => {
	            const {
	              tag
	            } = event.getData();
	            const intId = Number(tag.id.replace('chat', ''));
	            this.chats = this.chats.filter(chat => chat !== intId);
	            this.applyData();
	          }
	        },
	        dialogOptions: {
	          enableSearch: true,
	          height: 250,
	          width: 380,
	          dropdownMode: true,
	          recentTabOptions: humanresources_companyStructure_structureComponents.getChatRecentTabOptions(this.entityType, humanresources_companyStructure_structureComponents.ChatTypeDict.chat),
	          entities: [humanresources_companyStructure_structureComponents.getChatDialogEntity()]
	        }
	      };
	      return new ui_entitySelector.TagSelector(options);
	    },
	    getChannelSelector() {
	      const options = {
	        multiple: true,
	        events: {
	          onTagAdd: event => {
	            const {
	              tag
	            } = event.getData();
	            this.channels.push(Number(tag.id.replace('chat', '')));
	            this.applyData();
	          },
	          onTagRemove: event => {
	            const {
	              tag
	            } = event.getData();
	            const intId = Number(tag.id.replace('chat', ''));
	            this.channels = this.channels.filter(chat => chat !== intId);
	            this.applyData();
	          }
	        },
	        dialogOptions: {
	          enableSearch: true,
	          height: 250,
	          width: 380,
	          dropdownMode: true,
	          recentTabOptions: humanresources_companyStructure_structureComponents.getChatRecentTabOptions(this.entityType, humanresources_companyStructure_structureComponents.ChatTypeDict.channel),
	          entities: [humanresources_companyStructure_structureComponents.getChannelDialogEntity()]
	        }
	      };
	      return new ui_entitySelector.TagSelector(options);
	    },
	    applyData() {
	      this.$emit('applyData', {
	        chats: this.chats,
	        channels: this.channels,
	        createDefaultChat: this.createDefaultChat,
	        createDefaultChannel: this.createDefaultChannel,
	        isDepartmentDataChanged: true
	      });
	    }
	  },
	  watch: {
	    headsCreated(value) {
	      this.createDefaultChat = value;
	      this.createDefaultChannel = value;
	    }
	  },
	  computed: {
	    chatHintText() {
	      return this.isTeamEntity ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHATS_ADD_CHECKBOX_HINT') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHATS_ADD_CHECKBOX_HINT_MSGVER_1');
	    },
	    channelHintText() {
	      return this.isTeamEntity ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHANNELS_ADD_CHECKBOX_HINT') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHANNELS_ADD_CHECKBOX_HINT_MSGVER_1');
	    },
	    headsCreated() {
	      const memberRoles = humanresources_companyStructure_api.getMemberRoles(this.entityType);
	      return this.heads.some(item => item.role === memberRoles.head);
	    },
	    set() {
	      return ui_iconSet_api_vue.Set;
	    },
	    isTeamEntity() {
	      return this.entityType === humanresources_companyStructure_utils.EntityTypes.team;
	    },
	    hints() {
	      if (this.isTeamEntity) {
	        return [this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_HINT_1'), this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_HINT_2'), this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_HINT_3')];
	      }
	      return [this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_HINT_1_MSGVER_1'), this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_HINT_2_MSGVER_1'), this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_HINT_3')];
	    }
	  },
	  template: `
		<div class="chart-wizard__bind-chat">
			<div class="chart-wizard__bind-chat__item">
				<div class="chart-wizard__bind-chat__item-hint" :class="{ '--team': isTeamEntity }">
					<div class="chart-wizard__bind-chat__item-hint_logo" :class="{ '--team': isTeamEntity }"></div>
					<div class="chart-wizard__bind-chat__item-hint_text">
						<div
							class="chart-wizard__bind-chat__item-hint_title"
							v-html="
								isTeamEntity 
								? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_HINT_TITLE')
								: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_HINT_TITLE')
							"
						>
						</div>
						<div v-for="hint in hints"
							 class="chart-wizard__bind-chat__item-hint_text-item"
						>
							<div
								class="chart-wizard__bind-chat__item-hint_text-item_icon"
								:class="{ '--team': isTeamEntity }"
							></div>
							<span>{{ hint }}</span>
						</div>
					</div>
				</div>
				<div class="chart-wizard__bind-chat__item-options">
					<div class="chart-wizard__bind-chat__item-options__item-content_title">
						<div class="chart-wizard__bind-chat__item-options__item-content_title-text">
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHATS_TITLE') }}
						</div>
					</div>
					<span class="chart-wizard__bind-chat__item-description">
						{{
							isTeamEntity
								? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHATS_DESCRIPTION')
								: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHATS_DESCRIPTION')
						}}
					</span>
					<div
						class="chart-wizard__chat_selector"
						ref="chat-selector"
						data-test-id="hr-company-structure_chart-wizard__chat-selector"
					/>
					<div class="chart-wizard__bind-chat__item-checkbox_container">
						<input
							id="addChatCheckbox"
							type="checkbox"
							class="form-control"
							:disabled="!headsCreated"
							v-model="createDefaultChat"
							@change="applyData()"
							data-test-id="hr-company-structure_chart-wizard__make-default-chat-checkbox"
						/>
						<label for="addChatCheckbox">
							{{
								isTeamEntity
									? loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHATS_ADD_CHECKBOX_LABEL')
									: loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHATS_ADD_CHECKBOX_LABEL_MSGVER_1')
							}}
						</label>
						<DefaultHint :content="chatHintText"/>
					</div>
					<div v-if="!headsCreated" class="chart-wizard__bind-chat__item-checkbox_warning">
						<BIcon
							:name="set.WARNING"
							color="#FFA900"
							:size="16"
						></BIcon>
						<span>
							{{
								isTeamEntity
									? loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHATS_ADD_CHECKBOX_WARNING')
									: loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHATS_ADD_CHECKBOX_WARNING')
							}}
						</span>
					</div>
				</div>
				<div class="chart-wizard__bind-chat__item-options">
					<div class="chart-wizard__bind-chat__item-options__item-content_title">
						<div class="chart-wizard__bind-chat__item-options__item-content_title-text">
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHANNELS_TITLE') }}
						</div>
					</div>
					<span class="chart-wizard__bind-chat__item-description">
						{{
							isTeamEntity
								? loc(
									'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHANNELS_DESCRIPTION')
								: loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHANNELS_DESCRIPTION')
						}}
					</span>
					<div
						class="chart-wizard__channel_selector"
						ref="channel-selector"
						data-test-id="hr-company-structure_chart-wizard__channel-selector"
					/>
					<div class="chart-wizard__bind-chat__item-checkbox_container">
						<input
							id="addChannelCheckbox"
							type="checkbox"
							class="form-control"
							:disabled="!headsCreated"
							v-model="createDefaultChannel"
							@change="applyData()"
							data-test-id="hr-company-structure_chart-wizard__make-default-channel-checkbox"
						/>
						<label for="addChannelCheckbox">
							{{
								isTeamEntity
									? loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHANNELS_ADD_CHECKBOX_LABEL')
									: loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHANNELS_ADD_CHECKBOX_LABEL_MSGVER_1')
							}}
						</label>
						<DefaultHint :content="channelHintText"/>
					</div>
					<div v-if="!headsCreated" class="chart-wizard__bind-chat__item-checkbox_warning --bottom-space">
						<BIcon
							:name="set.WARNING"
							color="#FFA900"
							:size="16"
						></BIcon>
						<span>
							{{
								isTeamEntity
									? loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_SELECT_CHANNELS_ADD_CHECKBOX_WARNING')
									: loc(
										'HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_SELECT_CHANNELS_ADD_CHECKBOX_WARNING')
							}}
						</span>
					</div>
				</div>
			</div>
		</div>
	`
	};

	const Entities = {
	  props: {
	    parentId: {
	      type: [Number, null],
	      required: true
	    }
	  },
	  components: {
	    ResponsiveHint
	  },
	  data() {
	    return {
	      selectedEntityType: humanresources_companyStructure_utils.EntityTypes.department
	    };
	  },
	  emits: ['applyData'],
	  created() {
	    this.hint = null;
	    this.hintHideTimeout = null;
	    const permissionChecker = humanresources_companyStructure_permissionChecker.PermissionChecker.getInstance();
	    const hasTeamCreatePermission = this.parentId === 0 ? permissionChecker.hasPermissionWithAnyNode(humanresources_companyStructure_permissionChecker.PermissionActions.teamCreate) : permissionChecker.hasPermission(humanresources_companyStructure_permissionChecker.PermissionActions.teamCreate, this.parentId);
	    const hasDepartmentCreatePermission = this.parentId === 0 ? permissionChecker.hasPermissionWithAnyNode(humanresources_companyStructure_permissionChecker.PermissionActions.departmentCreate) : permissionChecker.hasPermission(humanresources_companyStructure_permissionChecker.PermissionActions.departmentCreate, this.parentId);
	    this.entities = [{
	      type: humanresources_companyStructure_utils.EntityTypes.department,
	      title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_DEPARTMENT_TITLE'),
	      description: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_DEPARTMENT_DESCR'),
	      isEnabled: hasDepartmentCreatePermission,
	      hint: !hasDepartmentCreatePermission && this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_DEPARTMENT_NO_ACCESS_HINT'),
	      isSoon: false
	    }, {
	      type: humanresources_companyStructure_utils.EntityTypes.team,
	      title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_FUNCTIONAL_TEAM_TITLE_MSGVER_1'),
	      description: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_FUNCTIONAL_TEAM_DESCR'),
	      isEnabled: humanresources_companyStructure_permissionChecker.PermissionChecker.isTeamsAvailable && hasTeamCreatePermission,
	      hint: humanresources_companyStructure_permissionChecker.PermissionChecker.isTeamsAvailable && !hasTeamCreatePermission && this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_FUNCTIONAL_TEAM_NO_ACCESS_HINT_MSGVER_1'),
	      isSoon: !permissionChecker.isTeamsAvailable
	    }, {
	      type: humanresources_companyStructure_utils.EntityTypes.company,
	      title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_COMPANY_TITLE'),
	      description: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_COMPANY_DESCR'),
	      isEnabled: false,
	      isSoon: true
	    }];
	    for (const entity of this.entities) {
	      if (entity.isEnabled) {
	        this.selectedEntityType = entity.type;
	        break;
	      }
	    }
	    this.applyData(this.selectedEntityType);
	  },
	  activated() {
	    this.applyData(this.selectedEntityType);
	  },
	  deactivated() {
	    var _this$hint;
	    (_this$hint = this.hint) == null ? void 0 : _this$hint.hide();
	    clearTimeout(this.hintHideTimeout);
	    this.hintHideTimeout = null;
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    applyData(entityId) {
	      this.selectedEntityType = entityId;
	      this.$emit('applyData', {
	        isValid: true,
	        isDepartmentDataChanged: false,
	        entityType: this.selectedEntityType
	      });
	    },
	    showHint(text, $event) {
	      if (this.hintHideTimeout) {
	        return;
	      }
	      const width = 300;
	      this.hint = main_core.Reflection.getClass('BX.UI.Hint').createInstance({
	        popupParameters: {
	          width,
	          bindOptions: {
	            position: 'top'
	          },
	          offsetLeft: 225,
	          offsetTop: -23,
	          angle: {
	            offset: width / 2 - 33 / 2
	          }
	        }
	      });
	      this.hint.show($event.target, text);
	      this.hintHideTimeout = setTimeout(() => {
	        var _this$hint2;
	        (_this$hint2 = this.hint) == null ? void 0 : _this$hint2.hide();
	        this.hintHideTimeout = null;
	      }, 2000);
	    }
	  },
	  template: `
		<div
			v-for="entity in entities"
			class="chart-wizard__entity-wrapper"
		>
			<span v-if="entity.hint" @click="showHint(entity.hint, $event)" class="ui-hint chart-wizard__entity_hint-layout"></span>
			<div class="chart-wizard__entity"
				 :class="{ 
					['--' + entity.type.toLowerCase()]: true, 
					'--selected': entity.type === selectedEntityType, 
					'--enabled': entity.isEnabled 
				}"
				@click="entity.isEnabled && applyData(entity.type)"
			>
				<div class="chart-wizard__entity_summary">
					<h2
						class="chart-wizard__entity_title"
						:data-title="entity.isSoon ? loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_ACCESS_TITLE') : null"
						:class="{ '--disabled': !entity.isEnabled, '--soon': entity.isSoon }"
					>
						{{entity.title}}
					</h2>
					<p class="chart-wizard__entity_description" :class="{ '--disabled': !entity.isEnabled}">
						{{entity.description}}
					</p>
				</div>
			</div>
		</div>
	`
	};

	const AuthorityTypes = {
	  departmentHead: 'HEAD',
	  departmentDeputy: 'DEPUTY_HEAD',
	  teamHead: 'TEAM_HEAD',
	  teamDeputy: 'TEAM_DEPUTY'
	};
	const SettingsTypes = {
	  businessProcAuthority: 'BUSINESS_PROC_AUTHORITY',
	  reportsAuthority: 'REPORTS_AUTHORITY'
	};

	const TeamRights = {
	  name: 'teamRights',
	  emits: ['applyData'],
	  props: {
	    name: {
	      type: String,
	      required: true
	    },
	    /** @type {Record<string, Set>} */
	    settings: {
	      type: Object,
	      required: false
	    }
	  },
	  created() {
	    this.hints = [this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_HINT_1'), this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_HINT_2')];
	    this.initBpValues = new Set();
	    this.businessProcSelector = this.getTagSelector(SettingsTypes.businessProcAuthority, false);
	    this.reportsSelector = this.getTagSelector(SettingsTypes.reportsAuthority, true);
	  },
	  mounted() {
	    this.businessProcSelector.renderTo(this.$refs['business-proc-selector']);
	    this.reportsSelector.renderTo(this.$refs['reports-selector']);
	  },
	  watch: {
	    settings: {
	      handler(payload) {
	        if (payload[SettingsTypes.businessProcAuthority]) {
	          const businessProcPreselected = this.getTagItems(false).filter(item => payload[SettingsTypes.businessProcAuthority].has(item.id));
	          businessProcPreselected.forEach(businessProcPreselectedItem => {
	            const item = this.businessProcSelector.dialog.getItem(['head-type', businessProcPreselectedItem.id]);
	            if (item) {
	              this.initBpValues.add(businessProcPreselectedItem.id);
	              item.select();
	            }
	          });
	        }
	      }
	    }
	  },
	  methods: {
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    applyData() {
	      this.$emit('applyData', {
	        settings: this.settings,
	        isDepartmentDataChanged: true
	      });
	    },
	    getTagSelector(settingType, locked) {
	      return new ui_entitySelector.TagSelector({
	        events: {
	          onTagAdd: event => {
	            const {
	              tag
	            } = event.getData();
	            this.settings[settingType].add(tag.id);
	            if (this.initBpValues.has(tag.id)) {
	              this.initBpValues.delete(tag.id);
	            } else {
	              this.applyData();
	            }
	          },
	          onTagRemove: event => {
	            const {
	              tag
	            } = event.getData();
	            this.settings[settingType].delete(tag.id);
	            this.applyData();
	          }
	        },
	        multiple: true,
	        id: 'head-type-selector',
	        locked,
	        tagFontWeight: '700',
	        showAddButton: !locked,
	        dialogOptions: {
	          id: 'head-type-selector',
	          events: {
	            'Item:onBeforeSelect': event => {
	              var _item$getCustomData;
	              const {
	                item
	              } = event.getData();
	              if (!((_item$getCustomData = item.getCustomData()) != null && _item$getCustomData.get('selectable'))) {
	                event.preventDefault();
	              }
	            }
	          },
	          width: 400,
	          height: 200,
	          dropdownMode: true,
	          showAvatars: false,
	          selectedItems: this.getTagItems(locked).filter(item => this.settings[settingType].has(item.id)),
	          items: this.getTagItems(locked),
	          undeselectedItems: [['head-type', AuthorityTypes.departmentHead]]
	        }
	      });
	    },
	    getTagItems(locked) {
	      const lockedTagOptions = {
	        bgColor: '#BDC1C6',
	        textColor: '#525C69'
	      };
	      const departmentTagOptions = {
	        bgColor: '#ADE7E4',
	        textColor: '#207976'
	      };
	      const teamTagOptions = {
	        bgColor: '#CCE3FF',
	        textColor: '#3592FF'
	      };
	      const soonItemOptions = {
	        customData: {
	          selectable: false
	        },
	        textColor: '#C9CCD0',
	        badges: [{
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_SOON_ITEM_BADGE'),
	          textColor: '#FFFFFF',
	          bgColor: '#2FC6F6'
	        }],
	        badgesOptions: {
	          justifyContent: 'right'
	        }
	      };
	      return [{
	        id: AuthorityTypes.departmentHead,
	        entityId: 'head-type',
	        tabs: 'recents',
	        title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_DEPARTMENT_HEAD_ITEM'),
	        tagOptions: locked ? lockedTagOptions : departmentTagOptions,
	        customData: {
	          selectable: true
	        }
	      }, {
	        id: AuthorityTypes.teamHead,
	        entityId: 'head-type',
	        tabs: 'recents',
	        title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_TEAM_HEAD_ITEM'),
	        tagOptions: locked ? lockedTagOptions : teamTagOptions,
	        customData: {
	          selectable: true
	        }
	      }, {
	        id: AuthorityTypes.departmentDeputy,
	        entityId: 'head-type',
	        tabs: 'recents',
	        title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_DEPARTMENT_DEPUTY_ITEM'),
	        tagOptions: locked ? lockedTagOptions : departmentTagOptions,
	        ...soonItemOptions
	      }, {
	        id: AuthorityTypes.teamDeputy,
	        entityId: 'head-type',
	        tabs: 'recents',
	        title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_TEAM_DEPUTY_ITEM'),
	        tagOptions: locked ? lockedTagOptions : teamTagOptions,
	        ...soonItemOptions
	      }];
	    },
	    goToBPHelp(event) {
	      if (top.BX.Helper) {
	        event.preventDefault();
	        top.BX.Helper.show('redirect=detail&code=25455744');
	      }
	    }
	  },
	  computed: {
	    businessDescription() {
	      return this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_BUSINESS_PROC_DESCRIPTION', {
	        '#DEPARTMENT_NAME#': main_core.Text.encode(this.name)
	      });
	    },
	    reportsDescriptions() {
	      return this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_REPORTS_DESCRIPTION', {
	        '#DEPARTMENT_NAME#': main_core.Text.encode(this.name)
	      });
	    }
	  },
	  template: `
		<div class="chart-wizard__team-rights">
			<div class="chart-wizard__team-rights__item">
				<div class="chart-wizard__team-rights__item-hint --team">
					<div class="chart-wizard__team-rights__item-hint_logo --team"></div>
					<div class="chart-wizard__team-rights__item-hint_text">
						<div class="chart-wizard__team-rights__item-hint_title">
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_HINT_TITLE') }}
						</div>
						<div v-for="hint in hints"
							class="chart-wizard__team-rights__item-hint_text-item"
						>
							<div
								class="chart-wizard__team-rights__item-hint_text-item_icon --team"
							></div>
							<span>{{ hint }}</span>
						</div>
					</div>
				</div>
				<div class="chart-wizard__team-rights__item-options">
					<div class="chart-wizard__team-rights__item-options__item-content_title"
						 :data-title="loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_ACCESS_TITLE')"
					>
						<div class="chart-wizard__team-rights__item-options__item-content_title-text">
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_BUSINESS_PROC_TITLE') }}
						</div>
						<span class="ui-hint" @click="goToBPHelp">
							<span class="ui-hint-icon"/>
						</span>
					</div>
					<div class="chart-wizard__team-rights__item-description-container">
						<span class="chart-wizard__team-rights__item-description-text" v-html="businessDescription">
						</span>
					</div>
					<div
						class="chart-wizard__team-rights__business-proc-selector"
						ref="business-proc-selector"
						data-test-id="hr-company-structure__team-rights__business-proc-selector"
					/>
				</div>
				<div class="chart-wizard__team-rights__item-options">
					<div class="chart-wizard__team-rights__item-options__item-content_title --soon"
						 :data-title="loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_ENTITY_ACCESS_TITLE')"
					>
						<div class="chart-wizard__team-rights__item-options__item-content_title-text">
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_REPORTS_TITLE') }}
						</div>
						<span class="chart-wizard__team-rights_ui-hint-disabled">
							<span class="ui-hint-icon"/>
						</span>
					</div>
					<div class="chart-wizard__team-rights__item-description-container">
						<span class="chart-wizard__team-rights__item-description-text --soon" v-html="reportsDescriptions">
						</span>
					</div>
					<div
						class="chart-wizard__team-rights__reports-selector"
						ref="reports-selector"
						data-test-id="hr-company-structure__team-rights__reports-selector"
					/>
				</div>
			</div>
		</div>
	`
	};

	const WizardAPI = {
	  addDepartment: (name, parentId, description, entityType, colorName) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.add', {
	      name,
	      parentId,
	      description,
	      entityType,
	      colorName
	    });
	  },
	  getEmployees: nodeId => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.Member.Employee.getIds', {
	      nodeId
	    });
	  },
	  updateDepartment: (nodeId, parentId, name, description, colorName) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.update', {
	      nodeId,
	      name,
	      parentId,
	      description,
	      colorName
	    });
	  },
	  saveUsers: (nodeId, userIds, parentId) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.Member.saveUserList', {
	      nodeId,
	      userIds,
	      parentId
	    });
	  },
	  moveUsers: (nodeId, userIds, parentId) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.Member.moveUserListToDepartment', {
	      nodeId,
	      userIds,
	      parentId
	    });
	  },
	  saveChats: (nodeId, ids, createDefault) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.Member.Chat.saveChatList', {
	      nodeId,
	      ids,
	      createDefault
	    });
	  },
	  createSettings: (nodeId, settings, parentId) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.NodeSettings.create', {
	      settings,
	      nodeId,
	      parentId
	    });
	  },
	  updateSettings: (nodeId, settings, parentId) => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.NodeSettings.update', {
	      settings,
	      nodeId,
	      parentId
	    });
	  },
	  getSettings: nodeId => {
	    return humanresources_companyStructure_api.postData('humanresources.api.Structure.Node.NodeSettings.get', {
	      nodeId
	    });
	  }
	};

	const chartWizardActions = {
	  createDepartment: departmentData => {
	    var _parent$children;
	    const {
	      departments
	    } = humanresources_companyStructure_chartStore.useChartStore();
	    const {
	      id: departmentId,
	      parentId
	    } = departmentData;
	    const parent = departments.get(parentId);
	    parent.children = [...((_parent$children = parent.children) != null ? _parent$children : []), departmentId];
	    departments.set(departmentId, {
	      ...departmentData,
	      id: departmentId,
	      chats: null,
	      channels: null
	    });
	  },
	  editDepartment: departmentData => {
	    const {
	      id,
	      parentId
	    } = departmentData;
	    const {
	      departments
	    } = humanresources_companyStructure_chartStore.useChartStore();
	    const oldData = departments.get(id);
	    departments.set(id, {
	      ...oldData,
	      ...departmentData
	    });
	    const prevParent = [...departments.values()].find(department => {
	      var _department$children;
	      return (_department$children = department.children) == null ? void 0 : _department$children.includes(id);
	    });
	    if (parentId !== 0 && prevParent.id !== parentId) {
	      var _newParent$children;
	      prevParent.children = prevParent.children.filter(childId => childId !== id);
	      const newParent = departments.get(parentId);
	      newParent.children = [...((_newParent$children = newParent.children) != null ? _newParent$children : []), id];
	      departments.set(id, {
	        ...departmentData,
	        prevParentId: prevParent.id
	      });
	    }
	  },
	  moveUsersToRootDepartment: (removedUsers, userMovedToRootIds) => {
	    const {
	      departments
	    } = humanresources_companyStructure_chartStore.useChartStore();
	    const rootEmployees = removedUsers.filter(user => userMovedToRootIds.includes(user.id));
	    const rootNode = [...departments.values()].find(department => department.parentId === 0);
	    departments.set(rootNode.id, {
	      ...rootNode,
	      employees: [...(rootNode.employees || []), ...rootEmployees],
	      userCount: rootNode.userCount + rootEmployees.length
	    });
	  },
	  refreshDepartments: ids => {
	    const store = humanresources_companyStructure_chartStore.useChartStore();
	    store.refreshDepartments(ids);
	  },
	  tryToAddCurrentDepartment(departmentData, departmentId) {
	    const store = humanresources_companyStructure_chartStore.useChartStore();
	    const {
	      heads,
	      employees
	    } = departmentData;
	    const isCurrentUserAdd = [...heads, ...employees].some(user => {
	      return user.id === store.userId;
	    });
	    if (isCurrentUserAdd) {
	      store.changeCurrentDepartment(0, departmentId);
	    }
	  }
	};

	const SaveMode = Object.freeze({
	  moveUsers: 'moveUsers',
	  addUsers: 'addUsers'
	});
	const ChartWizard = {
	  name: 'chartWizard',
	  emits: ['modifyTree', 'close'],
	  components: {
	    Department,
	    Employees,
	    BindChat,
	    TreePreview,
	    Entities,
	    TeamRights
	  },
	  props: {
	    nodeId: {
	      type: Number,
	      required: true
	    },
	    isEditMode: {
	      type: Boolean,
	      required: true
	    },
	    showEntitySelector: {
	      type: Boolean,
	      required: false
	    },
	    entity: {
	      type: String
	    },
	    entityType: {
	      type: String,
	      default: humanresources_companyStructure_utils.EntityTypes.department
	    },
	    source: {
	      type: String
	    },
	    refToFocus: {
	      type: String,
	      default: null
	    }
	  },
	  data() {
	    return {
	      stepIndex: 0,
	      waiting: false,
	      isValidStep: false,
	      isDepartmentDataChanged: false,
	      departmentData: {
	        id: 0,
	        parentId: 0,
	        name: '',
	        description: '',
	        heads: [],
	        employees: [],
	        chats: [],
	        channels: [],
	        userCount: 0,
	        createDefaultChat: true,
	        createDefaultChannel: true,
	        teamColor: humanresources_companyStructure_utils.NodeColorsSettingsDict.blue,
	        entityType: humanresources_companyStructure_utils.EntityTypes.department,
	        settings: {
	          [SettingsTypes.businessProcAuthority]: new Set([AuthorityTypes.departmentHead]),
	          [SettingsTypes.reportsAuthority]: new Set([AuthorityTypes.departmentHead])
	        }
	      },
	      removedUsers: [],
	      employeesIds: [],
	      departmentSettings: {
	        [SettingsTypes.businessProcAuthority]: new Set([AuthorityTypes.departmentHead]),
	        [SettingsTypes.reportsAuthority]: new Set([AuthorityTypes.departmentHead])
	      },
	      shouldErrorHighlight: false,
	      visibleSteps: [],
	      saveMode: SaveMode.moveUsers
	    };
	  },
	  created() {
	    this.init();
	  },
	  beforeUnmount() {
	    main_core.Event.unbind(window, 'beforeunload', this.handleBeforeUnload);
	  },
	  computed: {
	    stepTitle() {
	      var _this$departmentData;
	      if (this.isFirstStep && !this.isEditMode) {
	        return this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_CREATE');
	      }
	      const currentStep = this.visibleSteps[0] === 'entities' ? this.stepIndex : this.stepIndex + 1;
	      if (!this.isEditMode) {
	        return this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_STEP_PROGRESS', {
	          '#CURRENT_STEP#': currentStep,
	          '#MAX_STEP#': this.steps.length - 1
	        });
	      }
	      return ((_this$departmentData = this.departmentData) == null ? void 0 : _this$departmentData.entityType) === humanresources_companyStructure_utils.EntityTypes.team ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EDIT_TEAM_TITLE') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EDIT_TITLE');
	    },
	    closeConfirmTitle() {
	      var _this$departmentData3;
	      if (this.isEditMode) {
	        var _this$departmentData2;
	        return ((_this$departmentData2 = this.departmentData) == null ? void 0 : _this$departmentData2.entityType) === humanresources_companyStructure_utils.EntityTypes.team ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_EDIT_WIZARD_TEAM_TITLE') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_EDIT_WIZARD_DEPARTMENT_TITLE');
	      }
	      return ((_this$departmentData3 = this.departmentData) == null ? void 0 : _this$departmentData3.entityType) === humanresources_companyStructure_utils.EntityTypes.team ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_CREATE_WIZARD_TEAM_TITLE') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_CREATE_WIZARD_DEPARTMENT_TITLE');
	    },
	    currentStep() {
	      const id = this.visibleSteps[this.stepIndex];
	      return this.steps.find(step => id === step.id);
	    },
	    componentInfo() {
	      const {
	        parentId,
	        name,
	        description,
	        heads,
	        entityType,
	        teamColor
	      } = this.departmentData;
	      const components = {
	        department: {
	          name: 'Department',
	          params: {
	            parentId,
	            name,
	            description,
	            entityType,
	            teamColor,
	            refToFocus: this.refToFocus,
	            shouldErrorHighlight: this.shouldErrorHighlight,
	            isEditMode: this.isEditMode
	          }
	        },
	        employees: {
	          name: 'Employees',
	          params: {
	            heads,
	            entityType,
	            employeesIds: this.employeesIds,
	            isEditMode: this.isEditMode
	          }
	        },
	        bindChat: {
	          name: 'BindChat',
	          params: {
	            heads,
	            name,
	            entityType
	          }
	        },
	        teamRights: {
	          name: 'TeamRights',
	          params: {
	            name,
	            settings: this.departmentSettings
	          }
	        },
	        entities: {
	          name: 'Entities',
	          params: {
	            parentId
	          }
	        }
	      };
	      const {
	        id: stepId
	      } = this.currentStep;
	      return components[stepId];
	    },
	    isFirstStep() {
	      return this.currentStep.id === 'entities';
	    },
	    hasTreePreview() {
	      return !['entities', 'bindChat', 'teamRights'].includes(this.currentStep.id);
	    },
	    isChatStep() {
	      return this.currentStep.id === 'bindChat';
	    },
	    filteredSteps() {
	      return this.visibleSteps.filter(step => step !== 'entities');
	    },
	    rootId() {
	      const {
	        id
	      } = [...this.departments.values()].find(department => {
	        return department.parentId === 0;
	      });
	      return id;
	    },
	    isTeamEntity() {
	      var _this$departmentData4;
	      return ((_this$departmentData4 = this.departmentData) == null ? void 0 : _this$departmentData4.entityType) === humanresources_companyStructure_utils.EntityTypes.team;
	    },
	    createButtonText() {
	      return this.isTeamEntity ? this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_CREATE_TEAM_BTN') : this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_CREATE_BTN');
	    },
	    ...ui_vue3_pinia.mapState(humanresources_companyStructure_chartStore.useChartStore, ['departments', 'userId', 'currentDepartments'])
	  },
	  methods: {
	    handleBeforeUnload(event) {
	      event.preventDefault();
	    },
	    loc(phraseCode, replacements = {}) {
	      return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
	    },
	    async init() {
	      // Important: we need to call createSteps as soon as we get entityType or determine a lack of it

	      main_core.Event.bind(window, 'beforeunload', this.handleBeforeUnload);
	      if (this.isEditMode) {
	        const {
	          id,
	          name,
	          description,
	          parentId,
	          heads,
	          userCount,
	          children,
	          entityType,
	          teamColor,
	          employees = []
	        } = this.departments.get(this.nodeId);
	        this.getMemberRoles(entityType);
	        this.createSteps(entityType);
	        this.createVisibleSteps();
	        this.createDefaultSaveMode(entityType);
	        this.departmentData = {
	          ...this.departmentData,
	          id,
	          parentId,
	          name,
	          description,
	          heads,
	          userCount,
	          children,
	          employees,
	          entityType,
	          teamColor,
	          createDefaultChat: false,
	          createDefaultChannel: false
	        };
	        const rawSettings = await WizardAPI.getSettings(this.nodeId);
	        this.departmentSettings = rawSettings.reduce((acc, {
	          settingsType,
	          settingsValue
	        }) => {
	          if (!Object.hasOwn(acc, settingsType)) {
	            acc[settingsType] = new Set();
	          }
	          acc[settingsType].add(settingsValue);
	          return acc;
	        }, {
	          ...this.departmentSettings
	        });
	        this.employeesIds = await WizardAPI.getEmployees(this.nodeId);
	        return;
	      }
	      if (this.entityType) {
	        this.departmentData.entityType = this.entityType;
	      }
	      this.getMemberRoles(this.entityType);
	      this.createSteps(this.entityType);
	      this.createVisibleSteps();
	      this.createDefaultSaveMode(this.entityType);
	      if (this.nodeId) {
	        this.departmentData.parentId = this.nodeId;
	        return;
	      }
	      this.departmentData.parentId = 0;
	      ui_analytics.sendData({
	        tool: 'structure',
	        category: 'structure',
	        event: 'create_wizard',
	        c_element: this.source
	      });
	    },
	    getMemberRoles(entityType) {
	      this.memberRoles = humanresources_companyStructure_api.getMemberRoles(entityType);
	    },
	    createVisibleSteps() {
	      switch (this.entity) {
	        case 'department':
	          this.visibleSteps = ['department'];
	          break;
	        case 'employees':
	          this.visibleSteps = ['employees'];
	          break;
	        case 'teamRights':
	          this.visibleSteps = ['teamRights'];
	          break;
	        default:
	          this.visibleSteps = this.showEntitySelector ? this.steps.map(step => step.id) : this.steps.filter(step => step.id !== 'entities').map(step => step.id);
	          break;
	      }
	    },
	    move(buttonId = 'next') {
	      if (buttonId === 'next' && !this.isValidStep) {
	        this.shouldErrorHighlight = true;
	        return;
	      }
	      this.stepIndex = buttonId === 'back' ? this.stepIndex - 1 : this.stepIndex + 1;
	      this.pickStepsAnalytics();
	    },
	    close(sendEvent = false) {
	      this.$emit('close');
	      if (sendEvent) {
	        ui_analytics.sendData({
	          tool: 'structure',
	          category: 'structure',
	          event: 'cancel_wizard',
	          c_element: this.source
	        });
	      }
	    },
	    closeWithConfirm() {
	      if (!this.isDepartmentDataChanged) {
	        this.close(true);
	        return;
	      }
	      const confirmPopup = new ui_dialogs_messagebox.MessageBox({
	        title: this.closeConfirmTitle,
	        message: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_WIZARD_MESSAGE'),
	        yesCaption: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_WIZARD_OK_CAPTION'),
	        noCaption: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_CONFIRM_CLOSE_WIZARD_NO_CAPTION'),
	        onYes: () => {
	          this.close(true);
	          return true;
	        },
	        minHeight: 155,
	        buttons: ui_dialogs_messagebox.MessageBoxButtons.YES_NO,
	        popupOptions: {
	          closeIcon: true,
	          className: 'humanresources-chart-wizard__close-confirm-popup'
	        }
	      });
	      confirmPopup.getYesButton().setRound(true);
	      confirmPopup.getNoButton().setRound(true);
	      confirmPopup.show();
	    },
	    onApplyData(data) {
	      var _this$departmentData$;
	      const prevEntityType = this.departmentData.entityType;
	      const {
	        isValid = true,
	        isDepartmentDataChanged = true,
	        removedUsers = [],
	        ...departmentData
	      } = data;
	      this.isValidStep = isValid;
	      this.isDepartmentDataChanged = this.isDepartmentDataChanged || isDepartmentDataChanged;
	      if (departmentData) {
	        this.departmentData = {
	          ...this.departmentData,
	          ...departmentData
	        };
	      }
	      this.removedUsers = removedUsers;
	      if (isValid) {
	        this.shouldErrorHighlight = false;
	      }

	      // change steps and roles according to entityType
	      if (prevEntityType !== this.departmentData.entityType) {
	        this.getMemberRoles(this.departmentData.entityType);
	        this.createSteps(this.departmentData.entityType);
	        this.createVisibleSteps();
	        this.createDefaultSaveMode(this.departmentData.entityType);
	        const prevMemberRoles = humanresources_companyStructure_api.getMemberRoles(prevEntityType);
	        const rolesKeys = Object.keys(prevMemberRoles);
	        this.departmentData.heads = this.departmentData.heads.map(item => {
	          const roleKey = rolesKeys.find(key => prevMemberRoles[key] === item.role);
	          return {
	            ...item,
	            role: this.memberRoles[roleKey]
	          };
	        });
	        this.departmentData.employees = this.departmentData.employees.map(item => ({
	          ...item,
	          role: this.memberRoles.employee
	        }));
	      }

	      // change NodeColorsSettingsDict according to entityType
	      this.departmentData.teamColor = this.isTeamEntity ? (_this$departmentData$ = this.departmentData.teamColor) != null ? _this$departmentData$ : humanresources_companyStructure_utils.NodeColorsSettingsDict.blue : null;
	    },
	    createSteps(entityType = 'DEPARTMENT') {
	      if (entityType === humanresources_companyStructure_utils.EntityTypes.team) {
	        this.steps = [{
	          id: 'entities',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_SELECT_ENTITY_TITLE')
	        }, {
	          id: 'department',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_TITLE')
	        }, {
	          id: 'employees',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_EMPLOYEES_TITLE')
	        }, {
	          id: 'bindChat',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TEAM_TITLE')
	        }, {
	          id: 'teamRights',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_TEAM_RIGHTS_TITLE')
	        }];
	      } else {
	        this.steps = [{
	          id: 'entities',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_SELECT_ENTITY_TITLE')
	        }, {
	          id: 'department',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DEPARTMENT_TITLE')
	        }, {
	          id: 'employees',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_EMPLOYEES_TITLE')
	        }, {
	          id: 'bindChat',
	          title: this.loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BINDCHAT_TITLE_MSGVER_1')
	        }];
	      }
	    },
	    getUsersPromise(departmentId) {
	      const ids = this.calculateEmployeeIds();
	      const {
	        headsIds,
	        deputiesIds,
	        employeesIds
	      } = ids;
	      const departmentUserIds = {
	        [this.memberRoles.head]: headsIds,
	        [this.memberRoles.deputyHead]: deputiesIds,
	        [this.memberRoles.employee]: employeesIds
	      };
	      return this.getUserMemberPromise(departmentId, departmentUserIds);
	    },
	    calculateEmployeeIds() {
	      const {
	        heads,
	        employees = []
	      } = this.departmentData;
	      return [...heads, ...employees].reduce((acc, user) => {
	        const {
	          headsIds,
	          deputiesIds,
	          employeesIds
	        } = acc;
	        if (user.role === this.memberRoles.head) {
	          headsIds.push(user.id);
	        } else if (user.role === this.memberRoles.deputyHead) {
	          deputiesIds.push(user.id);
	        } else {
	          employeesIds.push(user.id);
	        }
	        return acc;
	      }, {
	        headsIds: [],
	        deputiesIds: [],
	        employeesIds: []
	      });
	    },
	    getUserMemberPromise(departmentId, ids, role) {
	      var _this$departmentData$2;
	      if (this.isEditMode) {
	        return WizardAPI.saveUsers(departmentId, ids);
	      }
	      const hasUsers = Object.values(ids).some(userIds => userIds.length > 0);
	      if (!hasUsers) {
	        return Promise.resolve();
	      }
	      const parentId = (_this$departmentData$2 = this.departmentData.parentId) != null ? _this$departmentData$2 : null;
	      if (this.saveMode === SaveMode.moveUsers) {
	        return WizardAPI.moveUsers(departmentId, ids, parentId);
	      }
	      return WizardAPI.saveUsers(departmentId, ids, parentId);
	    },
	    async create() {
	      const {
	        name,
	        parentId,
	        description,
	        chats,
	        channels,
	        createDefaultChat,
	        createDefaultChannel,
	        entityType,
	        teamColor,
	        settings
	      } = this.departmentData;
	      let departmentId = 0;
	      let accessCode = '';
	      this.waiting = true;
	      try {
	        const [newDepartment] = await WizardAPI.addDepartment(name, parentId, description, entityType, teamColor == null ? void 0 : teamColor.name);
	        departmentId = newDepartment.id;
	        accessCode = newDepartment.accessCode;
	        const data = await this.getUsersPromise(departmentId);
	        if (data != null && data.updatedDepartmentIds) {
	          chartWizardActions.refreshDepartments(data.updatedDepartmentIds);
	        } else {
	          chartWizardActions.tryToAddCurrentDepartment(this.departmentData, departmentId);
	        }
	        await WizardAPI.saveChats(departmentId, {
	          chat: [...chats],
	          channel: [...channels]
	        }, {
	          chat: Number(createDefaultChat),
	          channel: Number(createDefaultChannel)
	        });
	        if (entityType === humanresources_companyStructure_utils.EntityTypes.team) {
	          await WizardAPI.createSettings(departmentId, {
	            [SettingsTypes.businessProcAuthority]: {
	              values: [...settings[SettingsTypes.businessProcAuthority]],
	              replace: true
	            }
	          }, parentId);
	        }
	      } catch (error) {
	        if (!humanresources_companyStructure_api.reportedErrorTypes.has(error.code)) {
	          ui_notification.UI.Notification.Center.notify({
	            content: error.message,
	            autoHideDelay: 4000
	          });
	        }
	        return;
	      } finally {
	        this.waiting = false;
	      }
	      chartWizardActions.createDepartment({
	        ...this.departmentData,
	        id: departmentId,
	        accessCode
	      });
	      this.$emit('modifyTree', {
	        id: departmentId,
	        parentId,
	        showConfetti: true
	      });
	      const {
	        headsIds,
	        deputiesIds,
	        employeesIds
	      } = this.calculateEmployeeIds();
	      ui_analytics.sendData({
	        tool: 'structure',
	        category: 'structure',
	        event: 'create_dept',
	        c_element: this.source,
	        p2: `headAmount_${headsIds.length}`,
	        p3: `secondHeadAmount_${deputiesIds.length}`,
	        p4: `employeeAmount_${employeesIds.length}`
	      });
	      this.close();
	    },
	    async save() {
	      if (!this.isValidStep) {
	        this.shouldErrorHighlight = true;
	        return;
	      }
	      const {
	        id,
	        parentId,
	        name,
	        description,
	        teamColor,
	        settings
	      } = this.departmentData;
	      const currentNode = this.departments.get(id);
	      const targetNodeId = (currentNode == null ? void 0 : currentNode.parentId) === parentId ? null : parentId;
	      this.waiting = true;
	      const usersPromise = this.entity === 'employees' ? this.getUsersPromise(id) : Promise.resolve();
	      const departmentPromise = this.entity === 'department' ? WizardAPI.updateDepartment(id, targetNodeId, name, description, teamColor == null ? void 0 : teamColor.name) : Promise.resolve();
	      const settingsPromise = this.entity === 'teamRights' ? WizardAPI.updateSettings(id, {
	        [SettingsTypes.businessProcAuthority]: {
	          values: [...settings[SettingsTypes.businessProcAuthority]],
	          replace: true
	        }
	      }, parentId) : Promise.resolve();
	      this.pickEditAnalytics(id, parentId);
	      try {
	        const [usersResponse] = await Promise.all([usersPromise, departmentPromise, settingsPromise]);
	        let userMovedToRootIds = [];
	        if (this.removedUsers.length > 0) {
	          var _usersResponse$userMo;
	          userMovedToRootIds = (_usersResponse$userMo = usersResponse == null ? void 0 : usersResponse.userMovedToRootIds) != null ? _usersResponse$userMo : [];
	          if (userMovedToRootIds.length > 0) {
	            chartWizardActions.moveUsersToRootDepartment(this.removedUsers, userMovedToRootIds);
	          }
	        }
	        const store = humanresources_companyStructure_chartStore.useChartStore();
	        if (userMovedToRootIds.includes(this.userId)) {
	          store.changeCurrentDepartment(id, this.rootId);
	        } else if (this.removedUsers.some(user => user.id === this.userId)) {
	          store.changeCurrentDepartment(id);
	        } else {
	          chartWizardActions.tryToAddCurrentDepartment(this.departmentData, id);
	        }
	        chartWizardActions.editDepartment(this.departmentData);
	      } catch (e) {
	        console.error(e);
	        return;
	      } finally {
	        this.waiting = false;
	      }
	      this.$emit('modifyTree', {
	        id,
	        parentId
	      });
	      this.close();
	    },
	    handleSaveModeChanged(actionId) {
	      this.saveMode = actionId;
	    },
	    createDefaultSaveMode(entityType = 'DEPARTMENT') {
	      if (entityType === humanresources_companyStructure_utils.EntityTypes.team) {
	        this.saveMode = SaveMode.addUsers;
	      } else {
	        this.saveMode = SaveMode.moveUsers;
	      }
	    },
	    pickEditAnalytics(departmentId, parentId) {
	      const currentNode = this.departments.get(departmentId);
	      switch (this.entity) {
	        case 'department':
	          ui_analytics.sendData({
	            tool: 'structure',
	            category: 'structure',
	            event: 'edit_dept_name',
	            c_element: this.source,
	            p1: (currentNode == null ? void 0 : currentNode.parentId) === parentId ? 'editHead_N' : 'editHeadDept_Y',
	            p2: (currentNode == null ? void 0 : currentNode.name) === name ? 'editName_N' : 'editName_Y'
	          });
	          break;
	        case 'employees':
	          {
	            const {
	              headsIds,
	              deputiesIds,
	              employeesIds
	            } = this.calculateEmployeeIds();
	            ui_analytics.sendData({
	              tool: 'structure',
	              category: 'structure',
	              event: 'edit_dept_employee',
	              c_element: this.source,
	              p2: `headAmount_${headsIds.length}`,
	              p3: `secondHeadAmount_${deputiesIds.length}`,
	              p4: `employeeAmount_${employeesIds.length}`
	            });
	            break;
	          }
	        default:
	          break;
	      }
	    },
	    pickStepsAnalytics() {
	      let event = null;
	      switch (this.currentStep.id) {
	        case 'department':
	          event = 'create_dept_step1';
	          break;
	        case 'employees':
	          event = 'create_dept_step2';
	          break;
	        case 'bindChat':
	          event = 'create_dept_step3';
	          break;
	        case 'teamRights':
	          event = 'create_dept_step4';
	          break;
	        default:
	          break;
	      }
	      if (event) {
	        ui_analytics.sendData({
	          tool: 'structure',
	          category: 'structure',
	          event,
	          c_element: this.source
	        });
	      }
	    }
	  },
	  template: `
		<div class="chart-wizard">
			<div class="chart-wizard__dialog" :style="{ 'max-width': !isEditMode && isFirstStep ? '580px' : '843px' }">
				<div class="chart-wizard__head">
					<div class="chart-wizard__head_close" @click="closeWithConfirm(true)"></div>
					<p class="chart-wizard__head_title">{{ stepTitle }}</p>
					<p class="chart-wizard__head_descr" :class="{ '--first-step': isFirstStep, '--edit-mode': isEditMode }">
						{{ currentStep.title }}
					</p>
					<div class="chart-wizard__head_stages" v-if="!isFirstStep && !isEditMode">
						<div
							v-for="n in filteredSteps.length"
							class="chart-wizard__head_stage"
							:class="{ '--completed': stepIndex >= (this.showEntitySelector ? n : n - 1), '--team': isTeamEntity }"
						></div>
					</div>
				</div>
				<div class="chart-wizard__content" :style="{ display: !isEditMode && isFirstStep ? 'block' : 'flex' }">
					<KeepAlive>
						<component
							:is="componentInfo.name"
							v-bind="componentInfo.params"
							v-on="{
								applyData: onApplyData,
								saveModeChanged: componentInfo.name === 'Employees' ? handleSaveModeChanged : undefined
							}"
						>
						</component>
					</KeepAlive>
					<div v-if="hasTreePreview" class="chart-wizard__tree_container">
						<TreePreview
							:parentId="departmentData.parentId"
							:name="departmentData.name"
							:heads="departmentData.heads"
							:userCount="departmentData.userCount"
							:entityType="departmentData.entityType"
							:teamColor="departmentData.teamColor"
						/>
					</div>
				</div>
				<div class="chart-wizard__footer">
					<button
						v-if="stepIndex > 0"
						class="ui-btn ui-btn-light chart-wizard__button --back"
						@click="move('back')"
						data-test-id="hr-company-structure_chart-wizard__back-button"
					>
						<div class="ui-icon-set --chevron-left"></div>
						<span class="chart-wizard__back-button-text">
							{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_BACK_BTN') }}
						</span>
					</button>
					<button
						v-show="stepIndex < visibleSteps.length - 1 && !isEditMode"
						class="ui-btn ui-btn-primary ui-btn-round chart-wizard__button --next"
						:class="{ 'ui-btn-disabled': !isValidStep, 'ui-btn-light-border': isEditMode }"
						@click="move()"
						data-test-id="hr-company-structure_chart-wizard__next-button"
					>
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_NEXT_BTN') }}
					</button>
					<button
						v-show="isEditMode"
						class="ui-btn ui-btn-primary ui-btn-round chart-wizard__button --next"
						:class="{ 'ui-btn-light-border': isEditMode }"
						@click="close(true)"
						data-test-id="hr-company-structure_chart-wizard__discard-button"
					>
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_DISCARD_BTN') }}
					</button>
					<button
						v-show="!isEditMode && stepIndex === visibleSteps.length - 1"
						class="ui-btn ui-btn-primary ui-btn-round chart-wizard__button"
						:class="{ 'ui-btn-wait': waiting }"
						@click="create"
						data-test-id="hr-company-structure_chart-wizard__create-button"
					>
						{{ createButtonText }}
					</button>
					<button
						v-show="isEditMode"
						class="ui-btn ui-btn-primary ui-btn-round chart-wizard__button --save"
						:class="{ 'ui-btn-wait': waiting, 'ui-btn-disabled': !isValidStep, }"
						@click="save"
						data-test-id="hr-company-structure_chart-wizard__save-button"
					>
						{{ loc('HUMANRESOURCES_COMPANY_STRUCTURE_WIZARD_SAVE_BTN') }}
					</button>
				</div>
			</div>
			<div class="chart-wizard__overlay"></div>
		</div>
	`
	};

	exports.ChartWizard = ChartWizard;

}((this.BX.Humanresources.CompanyStructure = this.BX.Humanresources.CompanyStructure || {}),BX,BX.UI.Dialogs,BX.Vue3.Pinia,BX,BX.Cache,BX.UI.IconSet,BX,BX.UI.IconSet,BX,BX.Humanresources.CompanyStructure,BX,BX.UI.EntitySelector,BX.Humanresources.CompanyStructure,BX.Humanresources.CompanyStructure,BX.UI.Analytics,BX.Humanresources.CompanyStructure,BX.Humanresources.CompanyStructure));
//# sourceMappingURL=chart-wizard.bundle.js.map
