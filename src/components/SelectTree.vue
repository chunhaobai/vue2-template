<!-- SelectTree.vue -->
<template>
  <el-popover
    placement="bottom"
    popper-class="gt-select-tree"
    width="200px"
    trigger="click"
    v-model="showSelectTree"
    :disabled="disabled"
  >
    <template #reference>
      <el-select
        size="mini"
        popper-class="gt-select-tree_select"
        v-model="selectValue"
        clearable
        :disabled="disabled"
        @clear="handleClear"
        :multiple="selectMultiple"
        :placeholder="placeholder || '请选择'"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.id"
          :value="item.id"
          :label="item[defaultProps.label]"
        />
      </el-select>
    </template>

    <el-tree
      ref="gt-select-tree"
      :data="treeData"
      :show-checkbox="showCheckbox"
      :node-key="nodeKey"
      :props="defaultProps"
      :lazy="lazy"
      :load="loadNode"
      :check-strictly="checkStrictly"
      :expand-on-click-node="expandOnClickNode"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      @check="handleChangeChecked"
      @click="setCheckedNodes"
      @node-click="handelClickNode"
    />
  </el-popover>
</template>

<script>
export default {
  name: "SelectTree",
  props: {
    nodeKey: { type: String, default: "id" },
    value: { type: [String, Number, Array, Object], default: "" },
    placeholder: { type: String, default: "" },
    showCheckbox: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },
    expandOnClickNode: { type: Boolean, default: false },
    checkStrictly: { type: Boolean, default: true },
    selectMultiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    handleLoadNode: { type: Function },
    defaultProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "text",
      }),
    },
    treeData: { type: Array, default: () => [] },
    defaultExpandedKeys: { type: Array, default: () => [] },
    defaultCheckedKeys: { type: Array, default: () => [] },
  },
  data() {
    return {
      showSelectTree: false,
      selectOptions: [],
    };
  },
  computed: {
    selectValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  methods: {
    loadNode(node, resolve) {
      if (this.handleLoadNode) {
        return this.handleLoadNode(node, resolve);
      }
      resolve([]);
    },
    handleChangeChecked(data, node) {
      this.selectOptions = node.checkedNodes;
      if (this.selectMultiple) {
        this.selectValue = node.checkedNodes.map((_) => _.id);
      } else {
        this.$nextTick(() => {
          if (this.selectValue && this.selectValue == data.id) {
            this.$refs["gt-select-tree"].setCheckedKeys([]);
            this.selectValue = "";
            this.$emit("updateData", "selectTreeValue", "");
            this.$emit("update:value", "");
          } else {
            let labelKey = this.defaultProps.label;
            let valueKey = this.nodeKey;
            this.$refs["gt-select-tree"].setCheckedNodes([]);
            this.$refs["gt-select-tree"].setCheckedNodes([
              {
                [valueKey]: data[valueKey],
                [labelKey]: data[labelKey],
              },
            ]);
            this.selectValue = data.id;
            this.$emit("updateData", "selectTreeValue", data.id);
            this.$emit("update:value", data.id);
          }
        });
      }
    },
    handleClear() {
      this.$refs["gt-select-tree"].setCheckedNodes([]);
      this.$emit("updateData", "selectTreeValue", "");
      this.$emit("update:value", "");
      this.$emit("update:defaultCheckedKeys", []);
    },
    setCheckedNodes(data, node) {
      // 单选逻辑如果需要可以写在这里
    },
    handelClickNode(data, node, self) {
      this.showSelectTree = false;
      this.$emit("handleClickNode", data, node, self);
    },
  },
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.gt-select-tree_select {
  display: none !important;
  top: 136px !important;

  .el-select-dropdown {
    display: none !important;
  }
}

.gt-select-tree {
  min-height: 150px !important;
  max-height: 312px !important;
  box-sizing: border-box;
  overflow-y: scroll;
}
.gt-select-tree::-webkit-scrollbar {
  width: 3px;
  height: 4px;
}
.gt-select-tree::-webkit-scrollbar-track {
  background: #f2f2f2;
}
.gt-select-tree::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
.gt-select-tree::-webkit-scrollbar-thumb:hover {
  background: #f2f2f2;
}
.gt-select-tree::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.2);
}
</style>
