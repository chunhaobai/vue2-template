<template>
  <!-- 表格竖向撑满方法 ：在表格组件父元素 使用display:flex;flex-direction: column;-->
  <div
    class="tableBox"
    id="tableBoxId"
    :style="{ width: tableColumns.tableWidth || '100%' }"
  >
    <el-table
      ref="gtTable"
      :data="tableDatas"
      border
      :highlight-current-row="true"
      max-height="100vh"
      :height="tableHeight"
      style="width: 100%"
      :header-cell-style="{height: '15px', color: '#3E3E3E',padding: '8px 0','font-size': '12px',background:'#f6f7f9'}"
      :cell-style="{ 'font-size': '12px', padding: '0', 'white-space': 'normal', 'word-break': 'break-word' }"
      :row-style="{ height: '30px', color: '#262626' }"
      @header-dragend="dragend"
      @row-click="RowClick"
      @select="SelectionChange"
      @selection-change="SelectionChange($event, 'change')"
      @select-all="SelectAll"
      @sort-change="sortTable"
      :row-class-name="getRowBackgroundColor"
      :show-summary="tableColumns.showSummary"
      :summary-method="getSummaries"
    >
      <el-table-column
        v-if="tableColumns.selection"
        type="selection"
        fixed
        :width="tableColumns.selectionWidth || 40"
        :key="'selection'"
        :resizable="false"
        :selectable="CheckSelectable"
        :align="'center'"
      >
      </el-table-column>
      <el-table-column
        v-if="!tableColumns.isHiddenNO"
        type="index"
        label="序号"
        :width="tableColumns.indexWidth || 45"
        align="center"
        :index="TableIndex"
        :resizable="false"
        :fixed="tableColumns.indexFixed||false"
      >
      </el-table-column>

      <template v-for="(item, index) in ColumnData">
        <el-table-column
          v-if="!item.children"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :align="item.align ? item.align : 'center'"
          :show-overflow-tooltip="false"
          :sortable="item.sortable"
          :key="index"
          :fixed="item.isFixed||false"
        >
        <template slot-scope="scope">
          <slot
            v-if="item.customColumn"
            :name="item.prop"
            v-bind:data="{ row: scope.row, index: scope.$index, item: item }"
          ></slot>
          <el-tooltip v-else class="item" effect="dark" :content="scope.row[item.prop]" placement="top">
            <div class="two-line-ellipsis" v-html="scope.row[item.prop]"></div>
          </el-tooltip>
        </template>
        </el-table-column>

        <!-- 添加嵌套表头支持 -->
        <el-table-column
          v-else
          :label="item.label"
          :align="item.align ? item.align : 'center'"
          :key="index"
        >
          <template v-for="(subItem, subIndex) in item.children">
            <el-table-column
              :prop="subItem.prop"
              :label="subItem.label"
              :width="subItem.width"
              :align="subItem.align ? subItem.align : 'center'"
              :show-overflow-tooltip="subItem.tooltip !== false"
              :sortable="subItem.sortable"
              :key="subIndex"
              :fixed="subItem.isFixed||false"
            >
              <template slot-scope="scope">
                <slot
                  v-if="subItem.customColumn"
                  :name="subItem.prop"
                  v-bind:data="{ row: scope.row, index: scope.$index, item: subItem }"
                ></slot>
                <span v-else v-html="scope.row[subItem.prop]"></span>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="tableColumns.currentPage"
      :current-page="tableColumns.currentPage"
      :page-sizes="
        tableColumns.PageSizeArr ? tableColumns.PageSizeArr : [8, 20, 50, 100]
      "
      :page-size="tableColumns.pagesize ? tableColumns.pagesize : 8"
      :layout="tableColumns.layout"
      :total="total || tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    tableColumns: {
      type: Object,
      default() {
        return {};
      },
    },
    total: {
    type: Number,
    default: 0,
  },
  },
  data() {
    return {
      tableHeight: '100%', //随便给一个默认值，不然要报错
      expandRowKeys: [],
    };
  },
  mounted() {
    this.getTableHeight();
  },
  methods: {
    //改变列宽
    dragend(newWidth, oldWidth, column, event) {
      this.$emit("dragend", newWidth, oldWidth, column, event);
    },
    getTableHeight() {
      let tableBoxdOM = document.getElementById("tableBoxId");
      this.tableHeight = tableBoxdOM.offsetHeight - 50;
    },
    // 索引
    TableIndex(index) {
      var SerialNumber = 1;
      if (Number(this.tableColumns.pagesize) > 0) {
        let pagesize = Number(this.tableColumns.pagesize);
        SerialNumber = this.Decimal.sub(this.tableColumns.currentPage, 1)
          .mul(pagesize)
          .add(index)
          .add(1)
          .abs()
          .trunc()
          .toNumber();
      } else {
        SerialNumber = this.Decimal.add(index, 1).trunc().abs().toNumber();
      }
      return SerialNumber;
    },
    CheckSelectable() {
      return true;
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    RowClick(val) {
      this.$emit("RowClick", val);
    },

    SelectionChange(e, type) {
      this.$emit("SelectionChange", e, type);
    },
    SelectAll(val) {
      this.$emit("SelectAll", val);
    },
    sortTable(val){
      this.$emit("sortTable", val);
    },
    getRowBackgroundColor({row}){
      let result = "";
      this.$emit('getRowBackgroundColor', row, (val) => {
        result = val;
      })
      return result;
    },
    getSummaries(param) {
      const { columns, data } = param;
      let sums = [];
      this.$emit('getSummaries', columns, data, (val) => {
        sums = val;
      })
      return sums;
      // columns.forEach((column, index) => {
      //   if (index === 0) {
      //     sums[index] = '合计';
      //   } else {
      //     const values = data.map(item => Number(item[column.property]));
      //     if (!values.every(value => isNaN(value) || value=='')) {
      //       sums[index] = values.reduce((prev, curr) => {
      //         const value = Number(curr);
      //         if (!isNaN(value)) {
      //           return prev + curr;
      //         } else {
      //           return prev;
      //         }
      //       }, 0);
      //     } else {
      //       sums[index] = '';
      //     }
      //   }
      // });
    },
  },
  computed: {
    ColumnData() {
      // console.log(this.tableColumns.columns);
      return this.tableColumns.columns;
    },
    tableDatas() {
      return this.tableData;
    },
  },
  watch: {
    tableDatas: {
      handler(newval, oldval) {
        this.$nextTick(() => {
          this.$refs.gtTable.doLayout();
          if (this.projectType == "qyweixin") {
            window.WWOpenData.bind(document.querySelector("ww-open-data"));
          }
        });
      },
      deep: true,
    },
    ColumnData: {
      handler(newval, oldval) {
        this.$nextTick(() => {
          this.$refs.gtTable.doLayout();
        });
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.two-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 显示几行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
::v-deep .el-table {
  position: absolute;
  top: 0;
  left: 0;
  .split-row {
    background: #F3FEFF!important;
  }

  .split-row2.hover-row {
    >td{
      background: #F2F7FF!important;
    }
  }
  th.el-table__cell>.cell{
    padding-left: 8px;
    padding-right: 8px;
  }
}
  
</style>