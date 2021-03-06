import Vue from 'vue'
import VueRouter from 'vue-router'


const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const WelCome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/User.vue')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

const List = () => import(/* webpackChunkName: "goodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "goodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')
//import Login from '../components/Login.vue'
//import Home from '../components/Home.vue'
//import WelCome from '../components/welcome.vue'

//import Users from '../components/user/User.vue'
//import Rights from '../components/power/Rights.vue'
//import Roles from '../components/power/Roles.vue'
//import Cate from '../components/goods/Cate.vue'
//import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'




Vue.use(VueRouter)

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/WelCome',
    children:[
      {path:'/WelCome',component:WelCome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report}
    ]
  }
]

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  if(to.path==='/login') return next();
  const tokenstr = window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
  
})
export default router
