<template>
		<!-- <el-container>
			<el-aside class="letf-nav">
				<left-nav />
			</el-aside>
			<el-container  direction="vertical" class="right-nav">
        		<v-header class="header"/>
				<router-view class="main" />
				<v-footer class="footer"/>
			</el-container>
		</el-container> -->
	<el-container direction="vertical" class="body-main">
		<v-header class="header"></v-header>
		<el-container class="body-nav">
			<left-nav-user class="left-nav"></left-nav-user>
			<div class="main-div">
				<router-view class="main"/>
			</div>
				
		</el-container>
		<!-- <v-footer class="footer"></v-footer> -->
	</el-container>
</template>

<script>
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LeftNavUser from './components/common/LeftNavUser.vue';
export default {
	name: 'Main',
	data() {
		return {
		};
	},
	components: {
		'v-header': Header,
		'v-footer': Footer,
		LeftNavUser	
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
