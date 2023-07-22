const joi = require('joi')
const {
  pattern
} = require('../config')

const email = joi.string().regex(pattern.email).required()
const password = joi.string().required()
const code = joi.string().regex(/^\d{6}$/).required()

exports.login_schema = {
  body: {
    email,
    password
  }
}
exports.login_by_code_schema = {
  body: {
    email,
    code
  }
}
exports.register_schema = {
  body: {
    email,
    code,
    password,
    re_password: password
  }
}
exports.code_schema = {
  query: {
    email,
    type: joi.string().valid('login', 'register').required()
  }
}