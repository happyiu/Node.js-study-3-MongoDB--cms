// 数据操作模块
// 封装 增删改查 方法

var fs = require('fs')
var dbPath = './db.json'

// 获取所有学生列表
// callback 中 第一个参数为err 第二个参数为data结果
exports.findAll = function(callback){
    fs.readFile(dbPath,function(err,data){
        if(err){
            return callback(err)
        }
        callback(null,JSON.parse(data).students)
    })  
}

// 根据id获取学生对象
exports.findById = function(id,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }

        var students = JSON.parse(data).students
        var ret = students.find(function(item){
            return item.id === parseInt(id) 
        })
        callback(null,ret)
    })
}

// 保存学生信息
exports.save = function(student,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students

        // 处理id问题
        student.id = students[students.length-1].id+1
        // 把用户传递的对象保存到数组中
        students.push(student)
        // 把对象数据转化为字符串
        var fileData = JSON.stringify({
            students:students
        })

        // 把字符串转化到文件中
        fs.writeFile(dbPath,fileData,function(err){
            if(err){
                return callback(err)
            }
            // 成功是没错，就是null
            callback(null)
        })
    })
    
}

// 更新保存学生信息
exports.updateById = function(student,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students

        student.id = parseInt(student.id)

        // ES6 中 数组方法，需要接受一个函数作为参数，当每一个遍历项符合返回条件的时候，find会终止遍历，并返回
        var stu = students.find(function(item){
            return item.id === student.id
        })

        // 遍历拷贝对象
        for(var key in student){
            stu[key] = student[key]
        }

        var filedata = JSON.stringify({
            students:students
        })

        fs.writeFile(dbPath,filedata,function(err){
            if(err){
                return callback(err)
            }

            callback(null)
        })
    })
    
}


// 删除学生信息
exports.deleteById = function(id,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students

        var deleteId = students.findIndex(function(item){
            return item.id === parseInt(id) 
        })

        students.splice(deleteId,1)

        var filedata = JSON.stringify({students:students})

        fs.writeFile(dbPath,filedata,function(err){
            return callback(err)
        })

        callback(null)
    })
    
}