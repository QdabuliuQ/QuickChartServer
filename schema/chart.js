const joi = require('joi')
const {string} = require("joi");

const typeVal = () => {
  let typeRelative = {
    1: 8,
    2: 8,
    3: 4,
    4: 5,
    5: 1,
    6: 1,
    7: 2,
    8: 1,
    9: 3,
    10: 2
  }
  let res = []
  for(let key in typeRelative) {
    for(let i = 1; i <= typeRelative[key]; i ++) {
      res.push(key+'_'+i)
    }
  }
  return res
}
let types = typeVal()

exports.get_chart_schema = {
  query: {
    offset: joi.number().required()
  }
}

exports.post_chart_schema = {
  body: {
    name: joi.string().max(15).required(),
    type: joi.string().valid(...types).required(),
    option: joi.string().required(),
  }
}

exports.put_chart_name_schema = {
  body: {
    name: joi.string().max(15).required(),
    chart_id: joi.string().required(),
  }
}

exports.delete_chart_schema = {
  body: {
    chart_id: joi.string().required()
  }
}

exports.get_chart_detail_schema = {
  query: {
    chart_id: joi.string().required()
  }
}

exports.put_chart_schema = {
  body: {
    chart_id: joi.string().required(),
    option: joi.string().required(),
  }
}