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
      :cell-style="{ 'font-size': '12px', padding: '0' }"
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
        :width="tableColumns.indexWidth || 70"
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
          :align="item.align ? item.align : 'center'"
          :show-overflow-tooltip="item.tooltip || true"
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
            <span v-else v-html="scope.row[item.prop]"></span>
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
              :show-overflow-tooltip="subItem.tooltip || true"
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
    total: 0,
  },
  data() {
    return {
      tableHeight: 300, //随便给一个默认值，不然要报错
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
::v-deep .el-table {
  .split-row {
    background: #F3FEFF!important;
  }

  .split-row2.hover-row {
    >td{
      background: #F2F7FF!important;
    }
  }
}
  
</style>


<!-- <GtTable
:tableData="Data" //数据
:tableColumns="Columns" //表头数据
:total="Total" //总数
@handleSizeChange="handleSizeChange" //数量变化
@handleCurrentChange="handleCurrentChange" //页数变化
@sortTable="changeTableSort" //筛选变化
>
<template v-slot:direction="direction">
</template>
</GtTable> -->


<!-- 
Data: [],
Total: 0,
Columns: {
  tableWidth: "100%",
  selection: false, //是否筛选
  pagesize: 8,
  currentPage: 1,
  layout: "prev,pager,next,jumper,sizes,total", //页数据
  columns: [
    {
      prop: "direction",
      label: "方向",
      width: "70px",
      sortable: "custom", //排序
      customColumn: true, //插槽
    },
    {
      label: "我方信息", //多级表头
      children: [
        {
          prop: "receivePaymentType",
          label: "类型",
          width: "100px",
          align: "left",
        },
      ],
    },
  ],
}, 
-->

<!-- 
changeTableSort(val) {
  if (val.prop) {
    this.sortField = val.order === null ? "" : val.prop;
    this.sortRule =
      val.order === "descending"
        ? "desc"
        : val.order === "ascending"
        ? "asc"
        : "";
  }
}, -->

    <!-- 表格对齐 父组件使用 -->
      <!-- ::v-deep th .cell {
        width: 100%;
        padding: 0 12px;
        box-sizing: border-box;
        display: inline-block!important;
      }
      ::v-deep td .cell {
        width: 100%;
        padding: 0 12px;
        box-sizing: border-box;
        display: inline-block!important;
        span{
          padding: 0!important;
        }
      }
      ::v-deep .is-center .cell {
        // width: auto !important;
        padding: 0 8px;
        box-sizing: border-box;
        display: inline-block;
      }
      
      ::v-deep .is-left{
        text-align: left!important;
      }
      ::v-deep .is-right{
        text-align: right!important;
      }
      ::v-deep .el-table .el-table__header-wrapper .is-left{
              text-align: center!important;
       } -->