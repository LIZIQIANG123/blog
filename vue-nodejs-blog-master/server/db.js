let mysql = require('mysql');

// 创建连接池，效率更高，不需要每次操作数据库都创建连接
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alphabet',
  port: 3306,
  connectionLimit: 50, //允许连接数
  multipleStatements: true, //是否允许执行多条sql语句
  timezone: "08:00" //大坑，必须加这一句，否则时间不对劲
})

//封装数据库sql请求操作，返回的是一个包含对象的数组
let Query = (sql, ...params) => {
  return new Promise(function (resolve, reject) {
    //从连接池中拿一条链接
    pool.getConnection(function (err, connection) {
      if (err) {
        return reject(err);
      }
      connection.query(sql, params, function (error, res) {
        // console.log(res);
        connection.release();
        if (error) {
          return reject(error);
        }
        resolve(res);
      });
    });
  });
};

//用户sql语句

//管理员登录
let login = function (account, password) {
  let sql = `
        select
            *
        from
            user
        where
            user.account='${account}' and  user.password='${password}'
        `;
  return sql;
}
//用户登录
let userlogin = function (account, password) {
  let sql = `
        select
            *
        from
            users
        where
            users.account='${account}' and  users.password='${password}'
        `;
  return sql;
}
//更改个人信息
let changeInfo = function (id, params, url) {
  //这个params里面装的是文字信息
  let sql;
  console.log(url)
  //url存在的话
  if (url) {
    sql = `
            update
                user
            set
                name='${params.name}',
                imgsrc='${url}',
                signature='${params.signature}',
                breif='${params.breif}'
            where
                id='${id}';
            `;
  } else {
    sql = `
            update
                user
            set
                name='${params.name}',
                signature='${params.signature}',
                breif='${params.breif}'
            where
                id='${id}';
            `;
  }
  return sql;
}

//获取个人信息
let getInfo = function () {
  let sql = `
        select
            name,
            imgsrc,
            signature,
            breif
        from
            user;
        `;
  return sql;
}

//前端sql语句

//获取所有文章（完成）
let allArticleFront = function () {
  let sql = `
        select
            article.id,article.title,article.time,article.category,article.tags,article.summary,article.state
        from
            article
        where
            article.state='发表'
        order by
            article.time desc ,article.id desc
        `;
  return sql;
}

// 获取一篇文章
let oneArticleFront = function (id) {
  let sql = `
        select
            *
        from
            article
        where
            article.id='${id}'
        `;

  return sql;
}
//获取前一篇文章
let prePsgFront = function (id) {
  let sql = `
        select
            id
        from
            article
        where
            id < ${id} and article.category=(select category from article where id=${id})
        order by 
            id desc
        limit
            1
        `;
  return sql;
}

let updateimg=function (params) {
 let sql = `
            update
                img
            set
                name='${params.name}',
                url='${params.url}',
                picid='${params.picid}'
            where
                id='${params.id}';
            `;
            return sql
}
//获取后一篇文章
let nextPsgFront = function (id) {
  let sql = `
        select
            id
        from
            article
        where
            id > ${id} and article.category=(select category from article where id=${id})
        limit
            1
        `;
  return sql;
}

//获取分类文章(完成)
let categoryArticleFront = function (param) {
  let sql = `
        select
            *
        from
            article 
        where 
            article.category='${param}' and article.state='发表'
        order by 
            article.time desc ,article.id desc
        `;
  return sql;
}
//获取归档文章信息(完成)
let sortFileFront = function () {
  let sql = `
        select
            article.id,article.title,article.time
        from
            article
        where
            article.state='发表'
        order by
            article.time desc ,article.id desc
        `;
  return sql;
}

//获取所有标签
let allTagsFront = function () {
  let sql = `
        select
            article.tags
        from
            article
        where
            article.state='发表'
        order by
            article.time desc ,article.id desc
        `;
  return sql;
}


