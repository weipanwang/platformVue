import Vue from 'vue'
export function setCookie(cName, value, expire) {
  var date = new Date()
  date.setSeconds(date.getSeconds() + expire)
  document.cookie = cName + '=' + escape(value) + '; expires=' + date.toGMTString()
}
export function getCookie(cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}
export function delCookie(cName) {
  setCookie(cName, '', -1)
}
export async function getisLogin(token) {
  // console.log(token)
  const { data: res } = await Vue.prototype.$http.get('/user/islogin?token=' + token)
  // console.log(res)
  return res
}
