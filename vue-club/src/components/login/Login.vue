<template>
  <div>
    <div class="header"> 
      通过以下方式进行登录
    </div>
    <div class="main">
      <el-button @click="goStudenturl" class="login-div">
        <div>
          <img src="static/image/student-img.jpg" width="100%"/>
        </div>
        学生登录
      </el-button>
      <el-button @click="goAdminUrl" class="login-div">
        <div>
          <img src="static/image/user-img.jpg" width="100%"/>
        </div>
        社团管理员登录
      </el-button>
      <el-button @click="goAdminUrl" class="login-div">
        <div>
          <img src="static/image/admin-img.jpg" width="100%"/>
        </div>
        管理员登录
      </el-button>
    </div>
    <div class="go-back">
      <el-button type="primary" @click="goBack" class="">
        取消登录
      </el-button>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      adminAccessUrl: "http://127.0.0.1:8080/login",
    };
  },
  methods: {
    getAdminUrl: function () {
      this.$axios.get("/api/system/adminUrl").then((res) => {
        if (res.data.code == OK) {
          this.adminAccessUrl = res.data.data;
        }
      });
    },
    goAdminUrl: function () {
      // window.location.href = this.adminAccessUrl
      window.open(this.adminAccessUrl, "_blank");
    },
    goStudenturl:function(){
      this.$router.push({path:'/user/login'})
    },
    goBack: function(){
      this.$router.back(-1);
    }
  },
  created: function () {
    this.getAdminUrl();
  },
  mounted: function () {},
};
</script>

<style scoped="scoped">
.header{
  height: 70px;
  width:100%;
  text-align: center;
  color: white;
  line-height: 70px;
  font-size: 30px;
  background-color: #9a0e14;
}
.main{
  text-align: center;
  padding: 100px 0;
}
.login-div{
  height: 200px;
  width: 200px;
  margin: 0 20px;
}
.go-back{
  text-align: center;
}
</style>
