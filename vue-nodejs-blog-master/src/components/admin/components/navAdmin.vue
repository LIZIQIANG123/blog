<template>
    <div class="nav">
       
        <ul>
             <h1>后台管理系统</h1>
            <router-link to="/admin/"><li>文章管理</li></router-link>
           
            <router-link to="/admin/Href"><li>链接管理</li></router-link>
            <router-link to="/admin/TagList"><li>标签管理</li></router-link>
            <router-link to="/admin/Piclist"><li>相册管理</li></router-link>
            <router-link to="/admin/Imglist"><li>相片管理</li></router-link>
            <router-link to="/admin/commentAdmin"><li>评论管理</li></router-link>



             <h1  @click="logout">退出登录</h1>
        </ul>
       
    </div>
</template>

<script>
import api from '@/fetch/api'
import store from '@/store/index'
    export default{
        name:'navAdmin',
        data(){
            return{
                
            }
        },
        methods:{
            logout(){
                let r=confirm('确定要退出吗？');
                if(r){
                    store.commit('logout');
                    this.$router.replace({
                        path: '/login',
                    });
                }
            }
        }
    }
</script>

<style scoped lang="less">
	.nav{
        a{
            color:white;
            text-decoration: none;
        }
        width: 300px;
        height: 100%;
        position: fixed;
        background: #82b8fa;
        color: white;
        h1{
            margin: 50px 0;
            font-size: 25px;
            text-align: center;

        }
        ul{
            text-align: center;
            li{
                height: 60px;
                line-height: 60px;
                font-size: 20px;
            }
            li:hover{
                background:#409eff;
            }
        }
        .logout{
            position: absolute;
            width: 100%;
            bottom: 100px;
            text-align: center;
            color: white;
            font-size: 15px;
            cursor: pointer;
        }
    }
</style>