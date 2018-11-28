var express = require('express');
var router = express.Router();

/* GET home page. */

//注册页面
router.get('/',function (req,res){
  res.render('registar');
})

//登录页面
router.get('/login.html', function (req, res) {
  res.render('login');
})

//首页
router.get('/index.html', function(req, res, next) {
  res.render('index');
});


//用户管理页面
// router.get('/users.html', function (req, res) {
//   res.render('users');
// });


//品牌
router.get('/brand.html', function (req, res) {
  res.render('brand');
});

//手机
router.get('/phone.html', function (req, res) {
  res.render('phone');
});
module.exports = router;
