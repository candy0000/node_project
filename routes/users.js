var express = require('express');
var MongoClient=require('mongodb').MongoClient
var ObjectId=require('mongodb').ObjectId;
var async = require('async');
var router = express.Router();

var url='mongodb://127.0.0.1:27017';


// var usersModel = require('../model/usersModel')
// var verification = require('../model/verification')
// const async = require('async');

/* GET users listing. */
//用户管理操作
//分页操作
router.get('/', function(req, res, next) {
  var page=parseInt(req.query.page) || 1;//页码
  var pageSize=parseInt(req.query.pageSize) || 3;//每页显示的条数
  var totalSize = 0;//总条数
  var data=[];
  MongoClient.connect(url,{useNewUrlParser:true},function(err,
    client){
      if(err){
            console.log('连接失败',err);
            res.render('error',{
              message:'连接数据库失败',
              error:err
            });
            return;
          }
          var db=client.db('candy');
          async.series([
            function(cb){
              db.collection('opject').find().count(function(err,num){
                if(err){
                  cb(err);
                }else{
                  totalSize=num;
                  cb(null);
                }
              })
            },
            function(cb){
              db.collection('opject').find().limit(pageSize).skip(page*
                pageSize-pageSize).toArray(function(err,data){
                  if(err){
                    cb(err)
                  }else{
                    cb(null,data)
                  }
                })
            }
          ],function(err,results){
            if(err){
              res.render('error',{
                message:'错误',
                error:err
              })
            }else{
              var totalPage=Math.ceil(totalSize/pageSize);//总页数
              res.render('users',{
                list:results[1],
                totalPage:totalPage,
                currentPage:page,
                pageSize:pageSize

              })
            }
          })

        })


  // MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
  //   if(err){
  //     console.log('连接失败',err);
  //     res.render('error',{
  //       message:'连接数据库失败',
  //       error:err
  //     });
  //   }
  //   var db=client.db('candy');
  //   db.collection('opject').find().toArray(function(err,data) {
  //     if(err){
  //       console.log('查询出错',err);
  //       res.render('error',{
  //         message:'查询失败',
  //         error:err
  //       });
  //       return;
  //     }else{
  //       console.log(data);
  //       res.render('users',{
  //         list:data
  //       });
  //     }
  //     //关闭连接
  //     client.close();
  //   });
  // })

});

//登录操作
router.post('/login',function(req,res){
  //1.获取前端传递过来的参数
  // console.log(req.body);
  // res.send('');
  var name=req.body.name;
  var pwd=req.body.pwd;
//2.验证参数的有效性
  if(!name){
    res.render('error',{
      message:'用户名不能为空',
      error:new Error('用户名不能为空')
    })
    return;
  }
  if(!pwd){
    res.render('error',{
      message:'密码不能为空',
      error:new Error('密码不能为空')
    })
    return;
  }
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,16}$/.test(req.body.name)){
    res.render('error',{
      message:'用户名必须是4-16个字符',
      error:new Error('用户名必须是4-16个字符哦')

  });
    return;
  }
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9_]{3,6}$/.test(req.body.pwd)){
   res.render('error',{
     message:'密码必须是6-10个字符',
     error:new Error('密码必须是6-10个字符哦')
    });
    return;
  }
  //连接数据库
  MongoClient.connect(url,{useNewUrlParser:true},function (err,client) {
    if(err){
      console.log('连接失败',err);
      res.render('error',{
        message:'连接失败了',
        error:err
      })
      return;
    }
    var db=client.db('candy');
    // db.collection('opject').find({
    //   username:name,
    //   password:pwd
    // }).count(function(err,num){
    //   if(err){
    //     console.log('查询失败',err);
    //     res.render('error',{
    //       message:'查询失败了',
    //       error:err
    //     })
    //   }else if(num>0){
    //     //说明有数据登录成功 跳转到首页
    //     // res.render('index');//这里要使用重定项不然地址不会改变
    //     //登录成功，写入cookie中
    //     res.cookie('nickname',)


    //     res.redirect('/index.html');
    //   }else{
    //     //登录失败
    //     console.log('登录失败');
    //     res.render('error',{
    //       message:'登录失败了',
    //       error:new Error('登录失败')
    //     });
    //   }
    //   client.close();
    // });
    db.collection('opject').find({
        username:name,
        password:pwd
      }).toArray(function(err,data){
        if(err){
            console.log('查询失败',err);
            res.render('error',{
              message:'查询失败了',
              error:err
            });
         }else if(data.length<=0){
           //没找到
           console.log('登录失败');
            res.render('error',{
              message:'登录失败了',
              error:new Error('登录失败')
            });
         }else{
           res.cookie('nickname',data[0].nickname,{
             maxAge:10*60*1000
           });
           res.redirect('/index.html');
         }
         client.close();
      })

  });




  // res.send('');不能有 ，因为上面的是异步操作
  //3.链接数据做验证
});

//注册操作

