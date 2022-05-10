<template>
  <!-- 活动类型列表 -->
  <div>
    <el-form :inline="true" size="small" class="el-Lfrom" v-if="editInput">
      <el-form-item label="修改类型">
        <el-input
          placeholder="请输入修改类型名称"
          v-model="editInfo.type"
          class="input-with-select inputStyle"
          width="120px"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="editTypeInfo()" size="small"
        >提交</el-button
      >
      <el-button type="danger" @click="editInput = false" size="small"
        >取消</el-button
      >
    </el-form>
    <el-form :inline="true" size="small" class="el-Rfrom">
      <el-form-item label="活动类型">
        <el-input
          placeholder="请输入活动类型"
          v-model="activityTypeName"
          class="input-with-select inputStyle"
          width="120px"
        ></el-input>
      </el-form-item>
      <el-button
        type="success"
        icon="el-icon-plus"
        @click="addType()"
        size="small"
        >添加</el-button
      >
    </el-form>
    <el-table :data="activityTypeList" stripe style="width: 100%" border>
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column
        prop="type"
        label="活动类型"
        min-width="150"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editType(scope.row)"
            size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteType(scope.row)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const OK = 200;
export default {
  data() {
    return {
      activityTypeList: [],
      activeIndex: "1",
      editInput: false,
      editInfo: {
        id: 0,
        type: "",
      },
      activityTypeName: "",
    };
  },
  methods: {
    // 获取活动类型列表
    getActivityTypeList: function () {
      this.$axios.get("/api/activityTypes").then((res) => {
        if (res.data.code == OK) {
          this.activityTypeList = res.data.data;
        } else {
          // this.$layer.alert(res.data.data);
        }
      });
    },
    // 添加类型
    addType: function () {
      let data = {"type":this.activityTypeName}
      this.$axios.post("/api/activityTypes",data).then((res)=>{
        if(res.data.code == OK){
          this.$message.success("添加成功");
          this.updateData();
        }else{
          this.$message.error("添加失败");
        }
      })
    },
    // 修改类型
    editType: function (row) {
      let id = row.id;
      console.log(row.id);
      this.editInfo.id = id;
      this.editInfo.type = row.type;
      this.editInput = true;
    },
    editTypeInfo: function () {
      let data = this.editInfo;
      this.$axios.put("api/activityTypes",data).then((res)=>{
        if(res.data.code == OK){
          this.$message.success("修改成功");
          this.updateData();
        }else{
          this.$message.error("修改失败");
        }
      })
    },
    //删除类型
    deleteTypeById: function (id) {
      this.$axios.delete("/api/activityTypes/" + id).then((res) => {
        if (res.data.code == OK) {
          this.$message.success("删除成功");
          this.updateData();
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    deleteType: function (row) {
      const id = row.id;
      this.$confirm("此操作将永久删除该类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteTypeById(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateData:function(){
      this.getActivityTypeList();
      this.editInput = false;
    }
  },
  created() {
    this.getActivityTypeList();
  },
};
</script>

<style scoped="scoped">
.el-Rfrom {
  float: right;
}
.el-Lfrom {
  float: left;
}
</style>
