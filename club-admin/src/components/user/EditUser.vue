<template>
  <el-form class="main" size="small" :model="user" label-width="100px">
    <el-form-item label="用户姓名"
      ><el-input v-model="user.name" placeholder="请填写姓名"></el-input
    ></el-form-item>

    <el-form-item label="用户性别">
      <el-radio v-model="radioSex" label="0">保密</el-radio>
      <el-radio v-model="radioSex" label="1">男</el-radio>
      <el-radio v-model="radioSex" label="2">女</el-radio>
    </el-form-item>
    <el-form-item label="学院"
      ><el-input
        v-model="user.institute"
        placeholder="请填写学院信息"
      ></el-input
    ></el-form-item>

    <el-form-item label="关联社团" prop="clubNum">
      <el-select v-model="user.clubId" placeholder="请选择社团名称">
        <el-option
          v-for="club in clubList"
          :key="club.num"
          :label="club.name"
          :value="club.num"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="账户邮箱"
      ><el-input
        v-model="user.account"
        placeholder="请填写邮箱账户"
        @blur="sendEmail"
      ></el-input
    ></el-form-item>
    <el-form-item label="密码"
      ><el-input
        type="password"
        v-model="password"
        placeholder="请输入密码"
      ></el-input
    ></el-form-item>
    <el-form-item label="确认密码"
      ><el-input
        type="password"
        v-model="user.password"
        placeholder="确认密码"
        @blur="rePassword"
      ></el-input
    ></el-form-item>
    <el-form-item label="用户类型" prop="userTypeId">
      <el-select v-model="user.roleId" placeholder="请选择用户类型">
        <el-option
          v-for="userType in userRoleList"
          :key="userType.id"
          :label="userType.roleName"
          :value="userType.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="update">更新</el-button>
      <el-button @click="goBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const OK = 200;
export default {
  data() {
    return {
      user: {
        name: "",
        sex: 0,
        institute: "",
        clubId: "",
        account: "",
        password: "",
        roleId: "",
		createTime:"",
        isActive: 1,
      },
      password: "",
      radioSex: "0",
      userRoleList: [],
      clubList: [],
    };
  },
  methods: {
    get: function (id) {
      this.$axios.get("/api/users/" + id).then((res) => {
        console.log(res.data);
        if (res.data.code == OK) {
          this.user = res.data.data;
			this.radioSex = this.user.sex+"";
			this.password = this.user.password;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
	sendEmail: function () {
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.user.account != "" && !regEmail.test(this.user.account)) {
        this.$message({
          message: "邮箱格式不正确",
          type: "error",
        });
        this.user.account = "";
      }
    },
    rePassword: function () {
      if (this.password != this.user.password) {
        this.$message({
          message: "两次密码不一致",
          type: "error",
        });
      }
    },
    getUserRoleList: function () {
      this.$axios.get("/api/userRoles").then((res) => {
        if (res.data.code == OK) {
          this.userRoleList = res.data.data;
        } else {
          this.$layer.alert(res.data.data);
        }
      });
    },
    getClubList: function () {
      this.$axios.get("/api/clubs/list").then((res) => {
        if (res.data.code == OK) {
          this.clubList = res.data.data;
          this.$message.success(this.clubList);
        } else {
          this.$layer.alert(res.data.data);
        }
      });
    },
    update: function () {
      console.log(this.user);
      this.$axios.put("/api/users/", this.user).then((res) => {
        // this.$layer.msg(res.data);
        // console.log(res.data);
        if (res.data.code == OK) {
          this.$message({
            message: "更新用户成功",
            type: "success",
          });
          this.$router.push({name:"UserList"});
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
    getUserRoleList: function () {
      this.$axios.get("/api/userRoles").then((res) => {
        if (res.data.code == OK) {
          this.userRoleList = res.data.data;
        } else {
          this.$layer.alert(res.data.data);
        }
      });
    },
    goBack: function () {
      this.$router.back(-1);
    },
  },
  created() {
    var id = this.$route.query.id;
    this.get(id);
    this.getUserRoleList();
	this.getClubList()
  },
  watch: {
    $route(to, from) {
      this.getUserRoleList();
	  this.getClubList()
    },
  },
};
</script>

<style scoped="scoped">
@import "../../css/RightMain.css";
</style>
