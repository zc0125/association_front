<template>
	<el-menu default-active="1" background-color="#2f4056" text-color="#fff" active-text-color="#5FB878" class="leftNav" :unique-opened="true">
		<el-submenu index="1">
			<template slot="title">
				文章管理
			</template>
			<el-menu-item index="1-1"><router-link :to="{ name: 'PassageListUser' }" tag="div">文章列表</router-link></el-menu-item>
			<el-menu-item index="1-2"><router-link :to="{ name: 'AddPassageUser' }" tag="div">添加文章</router-link></el-menu-item>
		</el-submenu>
		<el-submenu index="2">
			<template slot="title">
				活动管理
			</template>
			<el-menu-item index="2-1"><router-link :to="{ name: 'ActivityListUser' }" tag="div">活动列表</router-link></el-menu-item>
			<el-menu-item index="2-2"><router-link :to="{ name: 'AddActivityUser' }" tag="div">添加活动</router-link></el-menu-item>
		</el-submenu>
		<el-submenu index="3">
			<template slot="title">
				社团管理
			</template>
			<el-menu-item index="3-1"><router-link :to="{ name: 'EditClubUser' }" tag="div">社团信息</router-link></el-menu-item>
			<el-menu-item index="3-2"><router-link :to="{ name: 'StudentListUser' }" tag="div">用户列表</router-link></el-menu-item>
		</el-submenu>
		
		<el-submenu index="4">
			<template slot="title">
				系统管理
			</template>
			<el-menu-item index="4-1"><router-link :to="{ name: 'HomeAdmin' }" tag="div">超级管理员后台</router-link></el-menu-item>
			<el-menu-item index="4-2"><a href="http://localhost:80" target="_blank" tag="div">返回系统前台</a></el-menu-item>
		</el-submenu>
	</el-menu>
</template>

<script>
	const OK = 200
export default {
	data() {
		return {
			activeIndex: '1',
			accessFrontUrl: 'http://localhost:8011/'
		};
	},
	methods: {
		getFronUrl: function() {
			this.$axios.get('/api/system/frontUrl').then(res => {
				if (res.data.code == OK) {
					this.accessFrontUrl = res.data.data;
				}
			});
		}
	},
	created: function() {
		this.getFronUrl();
	}
};
</script>

<style scoped="scoped">
.leftNav {
  background-color:#2f4056 !important;
}
.leftNav .el-menu-item a {
	color: #eee;
	text-decoration: none;
}
.router-link-exact-active.router-link-active {
	font-size: 120%;
	color: #409eff !important;
}
</style>
