import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// 加载配置函数
function loadConfig() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `/config.js?t=${Date.now()}`
    script.onload = () => {
      const params = getHashQueryParams() //获取游览器地址数据内容
      const config = window.GET_CONFIG || {}

      // 存储配置项到 localStorage（也可以不存，直接挂原型）
      // localStorage.setItem('Url', config.API_URL)
      
      if(params.token){
        config.DEFAULT_TOKEN = params.token
      }
      let token = config.DEFAULT_TOKEN || ''

      
      if (token) localStorage.setItem('token', token)

      // 挂载到 Vue 原型
      Vue.prototype.$config = config
      Vue.prototype.$token = token
      Vue.prototype.$userInfo = userInfo

      resolve()
    }
    script.onerror = () => {
      reject(new Error('配置文件加载失败'))
    }
    document.head.appendChild(script)
  })
}

function getHashQueryParams() {
  const hash = window.location.hash || ''
  const queryString = hash.includes('?') ? hash.split('?')[1] : ''
  const params = new URLSearchParams(queryString)
  const result = {}

  for (const [key, value] of params.entries()) {
    result[key] = value
  }

  return result
}
// 启动程序
loadConfig()
  .then(() => {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  })
  .catch(err => {
    console.error('启动失败：', err)
    alert('配置文件加载失败，系统无法启动。')
  })
