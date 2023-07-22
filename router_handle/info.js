const {sendEmail} = require('node-send-email')
const {
  query,
  mailConent,
  addPrefix
} = require("../until/index");
const {
  pattern, oss, ownEmail, SMTPpass, privateKey
} = require('../config')
const codeInstance = require("../models/code");
const NodeRSA = require("node-rsa");
const bcrypt = require("bcryptjs");
const pkey = new NodeRSA(privateKey) // 使用node-rsa
pkey.setOptions({encryptionScheme: "pkcs1"})

exports.putProfile = async (req, res) => {
  let info = req.auth
  let [state, data] = await query(`update qc_users set ? where email='${info.email}' and user_id='${info.user_id}'`, {
    user_pic: req.body.user_pic.replace(oss, ''),
    nickname: req.body.nickname,
    homePage: req.body.homePage,
    desc: req.body.desc
  })
  if(!state || !data.affectedRows) return res.cc('修改资料失败', 0)
  res.cc('修改资料成功')
}

exports.getProfile = async (req, res) => {
  let info = req.auth
  let [state, data] = await query('select * from qc_users where email=? and user_id=?', [info.email, info.user_id])
  if(!state) return res.cc('获取用户信息失败', 0)
  delete data[0].password
  addPrefix(data)
  res.send({
    status: 1,
    data: data[0],
    msg: '获取用户信息成功'
  })
}

exports.getCode = async (req, res) => {
  let { email } = req.auth
  let nowTime = Date.now()
  let info = codeInstance.getInfo(email)
  if (info && nowTime - info.time < 60000) return res.cc('请勿重复发送验证码', 0)
  const _code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') //生成随机验证码
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
    html: mailConent(_code, '修改密码')
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

exports.putPassword = async (req, res) => {
  let {
    old_password,
    new_password,
    code
  } = req.body
  let {
    email,
    user_id
  } = req.auth
  old_password = pkey.decrypt(old_password, "utf8")  // 密码解密
  new_password = pkey.decrypt(new_password, "utf8")  // 密码解密
  if(!pattern.password.test(old_password) || !pattern.password.test(new_password)) return res.cc('密码长度在6-12位之间', 0)
  let [ state, data ] = await query('select * from qc_users where email=? and user_id=?', [email, user_id])
  if(!state || !data.length) return res.cc('原密码错误', 0)
  let result = bcrypt.compareSync(old_password, data[0].password)  // 加密前后密码对比
  if(!result) return res.cc('原密码错误', 0)
  if(codeInstance.getCode(email) !== code) return res.cc('验证码错误', 0)

  codeInstance.delete(email);
  [ state, data ] = await query('update qc_users set password = ? where email=? and user_id=?', [
    bcrypt.hashSync(new_password, 5),  // 加密保存,
    email,
    user_id
  ])
  if(!state || !data.affectedRows) return res.cc('修改密码失败', 0)
  res.cc('修改密码成功')
}