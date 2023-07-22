const NodeRSA = require("node-rsa")
const {sendEmail} = require('node-send-email')
const bcrypt = require('bcryptjs')  // 密码校验
const {
  uuid,
  query,
  mailConent,
  addPrefix
} = require("../until/index");
const jwt= require("jsonwebtoken");
const {
  privateKey,
  ownEmail,
  SMTPpass,
  secret,
  expiresIn,
  pattern
} = require("../config");
const codeInstance = require('../models/code')

const pkey = new NodeRSA(privateKey) // 使用node-rsa
pkey.setOptions({encryptionScheme: "pkcs1"})

// 账号密码登录
exports.login = async (req, res) => {
  let {
    email,
    password,
  } = req.body
  password = pkey.decrypt(password, "utf8")  // 密码解密
  let [state, data] = await query('select * from qc_users where email=?', email)
  if(!state || !data.length) return res.cc('账号或密码错误', 0)
  let compareResult = bcrypt.compareSync(password, data[0].password)  // 加密前后密码对比
  if(!compareResult) return res.cc('账号或密码错误', 0)
  const tokenStr = jwt.sign({  // 生成token
    user_id: data[0].user_id,
    nickname: data[0].nickname,
    email
  }, secret, {
    expiresIn  // token有效期
  })
  delete data[0].password
  addPrefix(data)
  res.send({
    status: 1,
    data: data[0],
    id: data[0].user_id,
    token: 'Bearer ' + tokenStr,
    msg: '登录成功'
  })
}

// 验证码登录
exports.loginByCode = async (req, res) => {
  let {
    email,
    code
  } = req.body
  if(codeInstance.getCode(email) !== code) return res.cc('邮箱或验证码错误', 0)
  let [state, data] = await query('select * from qc_users where email = ?', email)
  if(!state || !data.length) return res.cc('邮箱或验证码错误', 0)
  codeInstance.delete(email)  // 删除验证码
  const tokenStr = jwt.sign({  // 生成token
    user_id: data[0].user_id,
    nickname: data[0].nickname,
    email
  }, secret, {
    expiresIn  // token有效期
  })
  delete data[0].password
  addPrefix(data)
  res.send({
    status: 1,
    data: data[0],
    id: data[0].user_id,
    token: 'Bearer ' + tokenStr,
    msg: '登录成功'
  })
}

// 注册
exports.register = async (req, res) => {
  let {
    email,
    code,
    password,
    re_password,
  } = req.body
  password = pkey.decrypt(password, "utf8")  // 密码解密
  re_password = pkey.decrypt(re_password, "utf8")
  if (password !== re_password) return res.cc('确认密码输入不同', 0)
  if(!pattern.password.test(password)) return res.cc('密码格式错误', 0)
  if (codeInstance.getCode(email) !== code) return res.cc('验证码错误', 0)
  let [state, data] = await query('select * from qc_users where email=?', email)
  if (!state) res.cc('网络错误', -1)
  if (data.length) return res.cc('邮箱已被注册', 0)
    let uid = uuid(16, 36), nickname = '用户' + uuid(6, 36);
  [state, data] = await query('insert into qc_users set ?', {  // 插入数据
    user_id: uid,
    nickname,
    email,
    password: bcrypt.hashSync(password, 5)  // 加密保存,
  })
  if (!state || data.affectedRows === 0) return res.cc('注册账号失败', 0)
  codeInstance.delete(email)  // 删除验证码
  const tokenStr = jwt.sign({ user_id: uid, nickname, email }, secret, {
    expiresIn: expiresIn  // token有效期
  })
  res.send({
    status: 1,
    msg: '账号注册成功',
    id: uid,
    token: 'Bearer ' + tokenStr  // 返回token
  })
}

// 发送验证码
exports.code = async (req, res) => {
  let {
    email,
    type
  } = req.query
  const [state, data] = await query('select * from qc_users where email=?', email)
  if (!state) return res.cc('网络错误', 0)
  if (type === 'register' && data.length) return res.cc('该邮箱已注册', 0)
  if (type === 'login' && !data.length) return res.cc('邮箱错误或未注册', 0)
  const _code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') //生成随机验证码
  //发送邮件需要的入参
  const params = {
    type: 'qq',
    // 发件人
    name: 'QuickChart',
    // 发件箱，要与收件箱邮箱类型一致
    from: ownEmail,
    // 发件箱smtp,需要去邮箱—设置–账户–POP3/SMTP服务—开启—获取stmp授权码
    smtp: SMTPpass,
    // 发送的邮件标题
    subject: '验证码',
    // 收件箱，要与发件箱邮箱类型一致
    to: email,
    // 邮件内容，HTML格式
    html: mailConent(_code)
  };

  await sendEmail(params, (result) => {
    if (result) {
      res.cc('发送验证码成功', 1)
      codeInstance.delete(email)
      let timer = setTimeout(() => {    // 5分钟后失效
        codeInstance.delete(email)
      }, 1000 * 60 * 5)
      codeInstance.insert(email, _code, timer)
    } else {
      res.cc('发送验证码失败', 0)
    }
  })
}