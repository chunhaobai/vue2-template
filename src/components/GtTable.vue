<template>
  <el-table
    ref="table"
    :data="tableData"
    style="width: 100%;"
    :height="'100%'"
    :style="{ tableLayout: 'fixed' }"
    :header-cell-style="headerCellStyle"
    :cell-style="cellStyle"
    :row-style="rowStyle"
    :header-row-style="headerRowStyle"
  >
    <!-- 序号列 -->
    <el-table-column
      v-if="tableColumns.isHiddenNO != false"
      type="index"
      label="序号"
      :width="60"
      align="center"
      :index="TableIndex"
      :resizable="false"
      :fixed="false"
    >
    </el-table-column>

    <!-- 动态列 -->
    <el-table-column
      v-for="(column, index) in tableColumns.columns"
      :key="index"
      :prop="column.col || column.prop"
      :label="column.value || column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :resizable="tableColumns.resizable"
      :align="column.align || 'center'"
      :header-align="'center'"
      :show-overflow-tooltip="false"
    >
      <!-- 如果列配置了 sortable，就启用插槽渲染 -->
      <template v-if="column.sortable" v-slot="scope">
        <slot :name="column.sortable" v-bind="scope" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "AiTable",
  props: {
    tableColumns: {
      type: Object,
      required: true,
      default: () => ({ columns: [] })
    },
    tableData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
    };
  },
  methods: {
    /** 序号 */
    TableIndex(index) {
      return index + 1;
    },
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
    const lastIndex = this.tableColumns.columns.length - 1;
    const isLast = columnIndex === lastIndex;
    return {
      ...this.tableColumns.headerStyle,
      borderRight: isLast && !this.tableColumns.isBorder ? 'none' : this.tableColumns.headerStyle.borderRight
    };
  },
  cellStyle({ row, column, rowIndex, columnIndex }) {
    const lastIndex = this.tableColumns.columns.length - 1;
    const isLast = columnIndex === lastIndex;
    return {
      ...this.tableColumns.cellStyle,
      borderRight: isLast&& !this.tableColumns.isBorder ? 'none' : this.tableColumns.cellStyle.borderRight
    };
  },
  rowStyle({ row, rowIndex }) {
    const lastRow = this.tableData.length - 1;
    const isLastRow = rowIndex === lastRow;
    return {
      ...this.tableColumns.rowStyle,
      borderBottom: isLastRow && !this.tableColumns.isBorder ? 'none' : this.tableColumns.rowStyle.borderBottom
    };
  },
  headerRowStyle({ row, rowIndex }) {
    return this.tableColumns.headerRowStyle || {};
  }
  }
};
</script>

<style scoped>
/* 让表格在缩放时更平滑 */
.el-table {
  transition: all 0.3s ease;
}
</style>

<!-- <template #operation="{ row }">
  模版使用
</template> -->
<!-- 
传参模版
tableColumns: {
  resizable: false,  //是否动态调整宽度
  isHiddenNO: false, //序号
  headerStyle: {
    background: "#599be6",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: "14px",
    fontFamily: "PingFang SC, PingFang SC-400",
    borderRight: "1px solid #053067",
    borderBottom: "1px solid #053067",
    padding: "7px 0",
  },
  cellStyle: {
    background: "#1a66bb",
    color: "rgba(255,255,255,0.8)",
    fontWeight: "400",
    fontFamily: "PingFang SC, PingFang SC-400",
    fontSize: "14px",
    borderRight: "1px solid #053067",
    borderBottom: "1px solid #053067",
    padding: "7px 0",
  },
  rowStyle: {
    background: "#1B548D",
  },
  headerRowStyle: {
    background: "#1B548D",
  },
  columns: [
    { prop: "CreateTime", label: "时间" },
    { prop: "Remark", label: "模版-材料名称" },
    { prop: "operation", label: "操作", sortable: "operation" },
  ],
}, -->

