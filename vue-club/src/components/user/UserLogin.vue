<template>
	<el-form :model="student" status-icon ref="student" label-width="100px" class="userForm">
		<el-form-item label="账号"><el-input v-model="student.num" placeholder="请输入你的学号/邮箱/手机"></el-input></el-form-item>
		<el-form-item label="密码" prop="pass"><el-input placeholder="请输入输入密码" type="password" v-model="student.password"></el-input></el-form-item>
		<el-form-item label="验证码">
			<el-input v-model="student.code" placeholder="请输入验证码" autocomplete="off"></el-input>
			<img :src="captchaUrl" alt="验证码" @click="refreshCode" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="login">登录</el-button>
            <el-button @click="register">注册</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
const OK = 200;
export default {
	data() {
		return {
			student: {
				num:'',
				password:"",
				code:"",
			},
			code: '',
			token: '',
			captchaUrl: ''
		};
	},
	methods: {
		login: function() {
            let _this = this;
			this.$axios
				.post('/api/students/login', this.student)
				.then(res => {
                    console.log(res.data)
					if (res.data.code == OK) {
						_this.$message({
							message: '登录成功',
							type: 'success',
							duration:1000,
						});
                        _this.token = res.data.data;
						_this.$cookies.set('stutoken', res.data.data, 60 * 30);
						this.$router.push({ name: 'Home' });
					} else {
						_this.$message.error(res.data.message);
						_this.refreshCode();
					}
				}).catch(function (error) {
				    _this.$message.error("error");
				  });
		},
        register:function(){
            this.$router.push({path:'/user/register'});
        },
		refreshCode: function() {
			this.captchaUrl = '/api/users/getKaptcha?time=' + new Date().getTime();
			console.log('更新' + this.captchaUrl);
		},
		resetForm: function() {},
		tryToAminPage: function() {
			var token = this.$cookies.get('stutoken');
			if (token != null) this.$router.push({ name: 'Home' });
		},
        judgeToken:function(){
            var token = this.$cookies.get('stutoken');
			if (token != null)return true;
            return false
        },
		test: function() {
			(this.student.email = 'test@163.com'), (this.student.password = '123456');
		}
	},
	created() {
		// this.tryToAminPage();
		// this.test();
		this.refreshCode();
	}
};
</script>

<style scoped="scoped">
.userForm {
	width: 550px;
	margin: 0 auto;
	padding: 80px;
}
</style>
