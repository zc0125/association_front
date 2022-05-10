<template>
  <el-container>
    <el-aside width="30%" style="border-right:2px solid #9a0e14 ">
      <div class="title">
        <h1>我加入的社团</h1>
      </div>
      <el-button
        type="primary"
        plain
        v-for="studentClub in studentClubList"
        :key="studentClub.club.num"
        class="club-button"
      >
        <div>
          {{ studentClub.club.name }}
        </div>
      </el-button>
    </el-aside>
    <el-main width="70%">
      <div>
        <h1>社团列表</h1>
        <br />
        <div v-if="clubPage != null">
          <el-form :inline="true" size="small">
            <el-form-item label="社团名称">
              <el-input
                placeholder="请输入社团名称"
                prefix-icon="el-icon-search"
                v-model="clubName"
                class="input-with-select"
                width="120px"
              ></el-input>
            </el-form-item>
            <el-form-item label="社团类型">
              <el-select v-model="clubTypeId" placeholder="请选择社团类型">
                <el-option label="所有" value=""></el-option>
                <el-option
                  v-for="clubType in clubTypeList"
                  :key="clubType.id"
                  :label="clubType.type"
                  :value="clubType.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find" icon="el-icon-search"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            :data="clubData"
            stripe
            style="width: 100%"
            :height="340"
            border
          >
            <el-table-column
              prop="num"
              label="社团编号"
              :sortable="true"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="社团名称"
              :sortable="true"
			  width="230"
            ></el-table-column>
            <el-table-column
              prop="clubType.type"
              label="社团类型"
              :sortable="true"
			  width="220"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="addclub(scope.row)"
                  size="mini"
                  >申请</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="page"
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="currentPage"
            :total="clubPage.total"
            @current-change="refreshClubPage"
            @size-change="handleSizeChange"
            :page-size="pageSize"
            :page-sizes="pageSizeArray"
          ></el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
const OK = 200;
export default {
  data() {
    return {
      code: "",
      token: "",
      student: {},
      studentClubList: [],
      clubPage: {},
      input: "",
      clubData: [],
      clubTypeList: [],
      clubName: null,
      clubTypeId: null,
      currentPage: 1,
      pageSize: 5,
      pageSizeArray: [5, 10, 15, 20],
    };
  },
  methods: {
    getUser: function () {
      let token = this.$cookies.get("stutoken");
      this.$axios
        .get("/api/students/getUser", {
          params: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.code == OK) {
            this.student = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getClubByNum: function () {
      this.$axios
        .get("/api/students/club", {
          params: {
            userId: this.student.num,
          },
        })
        .then((res) => {
          if (res.data.code == OK) {
            this.studentClubList = res.data.data;
            console.log(this.studentClubList);
          } else {
            this.$message.error("数据获取失败！");
          }
        });
    },
    getClubPage: function (pageNum, pageSize) {
      this.$axios
        .get("/api/clubs/getAll", {
          params: {
            clubTypeId: this.clubTypeId,
            name: this.clubName,
            pageNum: pageNum,
            pageSize: pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === OK) {
            this.clubPage = res.data.data;
            this.clubData = this.clubPage.list;
            this.pages = this.clubPage.pages;
            console.log(this.clubData);
          } else {
            this.$message.error(res.data.data);
          }
        });
    },
	getClubTypeList: function () {
                this.$axios.get('/api/clubTypes').then(res => {
                    if (res.data.code === OK) {
                        this.clubTypeList = res.data.data;
                    } else {
                        this.$message.error(res.data.data);
                    }
                });
            },
	addclub:function(row){
		var num = row.num;
		let data = {
			userId:this.student.num,
			clubId:num
		}
		this.$axios
				.post('/api/userClub/', data)
				.then(res => {
					if (res.data.code == OK) {
						this.$message({
							message: '加入社团成功',
							type: 'success'
						});
						this.getClubPage(this.currentPage, this.pageSize);
					} else {
						this.$message({
							message: res.data.message,
							type: 'error'
						});
					}
				}).catch(function (error) {
                    this.$message.error(error);
                  });
	},
    find: function () {
      this.getClubPage(this.currentPage, this.pageSize);
    },
    refreshClubPage: function (page) {
      this.currentPage = page;
      this.getClubPage(this.currentPage, this.pageSize);
    },
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getClubPage(this.currentPage, this.pageSize);
    },
    judgeToken: function () {
      var token = this.$cookies.get("stutoken");
      if (token != null && token != "") return true;
      return false;
    },
    isLogin: function () {
      if (!this.judgeToken()) {
        this.$message.error("用户未登录，请先登录！");
        this.$router.push({ name: "UserLogin" });
      }
    },
    fush: function () {
      this.isLogin();
      this.getClubPage(this.currentPage, this.pageSize);
	  this.getClubTypeList();
      this.getUser();
      // setTimeout(() => {
      // 	this.getClubByNum();
      // }, 300);
    },
  },
  watch: {
    $route(to, from) {
      this.fush();
    },
    student: function () {
      this.getClubByNum();
    },
  },
  created() {
    this.fush();
  },
};
</script>

<style scoped>
.title {
  line-height: 70px;
}
.club-button {
  width: 80%;
  margin: 5px 0;
}
</style>
