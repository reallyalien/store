import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/login';
//extensions: ['.js', '.vue', '.json'],扩展名称，默认会按照这个顺序寻找，所以这里省略了后缀名称

Vue.use(Router);

export default new Router({
  routes: [
    {name:'login',path:'/login',component:Login},
  ]
});
