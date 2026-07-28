---
title: 解决致命问题：前端直接调用大模型密钥泄露 + 跨域 CORS 彻底解决方案
date: 2026-06-05 08:20:00
categories:
  - AI专栏
tags:
  - 项目实战
  - AI
top_img: /img/bj.jpg
cover: /img/cat.jpg
---

# 《解决致命问题：前端直接调用大模型密钥泄露 + 跨域 CORS 彻底解决方案》

## 前言

本专栏前三篇落地流程回顾：

1. 实操1：Hexo原生前端直接fetch大模型接口，快速实现博客AI弹窗；
2. 实操2：前端直连踩坑，发现跨域报错、CSP拦截、密钥明文泄露隐患；
3. 实操3：Flask+Vue前后端分离，多厂商大模型统一接口调用。

本地运行项目正常，但部署Github Pages后出现两个致命BUG：

1. **密钥明文写在前端JS**：浏览器F12源码可直接复制SK密钥，极易被盗刷扣费、账号封禁；
2. **跨域CORS报错**：浏览器同源策略拦截跨域请求，CSP安全策略封禁第三方域名接口。

本篇采用**后端中转代理**企业标准方案：`Vue前端 → 自己的Flask后端 → 各大模型API`，密钥全程保存在后端，一次性解决泄露+跨域两个问题，兼容DeepSeek/豆包/通义千问全部模型。

## 一、原理通俗讲解

### 1、密钥为什么不能放前端

前端所有JS、打包后的代码全部暴露在客户端浏览器，任何人打开开发者工具就能查看`Authorization:Bearer sk-xxx`密钥，盗用后消耗你的API余额。

> 正确逻辑：密钥只存在服务器后端，前端永远接触不到原始密钥。

### 2、跨域CORS报错原因

浏览器安全规则：**协议、域名、端口任意一个不一样 = 跨域拦截**

* 你的博客域名：`xxx.github.io`
* 大模型接口域名：`ark.cn-beijing.volces.com`  
  域名不一致，浏览器直接拦截请求，本地localhost调试无问题，上线必报错。

### 最终安全架构

前端只请求自己写的Flask接口，由后端代为转发请求各大模型。

## 二、后端依赖安装（分项安装）

### 1、新增跨域依赖 flask-cors

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install flask-cors ``` |

2、原有项目必备依赖（没有就重装）

|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` 运行 pip install flask pip install openai pip install python-dotenv ``` |

三、后端项目改造（ai-backend）  
项目目录

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` ai-backend/ ├─ .env        # 密钥配置（只后端读取） └─ app.py      # 中转接口代码 ``` |

① .env 配置文件  
env

# 三家模型密钥

|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` DEEPSEEK_KEY=填自己DeepSeek的sk DOUBAO_KEY=填火山方舟sk DOUBAO_EP_ID=豆包ep-xxxx模型ID TONGYI_KEY=通义千问sk ``` |

② app.py 完整代码（带 CORS 跨域 + 安全中转）

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` 运行 from flask import Flask, request, jsonify from openai import OpenAI from dotenv import load_dotenv import os ``` |

# 导入跨域组件

from flask\_cors import CORS

# 加载环境变量

load\_dotenv()  
app = Flask(**name**)

# =========CORS跨域配置=========

# 方式1：本地开发，放行所有域名（调试用）

CORS(app)

# 方式2：生产上线，只放行自己博客域名（推荐）

# CORS(app, origins=[“https://你的用户名.github.io”])

