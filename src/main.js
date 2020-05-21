// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';//包的概念，默认有一个index.js或者package.json
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';

import moment from 'moment';

import myAxios from '@/plugins/MyAxios';


Vue.config.productionTip = false;//不输出控制台相关信息
//时间过滤器格式化日期
Vue.filter('fmtDate',(value,fmtString)=>{
  return moment(value).format(fmtString);
})
//注册插件
Vue.use(ElementUI);
Vue.use(myAxios);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
