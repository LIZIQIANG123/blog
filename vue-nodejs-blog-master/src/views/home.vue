<template>
  <div class="content">
    <el-header
      style="   height: 60px;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 999999999999999;"
    >
      <el-row class="container">
        <el-col :span="24" class="header">
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <router-link to="/index">
                <li>首页</li>
              </router-link>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <router-link to="/tech">
                <li>技术</li>
              </router-link>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <router-link to="/music">
                <li>音乐</li>
              </router-link>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <router-link to="/file">
                <li>归档</li>
              </router-link>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <router-link to="/aboutMe">
                <li>关于</li>
              </router-link>
            </div>
          </el-col>
          <el-col :span="2" class="userinfo">
            <el-dropdown v-show="username">
              <el-button style="background: rgb(79, 191, 243);
    color: #fff;
    border: none;">
                你好：{{username}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="zhuxiao()">注销</el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/myApp" style="color:#606266">
                    <li>个人设置</li>
                  </router-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="el-dropdown-link" style="color:#fff;" v-show="!username">
              <a @click="show=true" style="color:#fff;">
                <li>登录</li>
              </a>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-col>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view v-if="isRouterAlive" v-show="!show"></router-view>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        v-show="show"
      >
        <el-form-item label="账号" prop="account">
          <el-input type="text" v-model="ruleForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import computerNav from "./nav/computerNav";
import mobileNav from "./nav/mobileNav";
import api from "@/fetch/api";

export default {
  name: "Home",
  components: {
    computerNav,
    mobileNav
  },
  data() {
    var accountvalidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var passwordvalidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      show: false,
      ruleForm: {
        account: "",
        password: ""
      },
      rules: {
        account: [{ validator: accountvalidator, trigger: "blur" }],
        password: [{ validator: passwordvalidator, trigger: "blur" }]
      },
      windowWidth: "",
      isRouterAlive: true,
      myInfo: "",
      transitionName: "slide-up",
      username: sessionStorage.getItem("username")
    };
  },

  mounted() {
    console.log(sessionStorage.getItem("username"));
    api.getMyInfo().then(
      res => {
        switch (res.code) {
          case "200":
            console.log("获取信息成功");
            this.myInfo = res.data;
            break;
          case "400":
            console.log("服务器炸了，待会儿再请求吧");
            break;
        }
      },
      err => {
        console.log(err);
      }
    );
  },
  methods: {
    zhuxiao() {
      console.log(33);
      sessionStorage.removeItem("username");

      this.username = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.logins(this.ruleForm.account, this.ruleForm.password).then(
            res => {
              console.log(res);
              switch (res.code) {
                case "200":
                  this.username = res.data[0].name;
                  this.$store.state.userid = res.data[0].id;
                  this.$store.state.username = res.data[0].name;
                  sessionStorage.setItem("username", res.data[0].name);
                  this.name = sessionStorage.getItem("usernmae");
                  this.show = false;
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
<style scoped>
a {
  color: #fff;
  text-decoration: none;
}
.el-col {
  text-align: center;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

<style scoped lang="less">
.container {
  .header {
    height: 60px;
    line-height: 60px;
    background:rgb(79, 191, 243);
    color: #fff;
    .userinfo {
      text-align: right;
      float: right;
      margin-right: 90px;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      /*侧边菜单*/
      .el-menu {
        height: 100%;
        background-color: #545c64;
        /*选中列*/
        .el-menu-item {
          background-color: #545c64;
        }
        .el-submenu__title {
          i {
            color: #fff;
          }
        }
      }
      .el-menu:first-child {
        overflow-y: auto !important;
      }
      .el-menu-collapsed li:hover {
        background-color: #434a50;
      }
      /*当前选中菜单*/
      .is-opened {
        color: #fff;
        background-color: #fff;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
      background-color: #d3d7d4;
      .breadcrumb-container {
        display: none;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        box-sizing: border-box;
      }
    }
  }
}
</style>