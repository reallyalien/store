import axios from 'axios'

//插件必须提供一个install方法
const MyAxios = {}
MyAxios.install = function (Vue) {
  //给vue实例添加一个成员
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  let token = window.sessionStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = token
  Vue.prototype.$http = axios
}
export default MyAxios
