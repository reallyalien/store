import axios from 'axios'
import {Message} from 'element-ui'
import el from 'element-ui/src/locale/lang/el'
//插件必须提供一个install方法
const MyAxios = {}
MyAxios.install = function (Vue) {
  //给vue实例添加一个成员
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 添加请求拦截器
  //发送请求之前，判断当前请求是否是login，如果是继续执行，如果不是需要携带token
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //获取请求路径，设置请求头

    if (config.url.toLocaleLowerCase() !== 'login'){
      //设置请求头
      let token = window.sessionStorage.getItem('token')
      config.headers.common['Authorization']=token;
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

// 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    const {meta:{status,msg}}=response.data;
    if (status === 200 || status ===201){

    }else{
      Message.error(msg);
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}
export default MyAxios
