const mysql = require('mysql')

// 连接数据库
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'quick_chart',
  multipleStatements: true  // 执行多条sql
})

module.exports = db