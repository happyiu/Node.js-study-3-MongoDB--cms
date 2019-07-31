# 数据库为MongoDB
# 学生管理系统 基本思路
- 处理模板
- 配置开放资源
- 配置模板引擎
- 简单路由，先渲染出静态页面
- 路由设计
- 提取路由模块
- 封装 students.js 文件结构
    - 查询所有
    - 按id查询
    - 添加学生
    - 更新学生
    - 删除学生
- 实现具体功能
    - 通过路由收到请求
    - 接受请求中的数据(GET:req.query,POST:req.body)
- 调用数据操作API
- 根据操作结果，发送客户端响应
- 业务功能顺序
    - 列表
    - 添加
    - 编辑
    - 删除
- Express 对于没有设定的请求路径，默认会返回 Can not get xxx
- 如想要定制404，则需要中间件来配置
- 添加中间件后，只需要在自己的路由之后增加一个  app.use(function(req,res){所有未处理的请求，都会在这里处理})

## 设置目录结构
- public 目录下存放公开的静态资源
- views 目录下放置所有要渲染的网页
- node_modules 放置所有通过npm安装的资源
- README.md 项目思路
- package.json  通过 npm init 初始化出来的
- db.json  暂时作为数据库，来存储数据
- app.js 为入口文件
- router.js 为抽离出来的 路由模块
- student.js 封装了处理数据的API，方便 路由响应时直接调用
    - 查询所有  findAll
    - 按id查询  findById
    - 添加学生  save
    - 更新学生  updateById
    - 删除学生  deleteById


## `app.js 入口模块`
- 启动服务
- 挂载路由
- 做一些配置
    - 模板引擎
    - body-parser 解析表单
- 提供静态资源服务
- 监听端口启动服务

### 使用 Express 框架快速搭建最基本的服务器
- 使用Express框架先要安装
    > npm i express -s
- npm下载好后，先在app.js引包,然后实例化

 ```js
 var express = require('express')
 var app = express()

// 这一部分，下一步，将抽离，将路由单独作为一个模块
 app.get('/student',function(req,res){
     ......
 })

 app.listen(3000,function(){
     console.log('running... 请打开 http://127.0.0.1:3000 查看')
 })
 ```

### app.js 加载引用必要的包和开放资源
- 安装 express 框架
- fs 操作文件的核心模块
- body-parser Express中获取require中POST请求的参数
    - > npm i body-parser -s
- 安装 bootstrap 前端框架
    - > npm i bootstrap@3 -s
- 安装 art-template
    - > npm i art-template -s
- 安装 express-art-template(依赖于art-template)
    - > npm i express-art-template -s
```js
var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')
// 配置模板引擎 和body-parser 一定要在 挂载路由之前 app.use(router)
app.engine('html',require('express-art-template'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 开放资源
app.use('/node_modules/',express.static('./node_modules/'))
app.use('/public/',express.static('./public/'))
```

## `router.js 路由模块`
- 处理路由
- 根据不同请求方式+请求路径，处理响应

### 设计路由模块
- 因为要把路由抽离当做模块，，所以把路由部分取出写入router.js中
- 在Express中提供了一种专门包装路由的方法
- 在router.js 中先要引用Express模块，然后创建路由容器,再将路由挂载到路由容器中,最后导出路由
- 将数据处理抽离作为单独模块
```js
var fs = require('fs')
var Student = require('./student.js')
// Express 提供了一种专门包装路由的
var express = require('express')
// 1.创建一个路由容器
var router = express.Router()
// 2.将路由挂载到 router 容器中
router.get('/student',function(req,res){
    ........
})
// 3.把 router 导出
module.exports = router
```
- 在app.js中需要导入路由模块,然后将容器挂载到 app 服务中
```js
var router = require('./router.js')
// 通过Express的包装路由后导出后加载方式
// 将路由容器挂载到 app 服务中
app.use(router)
```

### `路由设计`

| 请求方法 |       请求路径     |  get参数|        post参数           |  备注          |
|---------|-------------------|---------|---------------------------|----------------|
|   GET   |  /students        |         |                           | 渲染首页        |
|   GET   |  /students/new    |         |                           | 渲染添加学生页面 |
|   POST  |  /students        |         | name,age,gender,hobbies   | 处理添加学生请求 |
|   GET   |  /students/edit   |  id     |                           | 渲染编辑页面     |
|   POST  |  /students/edit   |         | id,name,age,gender,hobbies| 处理编辑请求     |
|   GET   |  /students/delete |  id     |                           | 处理删除请求     |


