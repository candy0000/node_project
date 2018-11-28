const verification = {
  val(data,cb){
    if(!/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,16}$/.test(data.username)){
      cb({code:-1,msg:'用户名必须是4-16个字符'})
      return
    }
    if(!/^\w{6,16}$/.test(data.password)){
      cb({code:-1,msg:'密码必须是6-16个字符'})
      return
    }
    console.log(data.password)
    console.log(data.pwd)
    if(!data.password === data.pwd){
      cb({code:-1,msg:'2次密码不一样'})
      return
    }
    if(!/^1[34578]\d{9}$/.test(data.iphone)){
      cb({code:-1,msg:'手机号码有误'})
      return
    }
    cb(null)
  }
}
module.exports = verification;






