const express = require('express')
const path = require('path');
const joi = require('joi')
const {
  expressjwt
} = require('express-jwt')
const config = require('./config')
const db = require('./db/index')
const cors = require('cors')
const {
  port,
  secret
} = require('./config')

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))  // 托管静态资源
app.use(express.static(path.join(__dirname,'uploads')))

app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      msg: err instanceof Error ? err.message : err
    })
  }
  next()
})

// app.use((req, res, next) => {
//   let baseUrl = req.originalUrl.substring(1).split('/')
//   let url = baseUrl[0]
//   if(url !== 'api') {
//     // 验证账号状态
//     const sqlStr = 'select * from qc_users where id=?'
//   }
// })

app.use(expressjwt({
  secret,
  algorithms: ['HS256'],
}).unless({
  path: [/^\/api/]
}))

app.use('/api', require('./router/login'))
app.use('/upload', require('./router/upload'))
app.use('/info', require('./router/info'))
app.use('/qc', require('./router/chart'))

app.use((err, req, res, next) => {
  // 判断是否是表单验证出错而引发的中间件
  if(err instanceof joi.ValidationError) return res.cc(err, 0)
  // 如果包含了name属性为 UnauthorizedError，则表示token错误
  if(err.name === 'UnauthorizedError') return res.cc('登录失效，请查询登录', -1)
  // 未知错误
  res.cc(err, 0)
})

// 启动服务器
app.listen(port, () => {
  console.log('success')
})

