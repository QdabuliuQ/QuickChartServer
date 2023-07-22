const {query, uuid, addPrefix} = require("../until");
const {saveImg} = require("./upload");
const limit = 20

exports.postChart = async (req, res) => {
  if(!req.file) return res.cc('保存图表信息失败', 0)
  let {
    name,
    type,
    option,
  } = req.body
  let chart_id = uuid(20, 36)
  saveImg(req.file, `chartCover/type${parseInt(type)}`, chart_id).then(async (results) => {
    let [state, data] = await query('insert into qc_charts set ?', {
      chart_id,
      name,
      type,
      option,
      cover: results,
      time: Date.now(),
      user_id: req.auth.user_id
    })
    if(!state || !data.length) return res.cc('保存图表失败', 0)
    res.cc('保存图表成功')
  }).catch((err)=>{
    res.cc('保存图表失败', 0)
  })

}

exports.getChart = async (req, res) => {
  let {
    user_id
  } = req.auth
  let {
    offset
  } = req.query
  let [state, data] = await query('select * from qc_charts where user_id=? and state="1" order by time desc limit ?,?', [
    user_id,
    (parseInt(offset)-1) * limit,
    limit
  ])
  if(!state) return res.cc('获取用户图表失败', 0)
  addPrefix(data)
  let [_state, _data] = await query('select count(*) as count from qc_charts where user_id=? and state="1"', user_id)
  let count = _data[0] ? _data[0].count : 0
  res.send({
    status: 1,
    data,
    count,
    limit
  })
}

exports.putChartName = async (req, res) => {
  let {
    name,
    chart_id
  } = req.body
  let {
    user_id
  } = req.auth
  let [state, data] = await query('update qc_charts set name=? where chart_id=? and user_id=? and state="1"', [
    name,
    chart_id,
    user_id,
  ])
  if(!state || !data.affectedRows) return res.cc('修改图表信息失败', 0)
  res.cc('修改图表信息成功')
}

exports.deleteChart = async (req, res) => {
  let {
    chart_id
  } = req.body
  let {
    user_id
  } = req.auth
  let [state, data] = await query('update qc_charts set state = "2" where chart_id=? and user_id=?', [
    chart_id,
    user_id
  ])
  if(!state || !data.affectedRows) return res.cc('删除图表失败', 0)
  res.cc('删除图表成功')
}

exports.getChartDetail = async (req, res) => {
  let {
    chart_id
  } = req.query
  let [state, data] = await query('select * from qc_charts where chart_id=?', chart_id)
  if (!state || !data.length) return res.cc('获取图表信息失败', 0)
  if (data[0].state !== '1') return res.cc('图表不见啦', 0)
  addPrefix(data)
  data[0].option = JSON.parse(data[0].option)
  res.send({
    status: 1,
    data: data[0],
    msg: '获取图表信息成功'
  })
}

exports.putChart = async (req, res) => {
  if(!req.file) return res.cc('保存图表信息失败', 0)
  let {
    chart_id,
    option,
  } = req.body
  let [state, data] = await query("select * from qc_charts where chart_id=? and state='1'", chart_id)
  if(!state || !data.length) return res.cc('保存图表信息失败', 0)
  let _type = parseInt(data[0].type)
  [state, data] = await query("update qc_charts set `option`=? where chart_id=?", [
    option,
    chart_id
  ])
  if(!state || data.length === 0) return res.cc('保存图表信息失败', 0)
  saveImg(req.file, `chartCover/type${_type}`, chart_id).then(results => {
    res.cc("保存图表信息成功")
  }).catch((err)=>{
    console.log(err)
    res.cc('保存图表信息失败', 0)
  })
}