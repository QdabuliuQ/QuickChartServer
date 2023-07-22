const fs = require('fs')
const path = require('path')
const {
  oss,
} = require('../config')
const {uuid} = require("../until");

exports.saveImg = (file, relUrl, name) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        reject(err)
      }
      // 拓展名
      let extName = file.mimetype.split('/')[1]
      // 拼接成图片名
      let imgName = name ? `${name}.${extName}` : `${Date.now()+uuid(5)}.${extName}`
      // 写入图片
      // 写入自己想要存入的地址
      await fs.writeFile(path.join(`uploads/${relUrl}/${imgName}`), data, err => {
        if (err) { reject(err) }
        fs.stat(path.join(`uploads/${relUrl}/${imgName}`), err => {
          if (err) { reject(err) }
          // 成功就返回图片相对地址
          resolve(`/${relUrl}/${imgName}`)
        })
      })
      // 删除二进制文件
      await fs.unlink(file.path, err => {
        if (err) { reject(err) }
      })
    })
  })
}

exports.avatarUpload = (req, res) => {
  saveImg(req.file, 'avatar').then(results => {
    res.send({
      status: 1,
      url: oss + results,
      msg: "图片上传成功"
    })
  }).catch((err)=>{
    res.cc('图片上传失败', 0)
  })
}

exports.chartCoverUpload = (req, res) => {
  let { type } = req.body
  saveImg(req.file, `chartCover/type${type}`).then(results => {
    res.send({
      status: 1,
      url: results,
      msg: "图片上传成功"
    })
  }).catch((err)=>{
    res.cc('图片上传失败', 0)
  })
}