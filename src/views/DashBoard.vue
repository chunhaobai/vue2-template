<template>
  <div class="dashboard-page">
    <!-- 顶部标题 -->
    <div class="top-bar">
      <img :src="require('@/static/top_left.png')" alt="" />
      <div class="title">倍丝特物流预警看板</div>
      <img :src="require('@/static/top_right.png')" alt="" />
    </div>

    <!-- 主体：左右布局 -->
    <div class="main-wrap">
      <!-- 左边：货品 -->
      <section class="panel left-panel">
        <!-- 顶部卡片 -->
        <div class="card">
          <div class="card-left">
            <img :src="require('@/static/card_left.png')" alt="" />
          </div>
          <div class="card-right">
            <div class="card-sub">
              即将到期货品<span class="minText"
                >（距离到期日小于 <span class="highlight">45天</span>）</span
              >
            </div>
            <div class="card-count">
              共 <span class="num">{{ goodsTotal }}</span> 种货品
            </div>
          </div>
        </div>

        <!-- 表格标题 + 过滤 -->
        <div class="panel_bottom">
          <!-- <div>123</div>
          <div>456</div> -->
          <div class="panel-title">
            <img
              :src="require('@/static/bottom_title.png')"
              alt=""
            />即将到期货品列表（距离到期日小于45天）
          </div>
          <div class="filter-row">
            <el-input
              size="mini"
              v-model="hpInfo"
              placeholder="商品编码、名称、规格查询"
              class="filter-item"
              @keypress.native.enter="goodsHandleSearch"
              @input="goodsHandleInput"
              clearable
            />
            <el-select
              size="mini"
              v-model="ckid"
              placeholder="请选择仓库"
              class="filter-item"
              @change="ckChangHand"
            >
              <el-option
                v-for="item in ckArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <select-tree
              class="filter-item"
              placeholder="货品类型"
              v-model="selectTreeValue"
              :lazy="true"
              nodeKey="id"
              :defaultProps="{
                childern: 'childern',
                label: 'name',
                isLeaf: 'isLeaf',
              }"
              :handleLoadNode="handleLoadNode"
              @updateData="handleUpdateData"
              @handleClickNode="handleClickNode"
            ></select-tree>
          </div>

          <!-- 表格 -->
          <div class="table-wrapper">
            <gt-table
              class="table_goods"
              :tableData="goodsData"
              :tableColumns="goodsColumns"
            >
            <template v-slot:retentionKc="retentionKc">
                <span
                  style=" cursor: pointer;;color: #409eff !important"
                  @click="retentionKcDetalis(retentionKc.data.row)"
                  >{{retentionKc.data.row.retentionKc}}</span
                >
              </template>
            <template v-slot:remainDays="remainDays">
                <span
                  style="color: #F25753 !important"
                  >{{remainDays.data.row.remainDays}}</span
                >
              </template>
          </gt-table>
            
          </div>
        </div>
      </section>

      <!-- 右边：许可证 -->
      <section class="panel right-panel">
        <!-- 顶部卡片 -->
        <div class="card">
          <div class="card-left">
            <img :src="require('@/static/card_right.png')" alt="" />
          </div>
          <div class="card-right">
            <div class="card-sub">
              即将到期许可证<span class="minText"
                >（距离到期日小于 <span class="highlight">45天</span>）</span
              >
            </div>
            <div class="card-count">
              共 <span class="num">{{ licenseTotal }}</span> 个许可证
            </div>
          </div>
        </div>

        <!-- 表格标题 + 过滤 -->
        <div class="panel_bottom">
          <div class="panel_right">
            <div>
              <img :src="require('@/static/bottom_title.png')" alt="" />
              许可证信息
            </div>

            <el-button v-show="systemSet" type="primary" icon="el-icon-plus" size="mini" @click="addLicense"
              >添加许可证</el-button
            >
          </div>
          <div class="filter-row">
            <el-input
              size="mini"
              v-model="licenseName"
              placeholder="输入许可证名称查询"
              class="filter-item"
              @keypress.native.enter="licenseHandleSearch"
              @input="licenseHandleInput"
              clearable
            />
            <el-select
              size="mini"
              v-model="licenseStatus"
              placeholder="状态"
              class="filter-item"
              @change="get_license_info"
            >
            <el-option
                v-for="item in licenseStatusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>

          <!-- 表格 -->
          <div class="table-wrapper">
            <gt-table
              class="table_license"
              :tableData="licenseData"
              :tableColumns="licenseColumns"
            >
            <template v-slot:remainDays="remainDays">
              <span :style="{ color: remainDays.data.row.status === '正常' ? '#00C27C' : remainDays.data.row.status === '即将到期' ?'#FF7528':'#F25753' }">
                {{ remainDays.data.row.remainDays }}
                </span>
             </template>
             <template v-slot:status="status">
              <span :style="{ color: status.data.row.status === '正常' ? '#00C27C' : status.data.row.status === '即将到期' ?'#FF7528':'#F25753' }">
                {{ status.data.row.status }}
                </span>
             </template>
              <template v-slot:operation="operation">
                <i
                  @click="editLicense(operation.data.row)"
                  class="el-icon-edit"
                  style="color: #4083FF ;cursor: pointer;margin-right: 10px"
                ></i>
                <i
                  @click="deleteLicense(operation.data.row)"
                  class="el-icon-delete"
                  style="color: #4083FF ;cursor: pointer;"
                ></i>
              </template>
            </gt-table>
          </div>
        </div>
      </section>
    </div>
    <add-license-dialog
      v-if="showDialog"
      :visible.sync="showDialog"
      :type="licenseType"
      :data="licenseRowData"
      @fetchLicenseList="fetchLicenseList"
    ></add-license-dialog>
    <retention-Kc-dialog
      v-if="showKcDialog"
      :visible.sync="showKcDialog"
      :data="retentionData"
      @retentionKcList="retentionKcList"
    ></retention-Kc-dialog>
  </div>
