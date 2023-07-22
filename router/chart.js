const express = require('express')
const expressJoi = require('@escook/express-joi')
const multer = require('multer');  // 上传文件
const {
  postChart,
  getChart,
  putChartName,
  deleteChart,
  getChartDetail,
  putChart
} = require('../router_handle/chart')
const {
  get_chart_schema,
  post_chart_schema,
  put_chart_name_schema,
  delete_chart_schema,
  get_chart_detail_schema,
  put_chart_schema
} = require('../schema/chart')

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/chart', upload.single('cover'), expressJoi(post_chart_schema), postChart)

router.get('/chart', expressJoi(get_chart_schema), getChart)

router.put('/chartName', expressJoi(put_chart_name_schema), putChartName)

router.delete('/chart', expressJoi(delete_chart_schema), deleteChart)

router.get('/chartDetail', expressJoi(get_chart_detail_schema), getChartDetail)

router.put('/chart', upload.single('cover'), expressJoi(put_chart_schema), putChart)

module.exports = router