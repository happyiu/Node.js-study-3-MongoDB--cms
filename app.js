var express = require('express')
var fs = require('fs')
var router = require('./router.js')
var bodyParser = require('body-parser')

var app = express()

// 配置模板引擎 和body-parser 一定要在 挂载路由之前 app.use(router)
app.engine('html',require('express-art-template'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// 这是原生导出路由模块再加载的方式
// router(app)

// 通过Express的包装路由后导出后加载方式
// 将路由容器挂载到 app 服务中
app.use(router)



// 开放资源
app.use('/node_modules/',express.static('./node_modules/'))
app.use('/public/',express.static('./public/'))



app.listen(3000,function(){
    console.log('running..... 请打开 http://127.0.0.1:3000 查看')
})