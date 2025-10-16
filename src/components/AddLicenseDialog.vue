<template>
  <el-dialog
    :title="type==1?'添加许可证':'修改许可证'"
    class="License-dialog"
    :visible.sync="visible"
    width="550px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="licenseForm" label-width="115px">
      <el-form-item prop="name">
        <template slot="label">
          许可证名称<span style="color: #f56c6c">*</span>
        </template>
        <el-input size="small" v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item prop="startDate" label-width="115px">
        <template slot="label">
          取得日期<span style="color: #f56c6c">*</span>
        </template>
        <el-date-picker
          size="small"
          v-model="form.startDate"
          type="date"
          placeholder="请选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item prop="duration" label-width="115px">
        <template slot="label">
          有效期时长(天)<span style="color: #f56c6c">*</span>
        </template>
        <el-input size="small" v-model="form.duration" placeholder="自动计算有效期时长" disabled></el-input>
      </el-form-item>

      <el-form-item prop="endDate" label-width="115px">
        <template slot="label">
          到期日期<span style="color: #f56c6c">*</span>
        </template>
        <el-date-picker
          size="small"
          v-model="form.endDate"
          type="date"
          placeholder="请选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSubmit">确认</el-button>
      <el-button size="small" type="info" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "AddLicenseDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {
        name: "",
        startDate: "",
        duration: "",
        endDate: ""
      },
    };
  },
  watch: {
    "form.startDate"(val) {
      this.calcDuration("startDate");
    },
    "form.endDate"(val) {
      this.calcDuration("endDate");
    }
  },
  created(){
    if(this.type === 2 && this.data){
      this.form.name = this.data.licenseName
      this.form.startDate = this.data.obtainedDate
      this.form.duration = this.data.validityPeriod
      this.form.endDate = this.data.expirationDate
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
      this.resetForm();
    },
    handleSubmit() {
      if(!this.form.name) {
        this.$message.warning("许可证名称不能为空");
        return
      }
      if(!this.form.startDate) {
        this.$message.warning("取得日期不能为空");
        return
      }
      if(!this.form.duration) {
        this.$message.warning("到期日期不能为空");
        return
      }
        const postData = {
          licenseName:this.form.name,
          obtainedDate:this.form.startDate || '',
          validityPeriod:this.form.duration || '',
          expirationDate:this.form.endDate || ''
        }
        let path = 'api/Report/add_license_info'
        if(this.type === 2){
          postData.id = this.data.id
          path = 'api/Report/update_license_info'
        }
        request({
          url: path,
          data: postData,
          method: "post",
        })
        .then((res) => { 
          console.log(res,'res');
          
          if(res.status){
            this.$message({
            type: 'success',
            message: this.type === 1 ?'添加许可证成功!':'修改许可证成功!'
          });
            this.$emit("fetchLicenseList", true);
            this.resetForm();
          } 
        }).catch((res) => {
          this.$message.error("保存失败");
        })
    },
    resetForm() {
      this.$refs.licenseForm.resetFields();
    },
    // 计算有效期时长
    calcDuration(changedField) {
      const { startDate, endDate } = this.form;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          this.$message.warning("到期日期不能早于取得日期");
          if (changedField === "startDate") {
            this.form.startDate = "";
          } else if (changedField === "endDate") {
            this.form.endDate = "";
          }
          this.form.duration = "";
        } else {
          // 计算天数差
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          this.form.duration = diffDays;
        }
      } else {
        this.form.duration = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>

.License-dialog{
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
   // ✅ 表单 label 样式修改
   .el-form-item__label {
      font-size: 14px;
      text-align: left; 
      color: #3e3e3e;
    }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  }
  

  
  .dialog-footer {
  text-align: center;
  ::v-deep .el-button {
   width: 90px;
  }
}
}

</style>