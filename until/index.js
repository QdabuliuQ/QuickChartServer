const db = require('../db')
const {
  oss
} = require('../config')

exports.uuid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

exports.query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, res) => {
      if(err) resolve([false, err])
      else resolve([true, res])
    })
  })
}

let set = new Set(['user_pic', 'cover'])
exports.addPrefix = (data) => {
  if(Array.isArray(data)) {
    for(let i = 0; i < data.length; i ++) {
      for(let key in data[i]) {
        if(set.has((key))) {
          data[i][key] = oss + data[i][key]
        }
      }
    }
  } else {
    for(let key in data) {
      if(set.has((key))) {
        data[key] = oss + data[key]
      }
    }
  }
  return data
}

exports.mailConent = (code, title = '欢迎注册使用') => {
  return `
  <div class="open_email" style="margin-left: 8px; margin-top: 8px; margin-bottom: 8px; margin-right: 8px;">
    <div>
      <br>
      <span class="genEmailContent">
        <div id="cTMail-Wrap"
          style="word-break: break-all;box-sizing:border-box;text-align:center;min-width:320px; max-width:660px; border:1px solid #f6f6f6; background-color:#f7f8fa; margin:auto; padding:20px 0 30px; font-family:'helvetica neue',PingFangSC-Light,arial,'hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif">
          <div class="main-content">
            <table style="width:100%;font-weight:300;margin-bottom:10px;border-collapse:collapse">
              <tbody>
                <tr style="font-weight:300">
                  <td style="max-width:600px; padding: 15px;">
                    <p
                      style="height:5px;background-color: #ffae34;border: 0;font-size:0;padding:0;width:100%;margin-top:20px;">
                    </p>
                    <div id="cTMail-inner"
                      style="background-color:#fff; padding:23px 0 20px;box-shadow: 0px 1px 1px 0px rgba(122, 55, 55, 0.2);text-align:left;">
                      <table
                        style="width:100%;font-weight:300;margin-bottom:10px;border-collapse:collapse;text-align:left;">
                        <tbody>
                          <tr style="font-weight:300">
                            <td style="width:3.2%;max-width:30px;"></td>
                            <td style="max-width:480px;text-align:left;">
                              <h1 id="cTMail-title" style="font-size: 20px; line-height: 36px; margin: 0px 0px 22px;">
                                【QuickChart】${title}。
                              </h1>
                              <p id="cTMail-userName" style="font-size:14px;color:#333; line-height:24px; margin:0;">
                                尊敬的用户，您好！
                              </p>
                              <p style="line-height: 24px;font-size: 14px; margin: 6px 0px 0px; overflow-wrap: break-word; word-break: break-all;">
                                您的验证码是：<strong style="color: #ffae34;">${code}</strong>
                              </p>
                              <p class="cTMail-content"
                                style="line-height: 24px;font-size: 14px; font-weight: bold; margin: 6px 0px 0px; overflow-wrap: break-word; word-break: break-all;">
                                如非本人操作请忽略，切勿将验证码发送给他人。
                              </p>
                              <p class="cTMail-content"
                                style="line-height: 24px; margin: 6px 0px 0px; overflow-wrap: break-word; word-break: break-all;">
                                <span style="color: rgb(51, 51, 51); font-size: 14px;">
                                  <br>
                                  验证码5分钟内有效，请尽快使用。
                                  <br>
                                </span>
                              </p>
                              <dl style="font-size: 14px; color: rgb(51, 51, 51); line-height: 18px;">
                                <dd style="margin: 0px 0px 6px; padding: 0px; font-size: 12px; line-height: 22px;">
                                  <p id="cTMail-sender"
                                    style="font-size: 14px; line-height: 26px; word-wrap: break-word; word-break: break-all; margin-top: 32px;">
                                    此致
                                    <br>
                                    <strong>QuickChart</strong>
                                  </p>
                                </dd>
                              </dl>
                            </td>
                            <td style="width:3.2%;max-width:30px;"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div id="cTMail-copy" style="text-align:center; font-size:12px; line-height:18px; color:#999">
                      <table style="width:100%;font-weight:300;margin-bottom:10px;border-collapse:collapse">
                        <tbody>
                          <tr style="font-weight:300">
                            <td style="width:3.2%;max-width:30px;"></td>
                            <td style="max-width:540px;">
                              <p style="text-align:center; margin:20px auto 14px auto;font-size:12px;color:#999;">
                                此为系统邮件，请勿回复。
                              </p>
                            </td>
                            <td style="width:3.2%;max-width:30px;"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </span>
    </div>
  </div>
  `
}