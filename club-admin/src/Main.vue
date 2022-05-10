<template>
	<el-container direction="vertical"  v-if="roleId == 0" class="body-main">
		<v-header class="header"></v-header>
		<el-container class="body-nav">
			<left-nav class="left-nav"></left-nav>
			<div class="main-div">
				<router-view class="main"/>
			</div>
				
		</el-container>
		<!-- <v-footer class="footer"></v-footer> -->
	</el-container>
</template>

<script>
import LeftNav from '@/components/common/LeftNav';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const OK = 200
export default {
	name: 'Main',
	data() {
		return {
			roleId:1
		};
	},
	components: {
		'left-nav':LeftNav,
		'v-header': Header,
		'v-footer': Footer
	},
	methods: {
		getUser: function () {
			var token = this.$cookies.get("token");
      this.$axios
        .get("/api/users/getUser", {
          params: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.code == OK) {
            this.userId = res.data.data.id;
			this.roleId = res.data.data.roleId;
			if(this.roleId !=0 ){
				alert("权限不足！")
				this.$router.push({ name: 'HomeUser' });
			}
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
	},
	created: function() {
		var token = this.$cookies.get("token");
    	this.getUser(token);

	}
};
</script>

<style>


/* .header{
	width: 100%;
	height: 70px;
} */
.body-main{
	width: 100%;
	height: 720px;	
}
.body-nav{
	width: 100%;
	height: 100%;
}
.left-nav{
	width: 15%;
	min-width: 200px;
	height: 100%;
}
.main-div {
  	margin-top: 30px;
	margin-left: 2.5%;
  	width: 80%;
	/* padding: 4px 10px; */
	overflow-x: hidden;
	overflow-y: hidden;
}
.main{
	width: 100%;
	max-height: 600px;
}
.footer{
	width: 100%;
	height: 80px;
}


</style>
