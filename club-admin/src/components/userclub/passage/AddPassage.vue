<template>
  <el-form class="main" size="small" :model="passage" label-width="100px">
    <!-- <el-button type="primary" @click="goBack" class="back">返回</el-button> -->
    <el-form-item label="新闻标题"
      ><el-input v-model="passage.title"></el-input
    ></el-form-item>
    <quill-editor
      v-model="passage.content"
      :options="editorOption"
    ></quill-editor>
    <el-form-item label="新闻类型" prop="passageTypeId">
      <el-select v-model="passage.passageTypeId" placeholder="请选择新闻类型">
        <el-option
          v-for="newsType in newsTypeList"
          :key="newsType.id"
          :label="newsType.type"
          :value="newsType.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="社团名称" prop="clubId">
      <el-select v-model="passage.clubId" placeholder="请选择社团名称">
        <el-option
          v-for="club in clubList"
          :key="club.num"
          :label="club.name"
          :value="club.num"
        ></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item>
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="'/api/files/uploadImg?relativePath=' + relativePath"
        :auto-upload="false"
        :on-change="handleChange"
        :file-list="fileList"
        :on-remove="beforeRemove"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <div slot="tip" class="el-upload__tip">
          选择要上传的图片，且不超过1M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item
      ><el-switch
        v-model="isCarousel"
        active-text="设为轮播图"
        :change="changeFileType()"
      ></el-switch
    ></el-form-item>

    <!-- <input type="hidden" v-model="passage.fileId"> -->
    
    <el-form-item>
      <el-button type="primary" @click="add">添加</el-button>
      <el-button @click="goBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const OK = 200;

export default {
  data() {
    return {
      passage: {
        id: "",
        title: "",
        content: "",
        passageTypeId: "",
        publishTime: "",
        clickNum: "",
        clubId: "",
        userId: "",
      },
      userId:"",
      clubId:"",
      passageId: 0,
      clubList:[],
      newsTypeList: [],
      editorOption: {
        placeholder: "输入新闻内容：",
        // 编辑器的配置
        // something config
        theme: "snow",
      },
      imageUrl: "",
      fileList: [],
      file: {},
      isCarousel: false,
      relativePath: "/images/passage/",
    };
  },
  methods: {
    add: function () {
      this.addNews();
    },
    addNews: function () {
      this.passage.userId = this.userId;
      this.passage.clubId = this.clubId;
      this.$axios
        .post("/api/passages", this.passage)
        .then((res) => {
          if (res.data.code == OK) {
            this.passageId = res.data.data;
            this.file.passageId = this.passageId;
            // console.log("文件id：" + this.passageId);
            this.$refs.upload.submit();
            setTimeout(() => {
              this.$message.success("添加新闻成功");
            }, 10);
            setTimeout(() => {
              this.$router.push({ name: "PassageListUser" });
            }, 1000);
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch(function (error) {
          this.$message.error(error);
        });
    },
    saveFile: function () {
      this.$axios
        .post("/api/files/passage", this.file)
        .then((res) => {
          if (res.data.code == OK) {
            this.$message.success("上传文件成功");
            // this.$router.push({ name: 'PassageList' });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch(function (error) {
          this.$message.error(error);
        });
    },
    getUser: function(token) {
			this.$axios
				.get('/api/users/getUser', {
					params: {
						token: token
					}
				})
				.then(res => {
					if (res.data.code == OK) {
						this.userId = res.data.data.id;
            this.clubId = res.data.data.clubId;
					} else {
						this.$message.error(res.data.message);
					}
				});
		},
    getClubList: function () {
      this.$axios.get("/api/clubs/list").then((res) => {
        if (res.data.code == OK) {
          this.clubList = res.data.data;
        } else {
          this.$layer.alert(res.data.data);
        }
      });
    },
    getNewsTypeList: function () {
      this.$axios
        .get("/api/passageTypes")
        .then((res) => {
          if (res.data.code == OK) {
            this.newsTypeList = res.data.data;
          } else {
            this.$message.error(res.data.data);
          }
        })
        .catch(function (error) {
          this.$message.error(error);
        });
    },
    handleChange: function (file, fileList) {
      var response = file.response;
      console.log(response);
      if (response != null && response.code == OK) {
        console.log(response.data);
        this.file.filePath = response.data;
        this.file.fileName = this.getFileName(this.file.filePath);
        console.log(this.file.fileName);
        this.file.passageId = this.passageId;
        console.log(this.file);
        this.$message.success("上传文件成功");
        this.saveFile();
      }
      this.fileList = fileList.slice(-3);
    },
    getFileName: function (filePath) {
      var fileName = null;
      if (filePath != null) {
        if (filePath.indexOf("/") != -1) {
          fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        }
      }
      return fileName;
    },
    beforeRemove: function (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    changeFileType: function () {
      if (this.isCarousel) {
        this.file.fileTypeId = 4;
      } else {
        this.file.fileTypeId = 5;
      }
      console.log("change fileType");
    },
    goBack: function () {
      this.$router.back(-1);
    },
  },
  created() {
    this.getNewsTypeList();
    // this.getClubList();
    var token = this.$cookies.get('token');
		this.getUser(token);
  },
  watch: {
    $route(to, from) {
      this.getNewsTypeList();
      // this.getClubList();
    var token = this.$cookies.get('token');
		this.getUser(token);
    },
  },
};
</script>

<style scoped="scoped">
@import "../../../css/RightMain.css";
</style>
