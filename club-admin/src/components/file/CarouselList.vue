<template>
  <div v-if="filePage != null">
    <el-form :inline="true" size="small">
      <el-form-item label="文件名称">
        <el-input
          placeholder="请输入文件名称"
          prefix-icon="el-icon-search"
          v-model="fileName"
          class="input-with-select"
          width="120px"
        ></el-input>
      </el-form-item>
      <el-form-item
        ><el-button type="primary" @click="find" icon="el-icon-search"
          >查询</el-button
        ></el-form-item
      >
      <el-button
        type="success"
        icon="el-icon-plus"
        @click="addPage()"
        size="small"
        class="add-button"
        >添加</el-button
      >
    </el-form>

    <el-table
      :data="fileData"
      stripe
      style="width: 100%"
      :height="GLOBAL.tableHeight"
      border
    >
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column
        prop="passage.title"
        label="图片关联文章"
      ></el-table-column>
      <el-table-column
        prop="activity.activityName"
        label="图片关联活动"
      ></el-table-column>
      <el-table-column prop="fileName" label="图片名称"></el-table-column>
      <!-- <el-table-column prop="filePath" label="图片路径" ></el-table-column> -->

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
            @click="deleteFile(scope.row)"
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
      :total="filePage.total"
      @current-change="refreshFilePage"
      @size-change="handleSizeChange"
      :page-size="pageSize"
      :page-sizes="pageSizeArray"
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
      fileName: null,
      fileTypeList: [],
      currentPage: 1,
      pageSize: 5,
      pageSizeArray: [5, 10, 15, 20],
    };
  },
  methods: {
    getFilePage: function (typeId, pageNum, pageSize) {
      this.$axios
        .get("/api/files", {
          params: {
            fileTypeId: typeId,
            pageNum: pageNum,
            pageSize: pageSize,
          },
        })
        .then((res) => {
          if (res.data.code == OK) {
            this.filePage = res.data.data;
            this.fileData = this.filePage.list;
            this.pages = this.filePage.pages;
          } else {
            this.$message.error(res.data.data);
          }
        });
    },
    getFileTypeList: function () {
      this.$axios.get("/api/fileTypes").then((res) => {
        if (res.data.code == OK) {
          this.fileTypeList = res.data.data;
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    editPage: function (row) {
      var passageId = row.passageId;
      console.log(passageId);
      this.$router.push({ name: "EditPassage", query: { id: passageId } });
    },
    addPage: function () {
      this.$router.push({ name: "AddPassage" });
    },
    deleteDao: function (fileId) {
      this.$axios.delete("/api/files/" + fileId).then((res) => {
        if (res.data.code == OK) {
          this.$message.success("删除成功");
		  var fileTypeId = this.$route.query.fileTypeId;
      		this.getFilePage(fileTypeId, this.currentPage, this.pageSize);
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    deleteFile: function (row) {
      var fileId = row.id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteDao(fileId);
      });
    },
    find: function () {
      var fileTypeId = this.$route.query.fileTypeId;
      this.getFilePage(fileTypeId, this.currentPage, this.pageSize);
    },
    refreshFilePage: function () {
      var fileTypeId = this.$route.query.fileTypeId;
      this.getFilePage(fileTypeId, this.currentPage, this.pageSize);
    },
	handleSizeChange: function (size) {
      this.pageSize = size;
      this.getFilePage(fileTypeId, this.currentPage, this.pageSize);
    },
  },
  created() {
    var fileTypeId = this.$route.query.fileTypeId;
    this.getFilePage(fileTypeId, this.currentPage, this.pageSize);
    this.getFileTypeList();
  },
};
</script>

<style scoped="scoped">
@import "../../css/common.css";
.add-button {
  float: right;
}
</style>
