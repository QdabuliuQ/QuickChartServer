const express = require('express')
const multer = require('multer');  // 上传文件
const {
  oss
} = require('../config')
const {
  avatarUpload,
  chartCoverUpload
} = require('../router_handle/upload')
const router = express.Router()

let upload = multer({ dest: 'uploads/' })

router.post('/avatar', upload.single('avatar'), avatarUpload)

router.post('/chartCover', upload.single('cover'), chartCoverUpload)

module.exports = router