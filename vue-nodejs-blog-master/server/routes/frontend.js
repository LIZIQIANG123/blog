// 引入路由
const router=require('express').Router();
//引入封装好的数据库操作
let db=require('../db.js');

let util=require('../util/util.js');
let upload=util.upload.single('file');
//前台接口

//获取所有文章的接口
router.get('/allArticle',(req,res)=>{
    let sql=db.allArticleFront();
    console.log('前端获取所有文章');
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});
const multer=require('multer')
const uploads=multer({dest:__dirname+'/public/img/'})
console.log('__dirname',__dirname+'public/img/')
router.post('/upload',uploads.single('file'),(req,res)=>{
    console.log(233)
const file=req.file
file.url="http://localhost:3001/routes/public/img/"+file.filename
res.send(file)
})
//登录路由
router.post('/userlogin',(req,res)=>{
  let account=req.body.account;
  //对密码进行加密验证
  let password=util.encrypt(req.body.password);
  console.log(password);
  //生成一个token
  let token=util.encodeJwt();
  let sql=db.userlogin(account,password);
  //生成以一个token
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('用户登录成功！');
      res.send({"code":"200","sucess":"登录成功！","token":token,"data":data});
    }else{
      res.send({"code":"401","error":"账号或者密码错误，登录失败！"});
    }
    },err=>{
    res.send({"code":"401","error":"账号或者密码错误，登录失败！"});
  })
});

//根据id获取单篇文章的接口
router.get('/oneArticle',(req,res)=>{
    let id=req.query.id;
    let sql=db.oneArticleFront(id);
    console.log('获取单篇文章');
    db.Query(sql).then(data=>{
        console.log(data[0])
        res.send({"code":"200","data":data[0]});
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

//获取上一篇文章的接口
router.get('/prePassage',(req,res)=>{
    let id=req.query.id;
    let sql=db.prePsgFront(id);
    console.log('获取上一篇文章');
    db.Query(sql).then(data=>{
        if(data[0]){
            res.send({"code":"200","data":data[0]}); 
        }else{
            res.send({"code":"204"})
        }
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

//获取下一篇文章的接口
router.get('/nextPassage',(req,res)=>{
    let id=req.query.id;
    let sql=db.nextPsgFront(id);
    console.log('获取下一篇文章');
    db.Query(sql).then(data=>{
        if(data[0]){
            res.send({"code":"200","data":data[0]}); 
        }else{
            res.send({"code":"204"})
        }
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

//获取分类文章的接口
router.get('/categoryArticle',(req,res)=>{
    let sql=db.categoryArticleFront(req.query.category);
    console.log('前端获取分类文章');
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"服务器开小差了！"});
    })
})

//获取归档文章的接口
router.get('/sortFile',(req,res)=>{
    let sql=db.sortFileFront();
    console.log('前端获取归档文章');
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"服务器开小差了！"});
    })
})

//获取所有标签的接口
router.get('/tags',(req,res)=>{
    let sql=db.allTagsFront();
    console.log('前端获取所有tags');
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"服务器开小差了！"});
    })
})

//根据标签获取文章接口
router.get('/tagPassages',(req,res)=>{
    let tag=req.query.tag;
    let sql=db.tagPassagesFront(tag);
    console.log('前端根据标签获取文章列表');
    db.Query(sql).then(data=>{
        console.log(data);
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"服务器开小差了！"});
    })
})

// 根据关键字获取相应文章接口（大坑，先做一个最基础最简单的）
router.get('/searchPassages',(req,res)=>{
    let str=req.query.str;
    let sql=db.searchPassageFront(str);
    console.log('前端根据关键字获取文章列表');
    db.Query(sql).then(data=>{
        console.log(data);
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"服务器开小差了！"});
    })
})
//发表评论
router.post('/makeComment',(req,res)=>{
    let comment=req.body;
    let sql=db.makeComment(comment);
    console.log('添加评论');

    db.Query(sql).then(data=>{
        res.send({"code":"200","data":"添加评论成功！"});
    },err=>{
        res.send({"code":"400","err":"服务器炸了"});
    })
})
//获取评论
router.get('/getComments',(req,res)=>{
    console.log(req.query);
    let id=req.query.id;
    let sql=db.getComments(id);
    console.log('获取评论');
    db.Query(sql).then(data=>{
          
           res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400","err":"服务器炸了"});
    })
})


//更改个人信息
router.post('/changeInfo', upload,(req, res)=> {
    //如果有传了图片，才
      let url;
      let params=req.body;
      let id=1;
      console.log(params)
      //如果有图片，那么就获取图片
      if(params.file){
        //拼接文件上传后的路径，由于之前用了express.static，所以这里不用写public，直接写/img/
        url =params.file;
      }

      let sql=db.changeUserInfo(id,params,url);
      db.Query(sql).then(data=>{
        res.send({"code":"200"});
      },err=>{
        console.log(err);
        res.send({"code":"400"});
      });
    
  })
router.get('/getusername',(req,res)=>{
    let sq= db.GetUser(req.query.id);
    db.Query(sq).then(data=>{
     res.send({"code":"200","data":data});
    })
})
module.exports=router;
