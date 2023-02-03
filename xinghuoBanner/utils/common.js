
// 节流
export const throttle = (fn, timer = 500) => {
  let preTime
  return function (params) {
    const nowTime = new Date()
    if (!preTime || nowTime - preTime > timer) {
      fn.call(this, params)
      preTime = nowTime
    }
  }
}
/** 跳转 */
export const turnPage = url => {
  if (!url) return
  setTimeout(() => {
    window.location.href = url
  }, 200)
}
/** 获取客户端设备类型 */
export function terminal () {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return 'android'
  } else {
    return 'ios'
  }
}
/** 获取客户端机型信息 */
export function getNetWorkType () {
  var ua = navigator.userAgent
  console.log('&&&&&&&&&&&&&&&&浏览器信息****wss', navigator)
  var res = ua.match(/\(nt:([^,\)]*)(,|\))/);  // eslint-disable-line
  if (res) {
    // MDN(res[1]);
    console.log(res)
    return res[1]
  } else {
    // MDN('other');
    return 'other'
  }
}

export function getBrowser () {
  var ua = navigator.userAgent.toLowerCase()
  var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/

  function toString (object) {
    return Object.prototype.toString.call(object)
  }

  function isString (object) {
    return toString(object) === '[object String]'
  }
  var ENGINE = [
    ['trident', re_msie],
    ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/], // eslint-disable-line
    ['gecko', /\bgecko\/(\d+)/],
    ['presto', /\bpresto\/([0-9.]+)/]
  ]
  var BROWSER = [
    ['ie', re_msie],
    ['firefox', /\bfirefox\/([0-9.ab]+)/],
    ['opera', /\bopr\/([0-9.]+)/],
    ['chrome', / (?:chrome|crios|crmo)\/([0-9.]+)/],
    ['safari', /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//]
  ]
  // 操作系统信息识别表达式
  var OS = [
    ['windows', /\bwindows nt ([0-9.]+)/],
    ['ipad', 'ipad'],
    ['ipod', 'ipod'],
    ['iphone', /\biphone\b|\biph(\d)/],
    ['mac', 'macintosh'],
    ['linux', 'linux']
  ]
  var IE = [
    [6, 'msie 6.0'],
    [7, 'msie 7.0'],
    [8, 'msie 8.0'],
    [9, 'msie 9.0'],
    [10, 'msie 10.0']
  ]
  var detect = function (client, ua) {
    for (var i in client) {
      var name = client[i][0]
      var expr = client[i][1]
      var isStr = isString(expr)
      var info
      if (isStr) {
        if (ua.indexOf(expr) !== -1) {
          info = name
          return info
        }
      } else {
        if (expr.test(ua)) {
          info = name
          return info
        }
      }
    }
    return 'unknow'
  }
  return {
    os: detect(OS, ua), // 操作系统
    browser: detect(BROWSER, ua), // 浏览器
    engine: detect(ENGINE, ua), // 内核
    // 只有IE才检测版本，否则意义不大
    version: re_msie.test(ua) ? detect(IE, ua) : ''
  }
}

/**
 * 获取uuid 10min内无操作则变更uuid，否则取缓存内uuid
 */
export const getUuidv4 = () => {
  const uuid_v4_info = JSON.parse(localStorage.getItem('uuid_v4_info') || '{}')
  const { uuid_v4, uuid_timestamp } = uuid_v4_info || {}
  const nowTime = new Date().getTime()
  if (nowTime - uuid_timestamp < 10 * 60 * 1000 && uuid_v4) {
    // localStorage.setItem('uuid_v4_info',{})
    localStorage.setItem(
      'uuid_v4_info',
      JSON.stringify({
        uuid_v4,
        uuid_timestamp: new Date().getTime(), // 重置时间戳
      }),
    )
    return uuid_v4
  }
  const newUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  localStorage.setItem(
    'uuid_v4_info',
    JSON.stringify({
      uuid_v4: newUuid,
      uuid_timestamp: new Date().getTime(), // 重置时间戳
    }),
  )
  return newUuid
}
