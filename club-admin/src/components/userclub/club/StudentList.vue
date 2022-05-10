<template>
  <div v-if="studentPage != null">
    <el-form :inline="true" size="small">
      <el-form-item label="学生信息">
        <el-input
          placeholder="请输入学号/姓名"
          prefix-icon="el-icon-search"
          v-model="studentName"
          class="input-with-select"
          width="120px"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="社团类型">
        <el-select v-model="studentTypeId" placeholder="请选择社团类型">
          <el-option label="所有" value=""></el-option>
          <el-option v-for="studentType in studentTypeList" :key="studentType.id" :label="studentType.type"
                     :value="studentType.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="find" icon="el-icon-search"
          >查询</el-button
        >
      </el-form-item>
      <!-- <el-button
        type="success"
        icon="el-icon-plus"
        @click="addPage()"
        size="small"
        class="add-button"
        >添加</el-button
      > -->
    </el-form>
    <el-table
      :data="studentData"
      stripe
      style="width: 100%"
      :height="420"
      border
    >
      <el-table-column
        prop="num"
        label="学号"
        :sortable="true"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="sexName"
        label="性别"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="institute"
        label="学院"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        :sortable="true"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="150">
        <template slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-edit" @click="editPage(scope.row)" size="mini">编辑</el-button> -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteStudent(scope.row)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      background
      layout="total, sizes, prev, pager, next"
      :current-page.sync="currentPage"
      :total="studentPage.total"
      @current-change="refreshStudentPage"
      @size-change="handleSizeChange"
      :page-size="pageSize"
      :page-sizes="pageSizeArray"
    ></el-pagination>
  </div>
</template>

<script>
const OK = 200;
export default {
  data() {
    return {
      studentPage: {},
      input: "",
      studentData: [],
      studentTypeList: [],
      studentName: null,
      studentTypeId: null,
      currentPage: 1,
      pageSize: 5,
      pageSizeArray: [5, 10, 15, 20],
      clubId: "",
    };
  },
  components: {},
  methods: {
    getStudentPage: function (pageNum, pageSize) {
      let params = {
        name: this.studentName,
        clubId: this.clubId,
        pageNum: pageNum,
        pageSize: pageSize,
      };
      this.$axios.get("/api/students", { params }).then((res) => {
        if (res.data.code === OK) {
          this.studentPage = res.data.data;
          this.studentData = this.studentPage.list;
          this.pages = this.studentPage.pages;
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    // editPage: function (row) {
    //   var num = row.num;
    //   console.log(num);
    //   this.$router.push({ name: "EditStudent", query: { num: num } });
    // },
    // addPage: function () {
    //   this.$router.push({ name: "AddStudent" });
    // },
    deleteDao: function (studentId) {
        console.log(studentId)
      this.$axios.delete("/api/students/delete/" + studentId).then((res) => {
        if (res.data.code == OK) {
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    deleteStudent: function (row) {
      let id = row.userClub.id;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteDao(id);
        this.getStudentPage(this.currentPage, this.pageSize);
      });
    },
    find: function () {
      this.getStudentPage(this.currentPage, this.pageSize);
    },
    refreshStudentPage: function (page) {
      this.currentPage = page;
      this.getStudentPage(this.currentPage, this.pageSize);
    },
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getStudentPage(this.currentPage, this.pageSize);
    },
    // getStudentTypeList: function () {
    //   this.$axios.get("/api/studentTypes").then((res) => {
    //     if (res.data.code === OK) {
    //       this.studentTypeList = res.data.data;
    //     } else {
    //       this.$message.error(res.data.data);
    //     }
    //   });
    // },
    getUser: function () {
      let token = this.$cookies.get("token");
      this.$axios
        .get("/api/users/getUser", {
          params: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.code == OK) {
            this.clubId = res.data.data.clubId;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    fush: function () {
      this.getUser();
      // setTimeout(() => {
      //   this.getStudentPage(this.currentPage, this.pageSize);
      // }, 100);
    },
  },
  mounted() {
    this.fush();
  },
  watch: {
    $route(to, from) {
      this.fush();
    },
    clubId:function(){
      this.getStudentPage(this.currentPage, this.pageSize);
    }
  },
};
</script>
<style scoped="scoped">
@import "../../../css/common.css";
.add-button {
  float: right;
}
</style>