//根据标签获取文章列表
let tagPassagesFront = function (tag) {
  let sql = `
        select
            article.id,article.title,article.time,article.category,article.tags,article.summary
        from
            article
        where
            article.state='发表' and article.tags like '%${tag}%'
        `;
  return sql;
}

//根据搜索关键词获取文章列表
let searchPassageFront = function (str) {
  let sql = `
        select
            article.id,article.title,article.time,article.category,article.tags,article.summary
        from
            article
        where
            article.state='发表' and (article.title like '%${str}%'  or article.summary like '%${str}%' or article.content like '%${str}%')
        `;
  return sql;
}


//发表评论
let makeComment = function (comment) {
  let sql = `
        insert into 
            comments (articleId,userid,content) 
        values 
            (${comment.id},'${comment.userid}','${comment.content}');
        `;
  return sql;
}
//获取单篇文章的评论
let getComments = function (id) {
  let sql = `
        select
            comments.time,comments.content,users.name
        from
            comments
        LEFT OUTER JOIN users ON comments.userid= users.id
        where
            articleId=${id}
        order by
            comments.time desc
        `;
  return sql;
}


// 后端sql语句
//获取所有相册
let allpic = function (params) {
  let sql = `
  select pic.* , 
  (select count(id) from img where img.picid = pic.id) as Count
  from pic            `
  return sql
}
let updatepic=function (passage) {
    let sql = `
    update
        pic
    set
    name='${passage.name}'
    where
        id='${passage.id}'
    `;
return sql;
}
//获取相册下的图片
let imgBypicid = function (params) {
  let sql = `
            select 
                a.name as name,a.url,a.creattime,b.name as picname,a.id
            from 
                img as a ,pic as b
            where
                a.picid='${params}' and a.picid=b.id
            `
  return sql
}
let allimg = function (params) {
  let sql = `
  select 
  a.name as name,a.url,a.creattime,b.name as picname,a.id
from
  img as a ,pic as b
where
  a.picid=b.id
            `
  return sql
}
//添加相册
let addpic = function (passage) {
  let sql = `
            insert into
            pic (name)
        values
            ('${passage.name}')
        `;
  return sql
}
//添加相册图片
let addimg = function (passage) {
  let sql = `
            insert into
            img (name,url,picid)
        values
            ('${passage.name}','${passage.url}','${passage.picid}');
        `;
  return sql
}
let delimg = function (id) {
  let sql = `
    delete from
        img
    where
        id='${id}';
    `;
  return sql;
}
//添加标签
let addtag = function (params) {
  let sql = `
    insert into
   tags (tagname)
values
    ('${params.tagname}')
`;
  return sql
}

//添加链接
let addHef = function (params) {
  let sql =`insert into href (hrefname,hrefUrl) values ('${params.Hrefname}','${params.HrefUrl}')`;
  return sql
}
let getHef = function () {
    let sql = `
         select *from href
  `;
    return sql
  }
  
let getOneHef = function (id) {
    let sql = `
         select *from href where id='${id}'
  `;
    return sql
  }
    
let getoneimg = function (id) {
  let sql = `
  select 
  a.name as name,a.url,a.creattime,b.name as picname,a.id,a.picid
from
  img as a ,pic as b
where
  a.picid=b.id and a.id='${id}'
`;
  return sql
}
  let getOnepic = function (id) {
    let sql = `
         select *from pic
          where id='${id}'
  `;
    return sql
  }
  
let getOnetag = function (id) {
    let sql = `
         select * from tags href where id='${id}'
  `;
    return sql
  }
//更新文章
let updateHref = function (passage) {
    let sql = `
          update
              href
          set
          Hrefname='${passage.Hrefname}',
          HrefUrl='${passage.HrefUrl}'
          where
              id='${passage.id}'
          `;
    return sql;
  }
  let updatetag = function (passage) {
    let sql = `
          update
              tags
          set
          tagname='${passage.tagname}'
          where
              id='${passage.id}'
          `;
    return sql;
  }
