<template>
    <div class="modify">
        <!-- 修改文章或者发布新文章 -->
        <div class="head">
            <span v-show="id">修改相册</span>
            <span v-show="!id">添加相册</span>
        </div>
        <!-- 文章区域 -->
        <div class="content">
            <div class="title">
                <span>相册名：</span>
                <input type="text" v-model="passage.name">
            </div>
            <p class="save"><button class="saveBtn" @click="savePassage">保存修改</button></p>
        </div>
    </div>
</template>

<script>
    import ueditor from '../components/ueditor'
    import api from '@/fetch/api'
    import util from '@/util/util'

    export default {
        name:'Hrefmodify',
        components:{
            ueditor,
        },
        data(){
            return{
                ue1:'ue1',
                ue2:'ue2',
                passage:{
                    name:'',          
                },
                id:'',
            }
        },
        mounted(){
            this.id=this.$route.params.id
            //如果传入了id,说明是修改文章。没有id，是新文章
            if(this.id){
                this.getOneArticle();  
            }else{
                this.newArticle();
            }
        },
        methods:{
            //获取文章原本内容
            getOneArticle(){
                api.getonepic(this.id).then(res=>{
                    switch (res.code){
                        case '200':
                        console.log(res.data[0]);
                        this.passage=res.data[0];
                        break;
                        case '400':
                        console.log('请求数据错误！');
                        break;
                    }
                },err=>{
                    console.log(err);
                })
            },
            newArticle(){
            },
            savePassage(){
                let r=confirm('确定更改吗？');
                if(r==true){
                    if(this.id){
                    api.updatepic(this.passage).then(res=>{
                        switch(res.code){
                            case '200':
                                alert('保存成功！');
                                this.$router.go(-1);
                                break;
                            case '400':
                                alert('服务器开小差了，保存失败！');
                                break;
                        }
                    },err=>{
                        console.log(err);
                    })
                }else{
                    
                     api.addimg(this.passage).then(res=>{
                        switch(res.code){
                            case '200':
                                alert('保存成功！');
                                this.$router.go(-1);
                                break;
                            case '400':
                                alert('服务器开小差了，保存失败！');
                                break;
                        }
                    },err=>{
                        console.log(err);
                    })
                }
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .modify{
        width: 100%;
        .head{
            height: 80px;
            line-height: 80px;
            background: white;
            padding:0 20px;
            font-size: 25px;
            box-sizing: border-box;
            border-left: 10px solid #353d47;
        }
        .content{
            margin-top: 30px;
            padding: 30px;
            width: 100%;
            min-height:700px;
            box-sizing: border-box;
            background: white;
            input{
                border:1px solid #ccc;
                border-radius: 4px;
                margin-left: 5px;
                padding:6px 12px;
            }
            .title{
                display: flex;
                margin-bottom: 20px;
                input{
                    flex: 1;
                }
            }
            .time{
                margin-bottom: 20px;
            }
            .type{
                margin-bottom: 20px;
                #typeSelect{
                    width: 200px;
                    padding:6px 0;
                    margin:0 5px;
                   text-align:center;
                   text-align-last:center;
                }
            }
            .state{
                margin-bottom: 20px;
                input{
                    width: 0;
                    height: 0;
                }
                label:before{
                    height: 30px;
                    width:50px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    display: inline-block;
                    background: transparent;
                    border: 1px solid #ccc;
                    cursor: pointer;
                    border-radius: 4px;
                }
                input:checked+label:before{
                    background: #5bc0de;
                    color: white;
                }
                label:nth-child(3):before{
                    content: "发表";
                }
                label:nth-child(5):before{
                    content: "草稿";
                }
            }
            .summary{
                margin-bottom: 20px;
                textarea{
                    width: 100%;
                    height: 200px;
                    border-radius: 5px;
                    margin:10px 0;
                    padding: 5px 10px;
                    box-sizing: border-box;
                    font-size: 18px;
                    outline: none;
                }
            }
            .passageContent{
                margin-bottom: 20px;
                textarea{
                    width: 100%;
                    min-height: 300px;
                }
            }
            .save{
                margin:20px 0;
                text-align: right;
                .saveBtn{
                    width: 80px;
                    height: 30px;
                    background: #5cb85c;
                    color: white;
                    border:1px solid #4cae4c;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
            
        }
    }
</style>
