import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Users from '@/views/users/users'
import Rights from '@/views/rights/rights'
import Roles from '@/views/rights/roles'
import fr from 'element-ui/src/locale/lang/fr'
import el from 'element-ui/src/locale/lang/el'
//导入message
import {Message} from 'element-ui'

//extensions: ['.js', '.vue', '.json'],扩展名称，默认会按照这个顺序寻找，所以这里省略了后缀名称

Vue.use(Router)

const router=new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {name: 'users', path: '/users', component: Users},
        {name: 'rights', path: '/rights', component: Rights},
        {name: 'roles', path: '/roles', component: Roles},
      ]
    }
  ]
})
//路由的全局前置守卫,路由跳转之前执行
//to from 路由规则对象
router.beforeEach((to,from,next)=>{
  //判断登录的时候不需要token，不是登录需要token
  if (to.name && to.name.toLocaleLowerCase() !== 'login'){
    //判断token
    let token = window.sessionStorage.getItem('token')
    if (!token){
      //跳转到登录
      router.push('/login');
      //提示
      Message.warning("请先登录");
      return;//没有token别走下面逻辑
    }
  }
  next();
})
export default router