### 根据路由设计来编写路由规则
- 因为处理数据要作为单独的一个模块，所以，先设计好路由
```js
router.get('/students',function(req,res){

})  

router.get('/students/new',function(req,res){
    
})

router.post('/students/new',function(req,res){

})

router.get('/students/edit',function(req,res){

    
})

router.post('/students/edit',function(req,res){

})

router.get('/students/delete',function(req,res){

})

```

## `student.js 数据操作模块`
操作文件中的数据，只处理数据，不关心业务
- 获取所有学生列表
- 添加保存学生
- 更新学生
- 删除学生

### 获取所有学生列表方法和router结合
- router.js 路由请求
```js
router.get('/students',function(req,res){
    Students.findAll(fuction(err,data){
        if(err){
            return res.status(500).send('Server error')
        }
        res.render('index.html',{
            students:data
        })
    })
})  
```
- student.js
```js
var fs = require('fs')
var dbPath = './db.json'

exports.findAll = function(callback){
    fs.readFile(dbPath,function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students
        callback(null,students)
    })
}
```
- index.html 渲染数据
```html
<tbody>
  {{each students}}
  <tr>
    <td>{{$value.id}}</td>
    <td>{{$value.name}}</td>
    <td>{{$value.gender}}</td>
    <td>{{$value.age}}</td>
    <td>{{$value.hobbies}}</td>
    <td>
      <a href="/students/edit?id={{$value.id}}">编辑</a>
      <a href="/students/delete?id={{$value.id}}">删除</a>
    </td>
  </tr>
  {{/each}}
</tbody>
```

### 点击添加，进入添加页面
```html
<a class="btn btn-success" href="/students/new">添加</a>
```
```js
router.get('/students/new',function(req,res){
    res.render('new.html')
})
```

### 保存添加学生信息
- 添加页面填写完后，发送POST请求
```html
<form action="/students/new" method="POST">
  <div class="form-group">
    <label for="exampleInputEmail1">请输入姓名：</label>
    <input type="text" class="form-control" name="name" id="exampleInputEmail1" placeholder="你叫什么呀">
  </div>
  <div class="form-group">
      <label for="exampleInputEmail1">性别：</label>
      <div>
          <label class="radio-inline">
              <input type="radio" name="gender" id="inlineRadio1" value="0"> 女
          </label>
          <label class="radio-inline">
              <input type="radio" name="gender" id="inlineRadio2" value="1"> 男
          </label>
      </div>     
  </div>
    <div class="form-group">
      <label for="exampleInputEmail1">年龄：</label>
      <input type="number" class="form-control" name="age" id="" placeholder="你多大了呀">
    </div>
  <div class="form-group">
      <label for="exampleInputEmail1">爱好：</label>
      <input type="text" class="form-control" name="hobbies" id="" placeholder="你有啥兴趣呢">                
  </div>
  <button type="submit" class="btn btn-default">Submit</button>
</form>
```
- router.js
```js
router.post('/student/new',function(req,res){
    // 获取表单数据
    var stu = req.body
    // 保存更新
    Student.save(student,function(err){
        if(err){
            return res.status(500).send('Server error')
        }
        res.redirect('/students')
    })
})
```
- student.js
```js
exports.save = function(stu,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        students = JSON.parse(data).students
        // 处理id问题
        students.id = students[students.length - 1].id + 1
        // 把用户传递的对象保存到数组中
        students.push(stu)
        // 把对象数据转化为字符串
        // 因为元数据格式为
        // {
        //     student:[{},{}]
        // }
        var fileData = JSON.stringify(
            { students: stu}
        )

        fs.writeFile(dbPath,fileData,function(err){
            if(err){
                return callback(err)
            }
            callback(null)
        })

    })
}
```


