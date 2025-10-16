import axios from 'axios';
import { Message, Loading , MessageBox  } from 'element-ui';
import config from '../config'

let loadingInstance = null;

// 创建 axios 实例
console.log(config.API_BASE_URL,'config.API_BASE_URL');

const service = axios.create({
  baseURL: config.API_BASE_URL||'/api',
  timeout: 60 * 1000
});
// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('boardToken') || '';

    // 特定接口不显示 loading
    if (!config.disableGlobalLoading) {
      loadingInstance = Loading.service({
        fullscreen: true,
        text: '加载中，请稍后...',
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.1)"
      });
    }

    // 特定接口不需要 token
    // if (
    //   config.url.indexOf("api/chat_stream") === -1 && token
    // ) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    if (
        token
      ) {
        config.headers['Authorization'] = `${token}`;
      }
    return config;
  },
  error => {
    loadingInstance && loadingInstance.close();

    const showError = Throttle((error) => {
      MessageBox.alert(error.message || '请求失败，-1', "提示", {
        confirmButtonText: "确定",
        type: "warning",
        showClose: false
      });
    }, 2000);
    
    // 调用
    showError(error);
    return error;
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    loadingInstance && loadingInstance.close();
    let res = response.data;
    console.log(res, 'res');

    // 1. 如果是对象且带状态标识
    if (
      typeof res === 'object' &&
      (
        res.status == 200
    )) {
      return res.data ?? res;
    }

    // 2. 特定对象（直接返回）
    // if (response.config.url.indexOf("") > -1)) {
    //   return response;
    // }

    return res;
  },
  error => {
    loadingInstance && loadingInstance.close();
    if (
      // 网络错误
      error.message.indexOf("code 500") !== -1 ||
      error.message.indexOf("code 502") !== -1 ||
      error.message.indexOf("code 503") !== -1 ||
      error.message.indexOf("code 504") !== -1
    ) {
      const showError = Throttle((error) => {
        MessageBox.alert('网络错误，-1', "提示", {
          confirmButtonText: "确定",
          type: "warning",
          showClose: false
        });
      }, 2000);
      showError(error);
    }
    else if (
      // 网络错误
      error.message.indexOf("code 401") !== -1
    ) {
      const showError = Throttle((error) => {
        MessageBox.alert('身份验证失效，请重新获取页面，-1', "提示", {
          confirmButtonText: "确定",
          type: "warning",
          showClose: false
        });
      }, 2000);
      showError(error);
    }else if (
      // 网络错误
      error.message.indexOf("code 403") !== -1
    ) {
      const showError = Throttle((error) => {
        MessageBox.alert(error.message, "提示", {
          confirmButtonText: "确定",
          type: "warning",
          showClose: false
        });
      }, 2000);
      showError(error);
    }else if (error.message == 'Network Error'){
      const showError = Throttle((error) => {
        MessageBox.alert('网络错误，-1', "提示", {
          confirmButtonText: "确定",
          type: "warning",
          showClose: false
        });
      }, 2000);
      showError(error);
    }
    else{
      const showError = Throttle((error) => {
        MessageBox.alert(error.message || '请求失败，请联系管理员处理，-2', "提示", {
          confirmButtonText: "确定",
          type: "warning",
          showClose: false
        });
      }, 2000);
      showError(error);
    }
    return error;
  }
);

/**
 *  动态请求方法（支持跳过统一拦截）
 * @param {Object} config - axios 请求配置
 */
export function requestWithCustomURL(
  config
) {
  // if (config.customBaseURL) {
    config.baseURL = config.customBaseURL || '';
  // }

  // 动态设置 token
  const token = config.customToken || localStorage.getItem('boardToken') || '';
  if (token) {
    if (config.tokenType === 'Bearer') {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`
      };
    } else if (config.tokenType === 'token') {
      config.headers = {
        ...(config.headers || {}),
        token: token
      };
    }
  }

  // 跳过拦截器：直接返回 axios 原始数据
  if (config.skipIntercept) {
    return axios(config);
  }

  return service(config);
}


function Throttle(func, delay = 2000) {
  let canRun = true; // 每个函数独立状态
  return function(...args) {
    if (!canRun) return;
    canRun = false;
    func.apply(this, args);
    setTimeout(() => {
      canRun = true;
    }, delay);
  };
}


export default service;
