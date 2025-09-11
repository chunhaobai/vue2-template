# ai-assistant

这是一个 Vue2 项目的通用模板，包含以下内容：
- Vue2
- vue-router
- element-ui（全局引入）
- axios 封装
- SCSS 支持
- GtTable 二次封装表格

## 使用方式
```bash
git clone  git@github.com:chunhaobai/vue2-template.git my-new-project
cd my-new-project
npm install
npm run serve
npm run build


## request接口使用方式
```bash
import request from "@/utils/request";
const postData = {}
request({
  url: "api/getData",
  data: postData,
  method: "post",
  disableGlobalLoading: true, 是否关闭请求加载
})
.then((res) => { 

}).catch((res) => {

})
import { requestWithCustomURL } from "@/utils/request";
requestWithCustomURL({
url: "api/chat_stream", 
method: "post",
data: {
  Cid: "",
  classid: this.selectedOrg,
  prompt: Msgdata,
  username: localStorage.getItem("userInfo"),
},
customBaseURL: this.AiUrl || "",  其他接口地址
customToken: "", 指定token
tokenType: "", token类型
disableGlobalLoading: true,  是否需要加载
skipIntercept: false, 是否进入拦截器
});
## fetch接口使用方式
```bash
import { fetchAIStream } from "@/utils/fetch";
 const { responsePromise, controller } = await fetchAIStream({
  url: `api/ai/extract`,
  data: JSON.stringify(postData),
});
this.controller = controller;
if (!responsePromise.ok) {
    this.isGetfetchData = false;
    this.loadingDialogVisible = false;
    throw new Error(`HTTP error! status: ${responsePromise.status}`);
  }
 const reader = responsePromise.body
    .pipeThrough(new TextDecoderStream())
    .getReader();
  let buffer = ""; // 缓冲区
  while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += value;
  }

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
