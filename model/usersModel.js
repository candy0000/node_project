const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';


const usersModel = {
    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接出错', err);
                cb({ code: -100, msg: '连接出错' })
                return
            }
            const db = client.db('candy');
            db.collection('users').insertOne(data, function (err) {
                if (err) {
                    console.log('写入出错');
                    cb({ code: -100, msg: '写入出错' })
                } else {
                    console.log('写入成功');
                    cb(null)
                    client.close();
                }
            })
        })
    }
}


























// const usersModel = {
//     add(data,cb){
//         console.log(data);
//         MongoClient.connect(url, function (err,client){
//             if (err) {
//                 console.log('连接数据库失败', err)
//                 cb({ code: -1, msg: '数据库连接失败' })
//                 return
//             }
//             const db = client.db('candy');
//             db.collection('users').insertOne(data, function (err) {
//                 console.log(999999999999999)
//                 if (err) {
//                     console.log('写入数据库失败')
//                     cb({ code: -1, msg: '写入数据库失败' })
//                 } else {
//                     console.log("写入数据库成功");
//                     cb(null);
//                     client.close();
//                 }
//             });
//         })
//         // client.close();
//     }
// }
module.exports = usersModel;