router.post('/registar',function(req,res){
  var userData = {
    name:req.body.name,
    pwd:req.body.password
  }
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,16}$/.test(req.body.name)){
    res.render('error',{
      message:'用户名必须是4-16个字符',
      error:new Error('用户名必须是4-16个字符哦'),
    })
    return
  };
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9_]{3,6}$/.test(req.body.password)){
    res.render('error',{
      message:'密码必须是6-10个字符',
      error:new Error('密码必须是6-10个字符哦')
     });
     return;
   }
  //  console.log(userData.pwd,'=====================');
   if(!userData.pwd == req.body.pwd) {

    res.render('error',{
      message:'2次的密码需要一样',
      error:new Error('2次的密码需要一样')
     });
     return;
   }
   if(!/^[\w\u4e00-\u9fa5]{2,8}$/.test(req.body.nickname)){
    res.render('error',{
      message:'昵称必须是2-8为字符',
      error:new Error('昵称必须是2-8为字符哦')
     });
      return
    }
  if(!/^1[34578]\d{9}$/.test(req.body.iphone)){
    res.render('error',{
      message:'手机号码有误',
      error:new Error('手机号码有误哦')
     });
      return
    }
  //获取值

  //查询数据库中是否有这条数据


  MongoClient.connect(url,{useNewUrlParser :true},function(err,client){

    if(err){
      res.render('error',{
        message:'连接失败',
        error:err
      });
      return;
    }
    var db=client.db('candy');
    // console.log(req.body.name)
  //改成同步操作
    async.series([
      function (cb) {
        db.collection('opject').find({username:req.body.name}).count
        (function (err,num){
          if(err){
            cb(err);
          }else if(num >0){
            //已经注册了
            cb(new Error('已经注册了'));
          }else{
            //可以注册了
            cb(null);
          }
        })

      },
      //插入到数据里面去
      function(cb) {
        db.collection('opject').insertOne({
            username:req.body.name,
            password:req.body.password,
            sex : req.body.sex,
            age : req.body.age,
            nickname : req.body.nickname,
            iphone : req.body.iphone,
            isAdmin : req.body.isAdmin === 'yes' ? true : false,
        },function(err){
          if(err){
            cb(err);
          }else{
            cb(null);
          }
        })
      }
    ],function(err,result){
      if(err){
        res.render('error',{
          message:'注册失败',
          error:err
        })
      }else{
        res.redirect('/login.html');
      }
      client.close();
    });










    // db.collection('opject').insertOne({
    //   username:req.body.name,
    //   password:req.body.password,
    //   sex : req.body.sex,
    //   age : req.body.age,
    //   nickname : req.body.nickname,
    //   iphone : req.body.iphone,
    //   isAdmin : req.body.isAdmin === 'yes' ? true : false,
    // },function(err){
    //   if(err){
    //     console.log('注册失败',err);
    //     res.render('error',{
    //       message:'注册失败',
    //       error:err
    //     });
    //   }else{

    //     console.log('到这里没？？？？？？？？？？？？？')
    //     //注册成功 跳转到登录页面去
    //     res.redirect('/login.html');
    //   }
    //   client.close();
    // });
  })

});


//删除操作
router.get('/delete',function(req,res) {
  var id=req.query.id;
  MongoClient.connect(url,{useNewUrlParser:true},function(err,
    client){
    if(err){
      res.render('error',{
        message:'链接失败',
        error:err
      })
      return;
    }
    var db=client.db('candy');
    db.collection('opject').deleteOne({
      _id:ObjectId(id)
    },function(err) {
      if(err){
        res.render('error',{
          message:'删除失败',
          error:err
        });
      }else{
        //删除成功
        res.redirect('/users');
      }
      client.close();
    })
  });
})



























// // 以下是注册页面
// router.post('/registar.html',function(req,res){
//   async.series([
//     function(callback){
//       verification.val(req.body,function(err){
//         if (err) {
//           console.log('验证出错',err);
//           callback('err',err)
//         } else {
//           console.log('验证成功');
//           callback(null)
//         }
//       })
//     },
//     function(callback){
//       usersModel.add(req.body,function(err){
//         if (err) {
//           console.log('注册出错',err);
//           callback('err',err)
//         } else {
//           console.log('写入成');
//           callback(null)
//         }
//       })
//     },
//   ],function(err,result){
//     if (err) {
//       console.log('上面2个可能错处了');
//       res.render('err',err);
//     } else {
//       res.redirect('/login.html');
//     }
//   })



















//   以下是传统方式做的
//   verification(req.body,function(err){
//     console.log(err)
//     if (err) {
//       console.log('验证出错',err);
//       res.render('err',err)
//     } else {
//       console.log('验证成功')
//       usersModel.add(req.body,function(err){
//         if (err) {
//           console.log('注册出错',err);
//           res.render('err',err)
//         } else {
//           console.log('写入成')
//           res.redirect('/login.html')
//         }
//       })
//     }
//   })


// })


module.exports = router;