let delhref = function (id) {
  let sql = `
    delete from
        href
    where
        id='${id}'
    `;
  return sql;
}
let deltag=function (id) {
    let sql = `
    delete from
        tags
    where
        id='${id}'
    `;
  return sql;
}

let delpic=function (id) {
  let sql = `
  delete from
      pic
  where
      id='${id}'
  `;
return sql;
}
let gettag=function () {
    let sql = `
    select * from
        tags
    `;
  return sql;
}
//获取分类文章(完成)
let queryCategory = function (param) {
  let sql = `
        select
            *
        from
            article 
        where 
            article.category='${param}'
        order by 
            article.time desc ,article.id desc
        `;
  return sql;
}

//获取一篇文章(完成)
let queryOneArticle = function (param) {
  let sql = `
        select
            * 
        from
            article
        where
            article.id='${param}'
        `;
  return sql;
};

//更新文章
let updateArticle = function (passage) {
  let sql = `
        update
            article
        set
            title='${passage.title}',
            time='${passage.time}',
            category='${passage.category}',
            tags='${passage.tags}',
            state='${passage.state}',
            summary='${passage.summary}',
            content='${passage.content}'
        where
            id='${passage.id}';
        `;
  return sql;
}

//创建一篇文章
let createArticle = function (passage) {
  let sql = `
        insert into
            article (title,time,category,tags,state,summary,content)
        values
            ('${passage.title}','${passage.time}','${passage.category}','${passage.tags}','${passage.state}','${passage.summary}','${passage.content}');
        `;
  return sql;
}

// 更改文章状态
let changeState = function (id, state) {
  let sql = `
        update
            article
        set
            state='${state}'
        where
            id='${id}';
        `
  return sql;
}
// 删除文章
let delArticle = function (id) {
  let sql = `
        delete from
            article
        where
            id='${id}';
        `;
  return sql;
}

//获取所有文章的评论
let getAllComments = function () {
  let sql = `
        select
            article.title,
            comments.*
        from
            comments left join article
        on
            comments.articleId=article.id
        order by
            comments.time desc;
        `;
  return sql;
}

//删除单条评论
let delComment = function (id) {
  let sql = `
        delete from
            comments
        where
            id='${id}';
        `;
  return sql;
}

let changeUserInfo = function (id, params, url) {
    //这个params里面装的是文字信息
    let sql;
    console.log(url)
    //url存在的话
    if (url) {
      sql = `
              update
                  users
              set
                  name='${params.name}',
                  imgsrc='${url}',
              where
                  id='${id}';
              `;
    } else {
      sql = `
              update
                  user
              set
                  name='${params.name}',
              where
                  id='${id}';
              `;
    }
    return sql;
  }
  let allArticle = function () {
    let sql = `
          select
              article.id,article.title,article.time,article.category,article.tags,article.summary,article.state
          from
              article
          order by
              article.time desc ,article.id desc
          `;
    return sql;
  }
module.exports = {
  Query,

  queryCategory,
  queryOneArticle,
  updateArticle,
  createArticle,
  changeState,
  delArticle,
  changeInfo,
  getInfo,
  login,

  allArticleFront,
  oneArticleFront,
  prePsgFront,
  nextPsgFront,
  categoryArticleFront,
  sortFileFront,
  allTagsFront,
  tagPassagesFront,
  searchPassageFront,
  makeComment,
  getComments,
  getAllComments,
  delComment,

  allpic,
  imgBypicid,
  addpic,
  delpic,
  updatepic,
  getoneimg,
  addimg,
  delimg,
  allimg,
  userlogin,
  updateimg,
  delhref,
  addHef,
  changeUserInfo,
  allArticle,
  getHef,
  getOneHef,
  updateHref,
  addtag,
  deltag,
  gettag,
  getOnetag,
  updatetag,
  getOnepic
}
