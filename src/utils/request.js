import axios from 'axios';
import { Message, Loading } from 'element-ui';
import config from '@/config'

let loadingInstance = null;

// 创建 axios 实例
const service = axios.create({
  baseURL: config.API_BASE_URL || '/api',
  timeout: 10000
});
// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || '';

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
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    return config;
  },
  error => {
    loadingInstance && loadingInstance.close();
    Message.error('请求失败');
    return Promise.reject(error);
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
      (res.coSde == 200 ||
        res.Code == 1 ||
        res.status == 200 ||
        res.statusCode == '200' ||
        res.ErrorCode == '-100')
    ) {
      return res.data ?? res;
    }

    // 2. 如果是对象但无状态标识（直接返回）
    if (typeof res === 'object' && !('code' in res) && !('status' in res)) {
      return res;
    }

    // 3. 如果直接返回数组、字符串、数字
    if (Array.isArray(res) || typeof res === 'string' || typeof res === 'number') {
      return res;
    }

    // 4. 其他情况视为错误
    Message.error(res.message || res.msg || res || '请求失败');
    return Promise.reject(new Error(res.message || res.msg || res.Msg || res || '请求失败'));
  },
  error => {
    loadingInstance && loadingInstance.close();
    // console.log(error,'err!!');
    if(error.message == 'Network Error'){
      Message.error('网络错误，-1');
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
  const token = config.customToken || localStorage.getItem('token') || '';
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

export default service;
