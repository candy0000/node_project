var express = require('express');
var MongoClient=require('mongodb').MongoClient
var router = express.Router();
var url='mongodb://127.0.0.1:27017';


// var usersModel = require('../model/usersModel')
// var verification = require('../model/verification')
// const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(err){
      console.log('连接失败',err);
      res.render('error',{
        message:'连接数据库失败',
        error:err
      });
    }
    var db=client.db('candy');
    db.collection('opject').find().toArray(function(err,data) {
      if(err){
        console.log('查询出错',err);
        res.render('error',{
          message:'查询失败',
          error:err
        });
        return;
      }else{
        console.log(data);
        res.render('users',{
          list:data
        });
      }
      //关闭连接
      client.close();
    });
  })

});































//以下是注册页面
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



















  //以下是传统方式做的
  // verification(req.body,function(err){
  //   console.log(err)
  //   if (err) {
  //     console.log('验证出错',err);
  //     res.render('err',err)
  //   } else {
  //     console.log('验证成功')
  //     usersModel.add(req.body,function(err){
  //       if (err) {
  //         console.log('注册出错',err);
  //         res.render('err',err)
  //       } else {
  //         console.log('写入成')
  //         res.redirect('/login.html')
  //       }
  //     })
  //   }
  // })


// })


module.exports = router;