### 根据id获取学生对象方法和router结合
- 点击编辑，获取请求里的参数——id
```html
<a href="/students/edit?id={{$value.id}}">编辑</a>
```
- 根据id来获取学生信息，然后发送响应，进入编辑页面,渲染出数据
- router.js
```js
    router.get('/students/edit',function(req,res){
        // 1.在客户端的列表页处理链接问题（需要id参数）
        var id = parseInt(req.query.id)
        // 2.获取要编辑的学生id
        Students.findById(id,function(err,data){
            if(err){
                return res.status(500).send('Server error')
            }
            res.render('edit.html',{
                student:data
            })
        })
    })
```
- Student.js
```js
exports.findById = function(id,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students
        var student = students.find(function(item){
            return students.id === id
        })
        callback(null,student)
    })
}
```
- 渲染编辑页面
```html
<form action="/students/edit" method="POST">
  <!--这个用于放一些不想让用户看到，但需要提交到服务端的数据-->
  <input type="hidden" name="id" value="{{ student.id }}">
  <div class="form-group">
    <label for="exampleInputEmail1">请输入姓名：</label>
    <input type="text" class="form-control" name="name" id="exampleInputEmail1" placeholder="你叫什么呀" value="{{ student.name}}">
  </div>
  <div class="form-group">
      <label for="exampleInputEmail1">性别：</label>
      <div>
          <label class="radio-inline">
              <input type="radio" name="gender" id="inlineRadio1" value="0" > 女
          </label>
          <label class="radio-inline">
              <input type="radio" name="gender" id="inlineRadio2" value="1" checked> 男
          </label>
      </div>    
  </div>
    <div class="form-group">
      <label for="exampleInputEmail1">年龄：</label>
      <input type="number" class="form-control" name="age" id="" placeholder="你多大了呀" value="{{student.age}}">
    </div>
  <div class="form-group">
      <label for="exampleInputEmail1">爱好：</label>
      <input type="text" class="form-control" name="hobbies" id="" placeholder="你有啥兴趣呢" value="{{student.hobbies}}">                
  </div>
  
```


### 更新保存学生信息
- 进入编辑页面后，点击提交，发送POST请求
```html
<form action="/students/edit" method="POST">
  <!--这个用于放一些不想让用户看到，但需要提交到服务端的数据-->
  <input type="hidden" name="id" value="{{ student.id }}">
  <div class="form-group">
    <label for="exampleInputEmail1">请输入姓名：</label>
    <input type="text" class="form-control" name="name" id="exampleInputEmail1" placeholder="你叫什么呀" value="{{ student.name}}">
  </div>
  <div class="form-group">
      <label for="exampleInputEmail1">性别：</label>
      <div>
          <label class="radio-inline">
              <input type="radio" name="gender" id="inlineRadio1" value="0" > 女
          </label>
          <label class="radio-inline">
              <input type="radio" name="gender" id="inlineRadio2" value="1" checked> 男
          </label>
      </div>
      
  </div>
    <div class="form-group">
      <label for="exampleInputEmail1">年龄：</label>
      <input type="number" class="form-control" name="age" id="" placeholder="你多大了呀" value="{{student.age}}">
    </div>
  <div class="form-group">
      <label for="exampleInputEmail1">爱好：</label>
      <input type="text" class="form-control" name="hobbies" id="" placeholder="你有啥兴趣呢" value="{{student.hobbies}}">                
  </div>
  
  
  <button type="submit" class="btn btn-default">Submit</button>
</form>
```

- router.js
```js
router.post('/students/edit',function(req,res){
    var student = req.body
    Sudent.update(student,function(err){
        if(err){
            return res.status(500).send('Server error')
        }
        res.redirect('/students')
    })
})
```
- studnet.js
```js
exports.update = function(student,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students
        var stu = students.find(function(item){
            item.id === parseInt(student.id)
        })

        // 遍历拷贝对象
        for(var key in students){
            stu[key] = student[key]
        }

        var filedata = JSON.stringify(
            { students: students }
        )

        fs.writeFile(dbPath,filedata,function(err){
            if(err){
                return callback(err)
            }
            callback(null)
        })

    })
}
```

### 根据id删除信息
- 点击删除后，将id传递给后台
```html
<a href="/students/delete?id={{$value.id}}">删除</a>
```
- router.js 路由处理
```js
router.get('/student/delete',function(req,res){
    // 获取要删除的id
    var id = parseInt(req.query.id)
    // 根据 id 执行操作
    Student.deleteById(id,function(err){
        if(err){
            return res.status(500).send('Server error')
        }
        res.redirect('/students')
    })
})
```
- studen.js 
```js
exports.deleteById = function(id,callback){
    fs.readFile(dbPath,'utf8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students
        //获取要删除的学生数据下标
        var stuIndex = students.findIndex(function(item){
            return item.id === id
        })
        students.splice(stuIndex,1)
        var filedata = JSON.stringift(
            { students:students}
        )

        fs.writeFile(dbPath,fileData,function(err){
            if(err){
                return callbakc(err)
            }
            callback(null)
        })
    })
}
```




