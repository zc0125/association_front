<template>
  <div v-if="passagePage != null">
    <el-form :inline="true" size="small">
      <el-form-item label="文章标题">
        <el-input
          placeholder="请输入文章标题"
          prefix-icon="el-icon-search"
          v-model="title"
          class="input-with-select"
          width="120px"
        ></el-input>
      </el-form-item>
      <el-form-item label="新闻类型">
        <el-select v-model="pasageTypeId" placeholder="请选择新闻类型">
          <el-option label="所有" value=""></el-option>
          <el-option
            v-for="newsType in newsTypeList"
            :key="newsType.id"
            :label="newsType.type"
            :value="newsType.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="find" icon="el-icon-search"
          >查询</el-button
        >
      </el-form-item>
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
      :data="passageData"
      :height="420"
      stripe
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="id"
        width="70"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="200"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="passageType.type"
        label="文章类型"
        width="120"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="user.name"
        label="发布者"
        width="120"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="publishTime"
        label="发布时间"
        width="120"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="clickNum"
        label="点击次数"
        width="120"
        :sortable="true"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
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
            @click="deletePassage(scope.row)"
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
      :total="passagePage.total"
      @current-change="refreshPassagePage"
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
      passagePage: {},
      currentPage: 1,
      pageSize: 5,
      pageSizeArray: [5, 10, 15, 20],
      title: null,
      pasageTypeId: null,
      passageData: [],
      search: {},
      newsTypeList: [],
      clubId:"",
      roleId:"",
      userId:"",
    };
  },
  components: {},
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
            this.clubId = res.data.data.clubId;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getPassagePage: function (pageNum, pageSize) {
        let params= {
            "passageTypeId": this.pasageTypeId,
            "clubId":this.clubId,
            "title": this.title,
            "pageNum": pageNum,
            "pageSize": pageSize,
          };
          console.log(params)
      this.$axios
        .get("/api/passages/club", {params})
        .then((res) => {
          if (res != null && res.data.code == OK) {
            this.passagePage = res.data.data;
            this.passageData = this.passagePage.list;
          } else {
            this.$message.error(res.data.data);
          }
        });
    },
    editPage: function (row) {
      var id = row.id;
      console.log(row.id);
      this.$router.push({ name: "EditPassageUser", query: { id: id } });
    },
    addPage: function () {
      this.$router.push({ name: "AddPassageUser" });
    },
    deleteDao: function (passageId) {
      this.$axios.delete("/api/passages/" + passageId).then((res) => {
        if (res.data.code == OK) {
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    deletePassage: function (row) {
      var id = row.id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteDao(id);
        this.getPassagePage(this.currentPage, this.pageSize);
      });
    },
    find: function () {
      this.getPassagePage(this.currentPage, this.pageSize);
    },
    refreshPassagePage: function (currentPage) {
      this.currentPage = currentPage;
      this.getPassagePage(currentPage, this.pageSize);
      debugger;
    },
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.getPassagePage(this.currentPage, pageSize);
      debugger;
    },
    getNewsTypeList: function () {
      this.$axios.get("/api/passageTypes").then((res) => {
        if (res != null && res.data.code == OK) {
          this.newsTypeList = res.data.data;
        } else {
          this.$message.error(res.data.data);
        }
      });
    },
    fush:function(){
        this.getUser();
        this.getNewsTypeList();
        // setTimeout(() => {
        //     this.getPassagePage(this.currentPage, this.pageSize)
        // }, 50);
    }
  },
  mounted() {
    this.fush();
  },
  watch: {
    $route(to, from) {
      this.fush();
    },
    clubId:function(){
      this.getPassagePage(this.currentPage, this.pageSize)
    }
  },
};
</script>
<style scoped="scoped">
.add-button {
  float: right;
}
</style>
