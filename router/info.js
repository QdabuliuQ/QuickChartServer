const express = require('express')
const expressJoi = require('@escook/express-joi')
const {
  putProfile,
  getProfile,
  putPassword,
  getCode
} = require('../router_handle/info')
const {
  put_profile_schema,
  put_password_schema
} = require('../schema/info')

const router = express.Router()

router.put('/profile', expressJoi(put_profile_schema), putProfile)
router.get('/profile', getProfile)
router.get('/code', getCode)
router.put('/password', expressJoi(put_password_schema), putPassword)

module.exports = router