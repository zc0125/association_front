<template>
	<div v-if="filePage != null">
		<el-form :inline="true" size="small">
			<el-form-item label="文件名称">
				<el-input placeholder="请输入文件名称" prefix-icon="el-icon-search" v-model="fileName" class="input-with-select" width="120px"></el-input>
			</el-form-item>
			<el-form-item label="文件类型">
				<el-select v-model="fileTypeId" placeholder="请选择文件类型">
					<el-option label="所有" value=""></el-option>
					<el-option v-for="fileType in fileTypeList" :key="fileType.id" :label="fileType.type" :value="fileType.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item><el-button type="primary" @click="find" icon="el-icon-search">查询</el-button></el-form-item>
			<el-button type="success" icon="el-icon-plus" @click="addPage()" size="small" class="add-button">添加</el-button>
		</el-form>
		<el-table :data="fileData" stripe style="width:100%" :height="420" border >
			<el-table-column prop="id" label="id" width="70"></el-table-column>
			<el-table-column prop="fileName" label="文件名称" ></el-table-column>
			<!-- <el-table-column prop="filePath" label="文件路径" ></el-table-column> -->
			<el-table-column prop="fileType.type" label="文件类型" ></el-table-column>
			<el-table-column prop="passage.title" label="图片关联文章"  ></el-table-column>
			<el-table-column prop="activity.activityName" label="图片关联活动"  ></el-table-column>
			<el-table-column fixed="right" label="操作" min-width="150">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" @click="editPage(scope.row)" size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteFile(scope.row)" size="mini">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
		class="page"
			background
			layout="total, sizes, prev, pager, next"
			:current-page.sync="currentPage"
			:total="filePage.total"
			@size-change="getPageSize"
			@current-change="refreshFilePage"
			:page-size="pageSize"
			:page-sizes="pageSizes"
		></el-pagination>
	</div>
</template>

<script>
const OK = 200;
export default {
	data() {
		return {
			filePage: {},
			fileData: [],
			fileTypeId:"",
			fileName: null,
			fileTypeList: [],
			currentPage: 1,
			pageSizes:[5,10,15,20],
            pageSize: 5
		};
	},
	methods: {
		getPageSize:function(val){
			this.pageSize=val;
			this.getFilePage(this.currentPage, this.pageSize);
		},
		getFilePage: function(pageNum, pageSize) {
			// this.$message.success("pagenum:"+pageNum+"####"+"pageSize:"+pageSize);
			this.$axios
				.get('/api/files', {
					params: {
						fileTypeId: this.fileTypeId,
						fileName:this.fileName,
						pageNum: pageNum,
						pageSize: pageSize
					}
				})
				.then(res => {
					if (res.data.code == OK) {
						this.filePage = res.data.data;
						this.fileData = this.filePage.list;
						this.pages = this.filePage.pages;
					} else {
						this.$message.error(res.data.data);
					}
				});
		},
		getFileTypeList: function() {
			this.$axios.get('/api/fileTypes').then(res => {
				if (res.data.code == OK) {
					this.fileTypeList = res.data.data;
				} else {
					this.$message.error(res.data.data);
				}
			});
		},
		editPage: function(row) {
			var id = row.id;
			console.log(id);
			this.$router.push({ name: 'EditFile', query: { id: id } });
		},
		addPage: function() {
			this.$router.push({ name: 'AddFile' });
		},
		deleteDao: function(fileId) {
			this.$axios.delete('/api/files/' + fileId).then(res => {
				if (res.data.code == OK) {
					this.$message.success('删除成功');
				} else {
					this.$message.error(res.data.data);
				}
			});
		},
		deleteFile: function(row) {
			var fileId = row.id;
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteDao(fileId);
				this.getFilePage(this.currentPage, this.pageSize);
			});
		},
		find: function() {
			this.getFilePage(this.currentPage, this.pageSize);
		},
		refreshFilePage: function() {
			var fileTypeId = this.$route.query.fileTypeId;
			this.getFilePage(this.currentPage, this.pageSize);
		}
	},
	created() {
		var fileTypeId = this.fileTypeId;
		this.getFilePage(this.currentPage, this.pageSize);
		this.getFileTypeList();
	}
};
</script>

<style scoped="scoped">
@import "../../css/common.css";
.add-button{
	float: right;
}
</style>
