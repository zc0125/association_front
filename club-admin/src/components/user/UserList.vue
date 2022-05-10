<template>
  <div v-if="userPage != null">
    <el-form :inline="true" size="small">
      <el-form-item label="用户名称">
        <el-input
          placeholder="请输入用户名称"
          prefix-icon="el-icon-search"
          v-model="userName"
          class="input-with-select"
          width="120px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="userTypeId" placeholder="请选择用户类型">
          <el-option label="所有" value=""></el-option>
          <el-option
            v-for="userType in userRoleList"
            :key="userType.id"
            :label="userType.roleName"
            :value="userType.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="find" icon="el-icon-search"
          >查询</el-button
        >
      </el-form-item>

      <el-button
        type="success"
        icon="el-icon-plus"
        @click="addPage"
        size="small"
        class="add-button"
        >添加</el-button
      >
    </el-form>
    <el-table :data="userData" stripe style="width: 100%" :height="420" border>
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column
        prop="name"
        label="用户姓名"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="sexName"
        label="性别"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="account"
        label="用户账号"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="institute"
        label="学院"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="clubName"
        label="社团"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        label="职位"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="用户创建时间"
        :sortable="true"
      ></el-table-column>
      <!-- <el-table-column
        prop="lastLoginTime"
        label="最后次登录时间"
        :sortable="true"
      ></el-table-column> -->
      <el-table-column fixed="right" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editPage(scope.row)"
            size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteUser(scope.row)"
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
      :total="userPage.total"
      @size-change="getPageSize"
      @current-change="refreshUserPage"
      :page-size="5"
      :page-sizes="pageSizes"
    ></el-pagination>
  </div>
</template>

<script>
const OK = 200;
export default {
  data() {
    return {
      currentPage: 1,
      pageSizes: [5, 10, 15, 20],
      pageSize: 5,
      userPage: {},
      userData: [],
      userSearch: {},
	  userTypeId:"",
	  userRoleList:[]
    };
  },
  components: {},
  methods: {

	      getUserRoleList: function () {
      this.$axios.get("/api/userRoles").then((res) => {
        if (res.data.code == OK) {
          this.userRoleList = res.data.data;
        } else {
          this.$layer.alert(res.data.data);
        }
      });
    },
    getPageSize: function (val) {
      this.pageSize = val;
      this.getFilePage(this.currentPage, this.pageSize);
    },
    getUserPage: function (pageNum, pageSize) {
      var typeId = this.$route.query.userTypeId;
      this.typeId = typeId;
      console.log(typeId);
      this.$axios
        .get("/api/users", {
          params: {
            pageNum: pageNum,
            pageSize: pageSize,
            // this.userSearch
          },
        })
        .then((res) => {
          // console.log(res.data.data);
          if (res.data.code == OK) {
            this.userPage = res.data.data;
            this.userData = this.userPage.list;
            console.log(this.userData);
          } else {
            this.$message.error(res.data.data);
          }
        });
    },
    editPage: function (row) {
      var id = row.id;
      console.log(row.id);
      this.$router.push({ name: "EditUser", query: { id: id } });
    },
    addPage: function () {
      this.$router.push({ name: "AddUser" });
    },
    deleteDao: function (id) {
      this.$axios.delete("/api/users/" + id).then((res) => {
        if (res.data.code == OK) {
          this.getUserPage(this.currentPage, this.pageSize);
          this.$message.success("删除成功！");
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    deleteUser: function (row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteDao(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    refreshUserPage: function () {
      var fileTypeId = this.$route.query.fileTypeId;
      this.getUserPage(this.currentPage, this.pageSize);
    },
    find: function () {
      this.getUserPage(this.currentPage, this.pageSize);
    },
  },
  created() {
    this.getUserPage(this.currentPage, this.pageSize);
	this.getUserRoleList();
  },
  watch: {
    $route(to, from) {
      this.getUserPage(this.currentPage, this.pageSize);
	  this.getUserRoleList();
    },
  },
};
</script>
<style scoped="scoped">
@import "../../css/common.css";
.add-button {
  float: right;
}
</style>
