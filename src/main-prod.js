import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import  VueQuillEditor  from 'vue-quill-editor'


//导入NProgress
import NProgress from 'nprogress'


Vue.config.productionTip = false

import axios from 'axios'
//axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'

//request拦截器
axios.interceptors.request.use(config =>{
  config.headers.authorization =window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
//response拦截器中隐藏进度条
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})


Vue.prototype.$http =axios
Vue.component('tree-table',TreeTable)

Vue.use(VueQuillEditor)

Vue.filter('dateFormat',function(originVal){
  const dt =new Date(originVal)
  const y=dt.getFullYear()
  const m = (dt.getMonth()+1 +'').padStart(2,'0')
  const d =(dt.getDate()+'').padStart(2,'0')

  const yy =(dt.getHours()+'').padStart(2,'0')
  const mm =(dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${yy}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


