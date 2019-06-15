//后端api文件

// 引入路由
const router=require('express').Router();
//引入封装好的数据库操作
let db=require('../db.js');

let util=require('../util/util.js');
let upload=util.upload.single('file');
//测试路由
router.get('/test',(req,res)=>{
    db.Query('select * from article').then(data=>{
        console.log(data);
        res.send('测试路由');
    },err=>{
        console.log(err);
    });
})


//根据文章分类获取文章列表(完成)
router.get('/getCategoryArticle',(req,res)=>{
    //将中文参数解码
    let param=decodeURIComponent(req.query.category);
    let sql=db.queryCategory(param);
    db.Query(sql).then(data=>{
        //如果成功，发送code200,加上data
        res.send({"code":"200","data":data});
        // console.log('根据文章分类获取文章列表');
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    });

})

//根据文章分类获取文章列表(完成)
router.get('/allArticle',(req,res)=>{
    //将中文参数解码
    let param=decodeURIComponent(req.query.category);
    let sql=db.allArticle(param);
    db.Query(sql).then(data=>{
        //如果成功，发送code200,加上data
        res.send({"code":"200","data":data});
        // console.log('根据文章分类获取文章列表');
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    });

})


//获取单篇文章内容
router.get('/getOneArticle',(req,res)=>{
    //id是数字，不用解码
    let param=req.query.articleId;
    let sql=db.queryOneArticle(param);

    db.Query(sql).then(data=>{
        console.log(data);
        res.send({"code":"200","data":data});
        console.log('完成');
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

//文章存储接口（包括了新建文章和修改文章）
router.post('/saveArticle',(req,res)=>{
    let id=req.body.id;
    let passage=req.body.passage;
    // 如果id存在，那么执行更新操作
    if(id){
        console.log('id存在，执行更新操作！')
        let sql=db.updateArticle(passage);
        db.Query(sql).then(data=>{
            res.send({"code":"200","data":"更新成功！"});
        },err=>{
            res.send({"code":"400"});
            console.log(err);
        })
    }
    // 如果req.body的id不存在，说明是一篇新的文章,执行插入操作;
    else{
        let sql=db.createArticle(passage);
        db.Query(sql).then(data=>{
            res.send({"code":"200","data":data});
        },err=>{
            res.send({"code":"400"});
            console.log(err);
        })
        console.log('id不存在，执行插入操作！')
    }
})



//文章删除接口
router.post('/delArticle',(req,res)=>{
    let id=req.body.id;
    let sql=db.delArticle(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/delpic',(req,res)=>{
    let id=req.body.id;
    let sql=db.delpic(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
//获取所有文章评论接口
router.get('/allComments',(req,res)=>{
    let sql=db.getAllComments();
     db.Query(sql).then(data=>{
         console.log(data);
         console.log('完成');
         res.send({"code":"200","data":data});
     },err=>{
         res.send({"code":"400"});
         console.log(err);
     })
})
router.get('/allimg',(req,res)=>{
    let sql=db.allimg();
     db.Query(sql).then(data=>{
         console.log(data);
         console.log('完成');
         res.send({"code":"200","data":data});
     },err=>{
         res.send({"code":"400"});
         console.log(err);
     })
})

//文章评论删除接口
router.post('/delComment',(req,res)=>{
    let id=req.body.id;
    let sql=db.delComment(id);
    console.log(sql);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

// 文章状态改变接口
router.post('/changeState',(req,res)=>{
    let id=req.body.id;
    let state=req.body.state;
    let sql=db.changeState(id,state);

    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})


//保存图片
router.post('/saveimg',upload,(req,res)=>{
    let params=req.body;
    if(req.file){
        //拼接文件上传后的路径，由于之前用了express.static，所以这里不用写public，直接写/img/
        params.url ='http://localhost:3001/img/user/'+req.file.filename;
      }
    // 如果req.body的id不存在，说明是一篇新的文章,执行插入操作;  
        let sql=db.addimg(params);
        db.Query(sql).then(data=>{
            res.send({"code":"200","data":'success'});
        },err=>{
            res.send({"code":"400"});
            console.log(err);
        })
})


//保存图片
router.post('/updateimg',upload,(req,res)=>{
    console.log('updateimg',req.body);
    let params=req.body;
    if(req.file){
        //拼接文件上传后的路径，由于之前用了express.static，所以这里不用写public，直接写/img/
        params.url ='http://localhost:3001/img/user/'+req.file.filename;
      }
    // 如果req.body的id不存在，说明是一篇新的文章,执行插入操作;  
        let sql=db.updateimg(params);
        db.Query(sql).then(data=>{
            res.send({"code":"200","data":'success'});
        },err=>{
            res.send({"code":"400"});
            console.log(err);
        })
})

//删除链接
router.post('/delhref',(req,res)=>{
    let id=req.body.id;
    console.log(id)
    let sql=db.delhref(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
//删除图片
router.post('/delimg',(req,res)=>{
    let id=req.body.id;
    let sql=db.delimg(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
//删除标签
router.post('/deltag',(req,res)=>{
    let id=req.body.param;
    let sql=db.deltag(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/gettag',(req,res)=>{
    let sql=db.gettag();
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/getonetag',(req,res)=>{
    console.log(req.body)
    let sql=db.getOnetag(req.body.id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

router.post('/getoneimg',(req,res)=>{

    let sql=db.getoneimg(req.body.id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/getonepic',(req,res)=>{
    console.log(req.body)
    let sql=db.getOnepic(req.body.id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
//删除标签
router.post('/addtag',(req,res)=>{
    let id=req.body;
    let sql=db.addtag(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":"success"});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

//删除标签
router.post('/addpic',(req,res)=>{
    let id=req.body.id;
    let sql=db.addpic(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":"success"});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

//获取某个相册的图片
router.post('/getimgBypicid',(req,res)=>{
    let id=req.body.id;
    let sql=db.imgBypicid(id);
    console.log(sql)
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

router.post('/allpic',(req,res)=>{
    let sql=db.allpic();
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})


router.post('/addtag',(req,res)=>{
    let id=req.body.id;
    let sql=db.addtag(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":"success"});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})

router.post('/addHef',(req,res)=>{
    let id=req.body.id;
    let sql=db.addHef(id);
    console.log(sql)
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":"success"});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/getHef',(req,res)=>{
    let sql=db.getHef();
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/getOneHef',(req,res)=>{
    let id=req.body.id;
    let sql=db.getOneHef(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/updateHref',(req,res)=>{
    let id=req.body.id;
    let sql=db.updateHref(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/updatepic',(req,res)=>{
    let id=req.body.param;
    let sql=db.updatepic(id);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
router.post('/updatetag',(req,res)=>{
    let id=req.body.param;
    let sql=db.updatetag(id);
    console.log(id)
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":'修改成功'});
    },err=>{
        res.send({"code":"400"});
        console.log(err);
    })
})
//导出路由
module.exports=router
