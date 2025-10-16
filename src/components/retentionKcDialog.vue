<template>
  <el-dialog
    title="滞留库存明细"
    class="retention-dialog"
    :visible.sync="visible"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="table-wrapper">
      <gt-table
        class="table_retention"
        :tableData="retentionData"
        :tableColumns="retentionColumns"
      >
    </gt-table>
    </div>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import GtTable from "../components/GtTable.vue";

export default {
  name: "retentionKcDialog",
  components: {
    GtTable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      retentionData:[
      ],
      retentionColumns: {
        tableWidth: "100%",
        selection: false,
        columns: [
          { label: "入库单号", prop: "rkdh", minWidth: "100",align: "left"},
          { label: "入库时间", prop: "rkTime",width: "85" },
          { label: "仓库名称", prop: "ckmc",  minWidth: "125",align: "left"},
          { label: "滞留库存", prop: "retentionKc", width: "65" ,align: "right"},
          { label: "剩余天数", prop: "remainDays",  width: "65",align: "left" },
        ],
      },
    };
  },
  created(){
    // this.get_detention_warning_report();
    console.log(this.data.row);
    
    this.retentionData = this.data.row
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    // get_detention_warning_report() {
    //   let path =`api/Report/get_detention_warning_doc_1?hpid=${this.data.row.hpid}&retentionKc=${this.data.row.retentionKc}&yxq=${this.data.row.yxq}&ckid=${this.data.ckid}&lbIndex=${this.data.lbindex}`;
    //   request({
    //     url: path,
    //     method: "get",
    //   })
    //     .then((res) => {
    //       if (res.status) {
    //         this.retentionData = res.resData.rows;
    //       }
    //     })
    //     .catch((res) => {
    //       this.$message.error("获取数据失败");
    //     });
    // },

  }
};
</script>
<style lang="scss" scoped>

.retention-dialog{
 
  ::v-deep  .el-dialog {
    // ::v-deep .el-dialog {
  //   margin-top: 5vh !important;
  // }
  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    .el-dialog__title {
      font-size: 16px;
      font-family: Source Han Sans CN, Source Han Sans CN-700;
      font-weight: 700;
      text-align: LEFT;
      color: #3e3e3e;
    }
    .el-dialog__title::before {
        content: "";  // 必须写，否则伪元素不会显示
        display: inline-block;
        width: 4px;
        height: 14px;
        background-color: #4083ff;
        margin-right: 8px;
        margin-bottom: 3px;
        vertical-align: middle;
      }
    .el-dialog__headerbtn {
      .el-dialog__close {
        color: #606266;
      }
    }
  }
  .el-dialog__body{
    
  }
  }
  .table-wrapper{
    ::v-deep .table_retention{
      .el-table{
        position: unset !important;
        .el-table__body-wrapper{
          max-height: 260px;
          min-height: 200px;
        }
      } 
    }
  }
}

</style>