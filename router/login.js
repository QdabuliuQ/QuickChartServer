const express = require('express')
const expressJoi = require('@escook/express-joi')
const {
  login,
  loginByCode,
  register,
  code
} = require('../router_handle/login')
const {
  register_schema,
  code_schema,
  login_schema,
  login_by_code_schema
} = require('../schema/login')

const router = express.Router()

// 邮箱密码登录
router.post('/login', expressJoi(login_schema),  login)

// 邮箱验证码登录
router.post('/loginByCode', expressJoi(login_by_code_schema), loginByCode)

// 注册账号
router.post('/register', expressJoi(register_schema), register)

// 获取验证码
router.get('/code', expressJoi(code_schema), code)


module.exports = router