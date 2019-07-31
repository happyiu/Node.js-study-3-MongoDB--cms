// 这样导出不是很方便
// module.exports = function(app){
//     app.get('/students',function(req,res){  
//     })
//     app.get('/students/new',function(req,res){
//     })
//     app.get('/students/edit',function(req,res){
//     })
// }

var fs = require('fs')
var Student = require('./student.js')


// Express 提供了一种专门包装路由的
var express = require('express')

// 1.创建一个路由容器
var router = express.Router()

// 2.将路由都挂载到 router 路由容器中

router.get('/students',function(req,res){  
    // readFile 第二个参数是可选的，传入 'utf-8' 就是告诉它，把读取到的文件直接按照utf-8 编码转给我们
    // 除此之外，还可以 通过 data.toString() 的方式
    // fs.readFile('./db.json','utf-8',function(error,data){
    //     if(error){
    //         return res.status(500).send('Server error')
    //     }
    //     // 文件中读到的一定是字符串，所以要手动转成对象
    //     var students = JSON.parse(data).students

    //     students.forEach((item)=>{
    //         if(item.gender == 1){
    //             return item.gender = '男'
    //         }
    //         else{
    //             return item.gender = '女'
    //         }
    //     })

    //     res.render('index.html',{
    //         fruits:[
    //             '苹果',
    //             '香蕉',
    //             '樱桃',
    //         ],
    //         students:students  
    //     })
    // })

    Student.find(function(err,data){
        if(err){
            return res.status(500).send('Server error')
        }
        res.render('index.html',{
            fruits:[
                '苹果',
                '香蕉',
                '樱桃',
            ],
            students:data
        })
    })
})

router.get('/students/new',function(req,res){
    res.render('new.html')
})

router.post('/students/new',function(req,res){
    new Student(req.body).save(function(err){
        if(err){
            return res.send('error')
        }
        res.redirect('/students')
    })
})

router.get('/students/edit',function(req,res){
    // 1.在客户端的列表页处理链接问题（需要id参数）
    // var id = parseInt(req.query.id)

    Student.findById(req.query.id.replace(/"/g,''),(err,ret)=>{
        if(err){
            console.log(err)
            return res.status(500).send('Server error')
        }
        res.render('edit.html',{
            student: ret
        })
    })
    
})

router.post('/students/edit',function(req,res){
    // 获取表单数据
    var id = req.body.id.replace(/"/g,'')
    Student.findByIdAndUpdate(id,req.body,(err)=>{
        if(err){
            return res.status(500).send('Server error')
        }
        res.redirect('/students')
    })
})

router.get('/students/delete',function(req,res){
    // 获取要删除的id
    console.log(req.body)
    var id = req.query.id.replace(/"/g,'')
    // // 根据 id 执行操作
    Student.findByIdAndRemove(id,function(err){
        if(err){
            return res.status(500).send('Server error')
        }
        res.redirect('/students')
    })
    // 根据操作结果发送响应数据
})


// 3.把router 导出
module.exports = router