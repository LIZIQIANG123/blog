<template>
  <div class="allArticles">
    <div class="head">
      <select id="typeSelect" v-model="category" @change="getdata()">
        <option value>所有相册</option>
        <option v-for="(item,index) in pic" :key="index" :value="item.key">{{item.name}}</option>
      </select>
    </div>
    <div class="content">
      <button class="new" @click="goNew">添加新图片</button>
      <table width="100%">
        <thead>
          <tr>
            <th>图片名</th>
            <th>相册名</th>
            <th>图片</th>
            <th>添加时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(passage,index) in passages" :key="index">
            <td>{{passage.name}}</td>
            <td>{{passage.picname}}</td>
            <td>
              <img :src="passage.url" style="width:100%">
            </td>
            <td>{{passage.creattime}}</td>
            <td>
              <button class="modify" @click="goModify(passage)">修改</button>
              <button class="del" @click="delArticle(passage,index)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "@/fetch/api";
export default {
  name: "allArticles",
  data() {
    return {
      publish: true,
      category: "",
      passages: [],
      pic: []
    };
  },
  mounted() {
    this.getPic();
    this.GetArticle();
  },
  methods: {
    getPic() {
      api.getpic().then(x => {
        var c = x.data;
        c = x.data.map(y => {
        
          this.pic.push({
            key: y.id,
            name: y.name
          });
        });
          console.log('123',this.pic)
      });
    },
    getdata() {
      this.GetArticle(this.category);
    },
    parseTags() {
      let reg = /<img src/g;
      this.passages.forEach(element => {
        element.tags = element.tags.split(",");
        element.summary = element.summary.replace(reg, `<img data-src`);
      });
    },
    GetArticle(params) {
      this.passages = [];
      if (!params) {
        api.allimg().then(
          res => {
            console.log(res.data);
            switch (res.code) {
              case "200":
                console.log("获取文章成功！");
                this.passages = res.data;
                this.parseTags();
                break;
              case "400":
                console.log("服务器开小差了！");
                break;
            }
          },
          err => {
            console.log(err);
          }
        );
      } else {
        console.log(this.category)
        api.getimgBypicid(this.category).then(
          res => {
            switch (res.code) {
              case "200":
                console.log("获取文章成功！");
                console.log(res.data);
                this.passages = res.data;
                this.parseTags();
                break;
              case "400":
                console.log("服务器开小差了！");
                break;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    goModify(passage) {
      let id = passage.id;
      this.$router.push({ path: "Img/modify/"+id});
    },
    goNew() {
      this.$router.push({ path: "Img/modify/" });
    },
    delArticle(passage, index) {
      let r = confirm("确认删除该篇文章吗？");
      if (r == true) {
        let id = passage.id;
        api.delimg(id).then(
          res => {
            switch (res.code) {
              case "200":
                this.passages.splice(index, 1);
                alert("删除成功！");
                break;
              case "400":
                alert("服务器开小差了，删除失败");
                break;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  }
};
</script>


<style lang="less" scoped>
#typeSelect {
  width: 200px;
  padding: 6px 0;
  margin: 0 5px;
  text-align: center;
  text-align-last: center;
}

.allArticles {
  width: 100%;
  min-height: 100%;
  .head {
    height: 80px;
    line-height: 80px;
    background: white;
    padding: 0 20px;
    font-size: 25px;
    box-sizing: border-box;
    border-left: 10px solid #353d47;
  }
  .content {
    min-height: 700px;
    margin-top: 30px;
    padding: 30px 30px;
    box-sizing: border-box;
    background: white;
    text-align: right;
    overflow: hidden;

    table {
      margin: 20px auto;
      text-align: center;
      width: 100%;

      tr {
        th,
        td {
          border: 1px solid #ddd;
          padding: 10px;
          vertical-align: middle;
        }
        //标题
        th:nth-child(1) {
          width: 40%;
        }
        //发布时间
        th:nth-child(2) {
          width: 15%;
        }
        //标签
        th:nth-child(3) {
          width: 15%;
        }
        //操作
        th:nth-child(4) {
          width: 30%;
        }

        td {
          .tag {
            display: inline-block;
            margin-right: 10px;
          }
          button {
            width: 65px;
            height: 30px;
            margin: 0 5px;
            border: 1px solid white;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            outline: none;
          }
          .publish {
            background: #5cb85c;
          }
          .save {
            background: lightgrey;
          }
          .modify {
            background: #5bc0de;
          }
          .del {
            background: #d9534f;
          }
        }
      }
      tbody tr:hover {
        background: #f0f0f0;
      }
    }
  }
}
</style>
