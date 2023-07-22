const joi = require('joi')
const {
  pattern
} = require('../config')

exports.put_profile_schema = {
  body: {
    user_pic: joi.string().required(),
    nickname: joi.string().max(15).min(1).required(),
    homePage: joi.string(),
    desc: joi.string()
  }
}
exports.put_password_schema = {
  body: {
    old_password: joi.string().required(),
    new_password: joi.string().required(),
    code: joi.string().regex(/^\d{6}$/).required()
  }
}