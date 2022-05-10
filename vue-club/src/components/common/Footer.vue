<template>
<!-- 底部 -->
	<div class="footer-wrap">
		<div class="footer">
			<p class="introduce">欢迎访问社团管理系统</p>
			<!-- <p class="introduce">计科一班张成毕设项目</p> -->
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style scoped="scoped">
	.footer-wrap {
	background-color:#9a0e14 ;
    position: fixed;
	padding: 10px;
    left: 0;
    right: 0;
    bottom:0;
    height: 40px;
	}

	.footer-wrap .footer {
		width: 75%;
		margin: 0 auto;
		/* height: 70px; */
	}
  .introduce{
    margin: 10px;
  }
	.footer-wrap .footer p{
		line-height: 16px;
	}

	@media screen and (max-width: 600px){
	  .footer-wrap {
	  	padding: 2px 15px;
	  }
	}
</style>