# 多模型配置字典

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 ``` | ``` MODEL_CONFIG = {     "deepseek": {         "api_key": os.getenv("DEEPSEEK_KEY"),         "base_url": "https://api.deepseek.com",         "model_name": "deepseek-chat"     },     "doubao": {         "api_key": os.getenv("DOUBAO_KEY"),         "base_url": "https://ark.cn-beijing.volces.com/api/v3",         "model_name": os.getenv("DOUBAO_EP_ID")     },     "tongyi": {         "api_key": os.getenv("TONGYI_KEY"),         "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",         "model_name": "qwen-turbo"     } } ``` |

# 统一调用大模型函数

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` def get_ai_result(model_type, user_text):     cfg = MODEL_CONFIG[model_type]     client = OpenAI(api_key=cfg["api_key"], base_url=cfg["base_url"])     res = client.chat.completions.create(         model=cfg["model_name"],         messages=[{"role": "user", "content": user_text}]     )     return res.choices[0].message.content ``` |

# 对外唯一接口，前端只访问这个地址

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 ``` | ``` @app.post("/api/chat") def chat():     # 接收前端传参：模型类型、提问内容     json_data = request.get_json()     model = json_data.get("model")     msg = json_data.get("msg")     # 后端内部请求大模型，前端看不到密钥     ai_content = get_ai_result(model, msg)     return jsonify({"code":200,"data":ai_content})  if __name__ == '__main__':     # 上线必须关闭debug=True，防止源码泄露     app.run(host="127.0.0.1", port=5000, debug=False) ``` |

后端启动命令

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` 运行 cd ai-backend python app.py ``` |

启动地址：<http://127.0.0.1:5000/api/chat>  
四、Vue 前端改造（ai-front）  
重点：删除所有大模型原始地址、SK 密钥，只请求自己后端  
src/App.vue 完整代码

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 ``` | ``` <template>   <div style="max-width:700px;margin:30px auto;padding:0 20px">     <h2 align="center">安全版多模型AI问答（后端中转）</h2>     <div style="border:1px solid #eee;height:460px;overflow-y:auto;padding:12px;border-radius:8px;margin-bottom:15px">       <div v-for="(item,idx) in chatList" :key="idx" style="margin:10px 0;">         <p><b>{{item.role}}：</b>{{item.content}}</p>       </div>     </div>     <div>       <select v-model="selectModel" style="padding:7px;margin-right:8px">         <option value="deepseek">DeepSeek大模型</option>         <option value="doubao">豆包方舟大模型</option>         <option value="tongyi">通义千问</option>       </select>       <input v-model="inputMsg" placeholder="输入提问" style="width:72%;padding:7px"/>       <button @click="sendMsg" style="padding:7px 12px;margin-left:6px">发送</button>     </div>   </div> </template> <script setup> import {ref} from 'vue' import axios from 'axios' const inputMsg = ref('') const selectModel = ref('deepseek') const chatList = ref([])  async function sendMsg(){   if(!inputMsg.value.trim()) return   chatList.push({role:"我",content:inputMsg.value})   // 仅请求自己后端，无任何大模型密钥   const res = await axios.post("http://127.0.0.1:5000/api/chat",{     model: selectModel.value,     msg: inputMsg.value   })   chatList.push({role:"AI",content:res.data.data})   inputMsg.value = '' } </script> ``` |

前端启动

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` 运行 npm run dev ``` |

上线部署：后端放到云服务器，把127.0.0.1:5000替换成服务器公网 IP。  
五、Hexo 博客接入步骤  
前端打包

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` 运行 npm run build ``` |

dist 文件夹全部放入 Hexo source/ai-chat；  
主题footer.ejs粘贴悬浮弹窗 HTML；

|  |  |
| --- | --- |
| ``` 1 ``` | ``` hexo clean && hexo g && hexo d ``` |

部署。  
六、进阶安全：接口简易鉴权（防止别人刷接口）  
1、.env 新增自定义密钥  
env  
APP\_TOKEN=自定义一串随机字符123abc666  
2、接口添加校验

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 ``` | ``` 运行 @app.post("/api/chat") def chat():     json_data = request.get_json()     # 校验token     token_client = json_data.get("token")     token_server = os.getenv("APP_TOKEN")     if token_client != token_server:         return jsonify({"code":403,"msg":"非法访问"})     # 原有逻辑不变 ``` |

3、前端请求带上 token

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` axios.post("http://127.0.0.1:5000/api/chat",{     model: selectModel.value,     msg: inputMsg.value,     token:"自定义一串随机字符123abc666" }) ``` |

七、总结  
密钥全部保存在后端.env，前端零明文密钥，杜绝盗刷；  
flask-cors 配置跨域，彻底解决 CORS、CSP 拦截报错；  
遵循「前端→自有后端→大模型厂商」行业标准开发规范。