</template>
<script>
import GtTable from "../components/GtTable.vue";
import AddLicenseDialog from "../components/AddLicenseDialog.vue";
import retentionKcDialog from "../components/retentionKcDialog.vue";
import request from "@/utils/request";
import SelectTree from "../components/SelectTree.vue";

export default {
  name: "Dashboard",
  components: {
    GtTable,
    AddLicenseDialog,
    SelectTree,
    retentionKcDialog
  },
  data() {
    return {
      licenseStatusArr:[
        {label:'全部',value:0},
        {label:'正常',value:1},
        {label:'即将到期',value:2},
        {label:'已过期',value:3}
      ],
      retentionData:{},
      showKcDialog:false,
      systemSet:false,
      licenseStatus:'',
      licenseName:"",
      licenseRowData:{},
      timeid:null,
      hpInfo:'',
      lbindex: "",
      selectTreeValue: "",
      ckArr: [],
      licenseType: 1,
      showDialog: false,
      goodsTotal: 0,
      licenseTotal: 0,
      ckid:'',
      goodsColumns: {
        tableWidth: "100%",
        selection: false,
        columns: [
          { label: "商品账册料号", prop: "hpbm", width: "89",align: "left"},
          { label: "货品名称", prop: "hpmc",minWidth: "90" ,align: "left"},
          { label: "规格型号", prop: "ggxh",  minWidth: "65",align: "left"},
          { label: "货品类别", prop: "lbName", width: "65" ,align: "left"},
          { label: "计量单位", prop: "jldw",  width: "65" ,align: "left"},
          { label: "实时库存", prop: "currKc", width: "65",align: "right",},
          { label: "滞留库存", prop: "retentionKc",  width: "65",align: "right", customColumn: true},
          { label: "剩余天数", prop: "remainDays",  width: "65" ,align: "left", customColumn: true},
          { label: "最早入库时间", prop: "firstRKTime",  width: "89"},
          { label: "最后出库时间", prop: "lastCkTime", width: "89"},
        ],
      },
      licenseColumns: {
        tableWidth: "100%",
        selection: false,
        columns: [
          { label: "许可证名称", prop: "licenseName", minWidth: "125",align: "left" },
          { label: "取得日期", prop: "obtainedDate", width: "85" },
          { label: "有效期时长（天）", prop: "validityPeriod", width: "113",align: "left" },
          { label: "到期日期", prop: "expirationDate", width: "85" },
          { label: "剩余天数", prop: "remainDays", width: "85",align: "left",customColumn: true },
          { label: "状态", prop: "status", width: "85",align: "left",customColumn: true, },
        ],
      },
      goodsData: [],
      licenseData: [],
    };
  },
  created() {
    this.queryckrightcontrol();
    this.licenseStatus = this.licenseStatusArr[0].value
    this.get_license_info();
    this.systemSet = localStorage.getItem('systemSet') == 'true';
    
    if(this.systemSet){
      this.licenseColumns.columns.push({
        label: "操作",
        prop: "operation",
        width: "85",
        customColumn: true,
      })
    }
  },
  methods: {
    retentionKcList(val){
      this.retentionData = {};
      this.showKcDialog = false;
    },
    fetchLicenseList(val) {
      this.get_license_info();
      this.licenseRowData = {};
      this.showDialog = false;
      
    },
    retentionKcDetalis(row){
      this.retentionData = {
        row:row.details,
      }
      this.showKcDialog = true;
    },
    editLicense(row) {
      console.log("edit license", row);
      this.licenseType =2;
      this.licenseRowData = row;
      this.showDialog = true;
    },
    deleteLicense(row) {
      this.$confirm(`确认删除【${row.licenseName||''}许可证】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'delete-confirm-box'  // 自定义 class
    }).then(() => {
      this.delete_license_info(row.id)
    }).catch(() => {})
    },
    delete_license_info(id){
      const postData = {
        delIds:[id]
      }
      request({
          url: 'api/Report/delete_license_info',
          data: postData,
          method: "post",
        })
        .then((res) => { 
          if(res.status){
            this.get_license_info();
            this.$message({
            type: 'success',
            message: '删除许可证成功!'
          });
            
          } 
        }).catch((res) => {
          this.$message.error("删除失败");
        })
    },
    goodsHandleSearch() {
      this.get_detention_warning_report();
    },
    goodsHandleInput() {
      if (this.timeid) {
        clearTimeout(this.timeid);
        this.timeid = null;
      }
      this.timeid = setTimeout(() => {
        this.get_detention_warning_report();
      }, 600);
    },
    licenseHandleSearch() {
      this.get_license_info();
    },
    licenseHandleInput() {
      if (this.timeid) {
        clearTimeout(this.timeid);
        this.timeid = null;
      }
      this.timeid = setTimeout(() => {
        this.get_license_info();
      }, 600);
    },

    ckChangHand(){
      this.get_detention_warning_report();
    },
    async handleLoadNode(node, resolve) {
      if (node.level === 0) {
        let arr = [];
        await request({
          url: `api/Hplb/query`,
          method: "get",
        }).then((res) => {
          res.resData.rows.forEach((item) => {
            item.isLeaf = !item.isnext;
          });
          arr = res.resData.rows;
          arr.unshift({
            name: "未指定类型",
            id: "-01",
            isLeaf: true,
          });
        });
        return resolve(arr);
      } else {
        if (!node.isLeaf) {
          let arr = [];
          await request({
            url: `api/Hplb/query?id=${node.data.id}`,
            method: "get",
          }).then((res) => {
            res.resData.rows.forEach((item) => {
              item.isLeaf = !item.isnext;
            });
            arr = res.resData.rows;
          });
          return resolve(arr);
        }
        return resolve([]);
      }
    },
    handleUpdateData(type, data) {
      if (type == "selectTreeValue") {
        this.selectTreeValue = "";
        this.lbindex = "";
      }
      this.get_detention_warning_report()
    },
    handleClickNode(data, node) {
      console.log(data, node,'handleClickNode');
      this.selectTreeValue = data.name;
      this.lbindex = data.index || "-01";
      this.get_detention_warning_report()
    },
    addLicense() {
      this.licenseType =1;
      this.showDialog = true;
      console.log("add license");
    },
    queryckrightcontrol() {
      request({
        url: "api/Ck/query?pageIndex=1&pageSize=100000",
        method: "get",
      }).then((res) => {
        console.log(res, "gaga");

        if (res.status) {
          this.ckArr = res.resData.rows.map((ele) => {
            return {
              value: ele.id,
              label: ele.ckName,
            };
          });
          if(this.ckArr.length>0){
            this.ckid = this.ckArr[0].value;
            this.get_detention_warning_report();
          }else{
            this.$message.error("当前仓库为空，请添加仓库");
          }
          
        }
      });
    },
    get_detention_warning_report() {
      if(!this.ckid){
        this.$message.warning("仓库不能为空");
        return
      }
      let path =`api/Report/get_detention_warning_report_1?hpInfo=${this.hpInfo}&lbIndex=${this.lbindex}&ckid=${this.ckid||''}`;
      request({
        url: path,
        method: "get",
      })
        .then((res) => {
          if (res.status) {
            this.goodsData = res.resData.rows;
            this.goodsTotal = res.resData.total;
          }
        })
        .catch((res) => {
          this.$message.error("获取数据失败");
        });
    },
    get_license_info() {
      let path =`api/Report/get_license_info?licenseName=${this.licenseName}&status=${this.licenseStatus || 0}`;
      request({
        url: path,
        method: "get",
      })
        .then((res) => {
          if (res.status) {
            this.licenseData = res.resData.rows;
            this.licenseTotal = res.resData.total;
          }
        })
        .catch((res) => {
          this.$message.error("获取数据失败");
        });
    },
  },
};
</script>
<style lang="scss">
.delete-confirm-box .el-message-box__btns {
  display: flex;
  flex-direction: row-reverse;
  .el-button--primary{
    margin: 0 10px;
    background: #409eff;
  }
}
</style>
<style lang="scss" scoped>

.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .top-bar {
    height: 70px;
    background-image: url("~@/static/top_title.png");
    background-size: 100% 100%; /* 背景图片覆盖整个元素 */
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 13px;
      height: 18px;
    }
    .title {
      margin: 0 50px;
      font-size: 28px;
      font-weight: bold;
      line-height: 1; // 避免行高影响
      color: #fff;
    }
  }

  .main-wrap {
    background: #f9faff;
    display: flex;
    height: calc(100vh - 100px);
    gap: 15px; // 左右间距
    overflow: hidden;
    padding: 15px;

    .panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      overflow: hidden;

      .card {
        height: 130px;
        background: linear-gradient(
            180deg,
            rgba(30, 117, 249, 0.03) 0%,
            rgba(30, 117, 249, 0) 100%
          ),
          #ffffff;
        border: 2px solid #ffffff;
        box-shadow: 0px 0px 12px 0px rgba(168, 175, 211, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        // border-radius: 12px;
        padding: 12px 16px;
        margin-bottom: 12px;

        .card-left {
          width: 115px;
          height: 115px;
          margin-right: 40px;
          line-height: 1;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .card-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .card-sub {
            font-size: 29px;
            color: #3e3e3e;
            margin-bottom: 4px;
            .minText {
              font-size: 18px;
              .highlight {
                color: #f25d59;
              }
            }
          }
          .card-count {
            font-size: 20px;
            color: #706c6d;
            .num {
              font-size: 48px;
              font-weight: 500;
              color: #f25753;
              margin: 0 6px;
            }
          }
        }
      }
      .panel_bottom {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: #fff;
        padding: 15px;
        .goods-type {
          // height: 24px;
          width: 156px;
          margin-right: 10px;
          ::v-deep .el-select {
            display: block;
          }
        }
        .panel-title {
          font-size: 20px;
          font-weight: 500;
          text-align: LEFT;
          color: #151515;
          display: flex;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid #f2f2f2;
          line-height: 1;
          img {
            width: 13px;
            height: 19px;
            margin-right: 5px;
          }
        }
        .panel_right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f2f2f2;
          div {
            font-size: 20px;
            font-weight: 500;
            text-align: LEFT;
            color: #151515;
            display: flex;
            align-items: center;
            line-height: 1;
            img {
              width: 13px;
              height: 19px;
              margin-right: 5px;
            }
          }
        }

        .filter-row {
          display: flex;
          align-items: center;
          margin: 15px 0;

          .filter-item {
            margin-right: 25px;
            min-width: 160px;
            max-width: 200px;
          }
        }

        // /* 表格自适应高度 */
        .table-wrapper {
          flex: 1; /* 占满剩余高度 */
          overflow: hidden; // 防止溢出
          position: relative;
        }

        ::v-deep .table_goods,
        .table_license {
          // position: absolute;
          // top: 0;
          // left: 0;
        }
      }
    }
  }
}
</style>