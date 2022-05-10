<template>
	<el-form :model="user" status-icon ref="user" label-width="100px" class="userForm" size="small">
		<el-form-item label="学号"><el-input v-model="student.num" placeholder="请输入学号"></el-input></el-form-item>
		<el-form-item label="姓名"><el-input v-model="student.name" placeholder="请输入姓名"></el-input></el-form-item>
		<el-form-item label="性别">
			<el-radio v-model="radioSex" label="0">保密</el-radio>
			<el-radio v-model="radioSex" label="1">男</el-radio>
			<el-radio v-model="radioSex" label="2">女</el-radio>
	  	</el-form-item>
		<el-form-item label="年龄"><el-input v-model="student.age" placeholder="请输入年龄"></el-input></el-form-item>
		<el-form-item label="学院"><el-input v-model="student.institute" placeholder="请输入学院名称"></el-input></el-form-item>
		<el-form-item label="邮箱"><el-input v-model="student.email" placeholder="请输入邮箱" @blur="sendEmail"></el-input></el-form-item>
		<el-form-item label="电话"><el-input v-model="student.phone" placeholder="请输入手机号"></el-input></el-form-item>
		<el-form-item label="密码"><el-input v-model="student.password" placeholder="请输入密码" type="password"></el-input></el-form-item>
		<el-form-item label="确认密码"><el-input v-model="password" placeholder="请确认密码" type="password"  @blur="rePassword"></el-input></el-form-item>
		<el-form-item>
			<el-button type="primary" @click="register">注册</el-button>
            <el-button @click="$router.back(-1);">返回</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
const OK = 200;
export default {
	data() {
		return {
			student: {
				num:"",
				name:"",
				sex:"",
				age:"",
				institute:"",
				email:"",
                phone:"",
				password:"",
			},
			radioSex:'0',
			password:'',
		};
	},
	methods: {
		register: function() {
			this.student.sex = parseInt(this.radioSex);
			this.$axios
				.post('/api/students/register', this.student)
				.then(res => {
					// this.$layer.msg(res.data);
					console.log(res.data);
					if (res.data.code == OK) {
						this.$message.success('注册成功');
						this.$router.push({ name: 'UserLogin' });
					} else {
						this.$message.error(res.data.message);
					}
				})
				.catch(function (error) {
				    this.$message.error(error);
				  });
		},
		sendEmail: function () {
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.student.email != "" && !regEmail.test(this.student.email)) {
        this.$message({
          message: "邮箱格式不正确",
          type: "error",
        });
        // this.student.email = "";
      }
    },
    rePassword: function () {
      if (this.password != this.student.password) {
        this.$message({
          message: "两次密码不一致",
          type: "error",
        });
      }
    },
	},
	created() {

	}
};
</script>

<style scoped="scoped">
.userForm {
	width: 550px;
	margin: 0 auto;
	padding: 30px;
}
</style>
