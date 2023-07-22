class Code {
  pool = null
  constructor() {
    this.pool = new Object()
  }
  delete(email) {
    if(this.pool.hasOwnProperty(email)) {
      clearTimeout(this.pool[email].timer)
      delete this.pool[email]
    }
  }
  insert(email, code, timer) {
    if(this.pool[email]) {
      clearTimeout(this.pool[email].timer)
    }
    this.pool[email] = {
      code,
      timer,
      time: Date.now()
    }
  }
  getCode(email) {
    return this.pool[email] ? this.pool[email].code : null
  }
  getInfo(email) {
    return this.pool[email] ? this.pool[email] : null
  }
}

module.exports = new Code()