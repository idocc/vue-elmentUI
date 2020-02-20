import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import WelCome from '../components/welcome.vue'
import Users from '../components/user/User.vue'
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
      {path:'/users',component:Users}
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
