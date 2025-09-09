import config from '@/config'
function CombineFullUrl(url) {
  let baseURL =  config.API_BASE_URL || '/api'
  return `${baseURL}${url}`;
}
/**
 * 用于AI会话的流式fetch请求
 * @param {string} url - 请求地址（相对或绝对）
 * @param {object} data - 请求体内容
 * @param {object} headers - 额外headers配置（可选）
 * @param {AbortController} externalController - 可选，外部传入的AbortController
 * @returns {object} - { responsePromise, controller }，responsePromise为fetch原始响应Promise，controller用于中断
 */

export async function fetchAIStream(options = {}, externalController) {
  const fullUrl = CombineFullUrl(options.url);
  let headers = {
    ...options.headers,
    "Accpect": "text/event-stream",
  };
  if(!options.isFormData){
    headers["Content-Type"] = "application/json";
    
  }
  // 自动带上token（如有）
  try {
    const info = localStorage.getItem('token') || '';  
    if (info) {
      headers["Authorization"] = `Bearer ${info}`;
    }
  } catch (e) {}

  const controller = externalController || new AbortController();
  const fetchOptions = {
    method: "POST",
    headers,
    body: options.data,
    signal: controller.signal,
    ...options,
  };

  const responsePromise = await fetch(fullUrl, fetchOptions);

  return { responsePromise, controller };
}

export default {
  fetchAIStream,
};
