<template>
  <div class="myApp">
    <el-form>
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-upload
        class="avatar-uploader"
        action="http://localhost:3001/api/frontend/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <form v-show="show">
      <div class="form-group">
        <label>用户名:</label>
        <input type="text" class="form-control" v-model="account">
      </div>
      <div class="form-group">
        <label>密码:</label>
        <input type="password" class="form-control" v-model="password">
      </div>
      <button type="button" class="btn btn-primary" @click="SignUp()">注册</button>
      <button type="button" class="btn btn-primary" @click="show=false" style="float:right">取消</button>
    </form>
  </div>
</template>

<script>
import api from "@/fetch/api";
export default {
  name: "myApp",
  data() {
    return {
      account: "",
      password: "",
      show: false,
      imgsrc: "",
      name: "",
      form: {
        name: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: ""
    };
  },
  created() {
    this.account = "";
    this.password = "";
    this.show = false;
  },
  methods: {
         handleAvatarSuccess(res, file) {
      this.imageUrl=res.url
      },
        handlePictureCardPreview(file) {
        this.imageUrl = file.url;
        this.dialogVisible = true;
      },
    beforeAvatarUpload(file) {
    
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    onSubmit() {
      let r = confirm("确定保存吗？");
      if (r) {
        let file = this.$refs.uploadImg.files[0];
        let formData = new FormData();
        formData.append("file", this.imageUrl);
        formData.append("name", this.form.name);
        // formData.append("signature", this.signature);
        // formData.append("breif", this.breif);

        console.log(this.imageUrl);
        console.log(this.form.name);

        api.changeInfo(formData).then(
          res => {
            switch (res.code) {
              case "200":
                alert("信息修改成功");
                  sessionStorage.removeItem("username");

                break;
              case "400":
                console.log("服务器开小差了，信息修改失败");
                break;
            }
          },
          err => {
            console.log("信息修改失败");
          }
        );
      }
    },
    activePreview() {
      this.$refs.uploadImg.click();
    },
    previewImg() {
      let file = this.$refs.uploadImg.files[0], // 获取第一张图片
        imageType = /^image\//, //校验图片的正则表达式
        reader = "",
        that = this; //存储this

      // 文件是否为图片
      if (!imageType.test(file.type)) {
        alert("请选择图片！");
        return;
      }
      // 判断是否支持FileReader
      if (window.FileReader) {
        reader = new FileReader();
      } else {
        alert("您的浏览器不支持图片预览功能，如需该功能请升级您的浏览器！");
        return;
      }
      //将图片读取为URL（base64）方便前端展示
      reader.readAsDataURL(file);
      // 读取完成
      reader.onload = function(event) {
        // 图片路径设置为读取的图片
        that.imgsrc = event.target.result;
        // console.log(that.headImg);
      };
    },
    SignUp() {},
    sumbit() {
      //账号名和密码是否合规验证（待补充）
      api.logins(this.account, this.password).then(
        res => {
          console.log(res);
          switch (res.code) {
            case "200":
              this.$store.state.userid = res.data[0].id;
              this.$store.state.username = res.data[0].name;
              this.name = res.data[0].name;
              this.imgsrc = res.data[0].imgsrc;
              //如果一开始img不存在，那么就显示默认图片
              if (!this.imgsrc) {
                this.imgsrc = "/static/img/myImg.jpg";
              }
              //将服务器返回的token放入store中
              sessionStorage.setItem("username", this.name);
              this.$store.commit("logins");
              break;
            case "401":
              this.err = true;
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>