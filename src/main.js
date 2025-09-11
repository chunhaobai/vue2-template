import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Decimal } from 'decimal.js';
Vue.prototype.Decimal = Decimal;
Vue.use(ElementUI)

// ✅ Vue 内部错误（生命周期、methods 等）
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue 错误>>>>>>', err)
  console.error('出错组件>>>>>>', vm)
  console.error('错误信息>>>>>>', info)

  // TODO: 这里可以调用你的接口，把错误上报到服务器
  // reportError({ type: 'vue', err, info })
}

// ✅ 原生 JS 错误（语法错误、运行时报错）
window.onerror = (msg, url, line, col, error) => {
  console.error('JS 错误>>>>>>', msg, url, line, col, error)
  // reportError({ type: 'js', msg, url, line, col, error })
}

// ✅ Promise 错误（未 catch 的 reject）
window.addEventListener('unhandledrejection', event => {
  console.error('Promise 错误>>>>>>', event.reason)
  // reportError({ type: 'promise', reason: event.reason })
})

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
