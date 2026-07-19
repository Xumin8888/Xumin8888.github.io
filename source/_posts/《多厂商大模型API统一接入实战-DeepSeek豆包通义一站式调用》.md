---
title: 《多厂商大模型 API 统一接入实战｜智谱 GLM / 火山豆包 / 通义千问一站式调用》
date: 2026-06-01 07:30:00
tags: [Python, Flask, Vue, 大模型API]
cover: /img/cat.jpg
---

# 《多厂商大模型 API 统一接入实战｜智谱 GLM / 火山豆包 / 通义千问一站式调用》

## 前言

日常开发 AI 网页项目时，经常需要对接多家大模型厂商：火山方舟豆包、智谱 GLM、阿里通义千问。各家接口地址、入参格式各不相同，逐个写调用代码冗余繁琐。本文基于`openai`通用 SDK + Flask 后端，**一套代码兼容全平台国产免费大模型**，搭配 Vue 前端快速搭建网页问答机器人，零基础可落地完整前后端项目，三款模型均自带大额免费调用额度，个人开发零成本。

## 一、前期准备：密钥与环境安装

### 1、平台密钥申领清单

1. **火山方舟（豆包）**：火山引擎方舟控制台创建 API-KEY + 在线推理`ep-xxxx`专属模型 ID
2. **智谱 AI（GLM-4-Flash）**：智谱开放平台生成 sk 开头密钥，新用户赠送 2000 万免费 Token，长期免费用
3. **阿里通义 DashScope**：阿里云百炼灵积平台创建 API 密钥，开通`qwen-turbo`调用权限

> 新建记事本统一保存所有密钥，后续放到`.env`配置文件读取使用，杜绝密钥硬编码。

### 2、Python 依赖分项安装

项目一共需要 4 个第三方依赖包，分开说明作用与安装命令：

1. **flask**：搭建后端 Web 服务，向外提供接口

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install flask ``` |

openai：通用兼容 SDK，国产大模型全部适配 OpenAI 调用规范，统一对接多模型

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install openai ``` |

python-dotenv：读取.env 配置文件，密钥外置存放，避免明文泄露到代码

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install python-dotenv ``` |

langchain：后续拓展知识库、多轮上下文对话使用，可选安装

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install langchain ``` |

懒人一键全装：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install flask openai python-dotenv langchain ``` |

## 二、Flask 后端：多模型统一封装接口

1、项目结构

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` ai-backend/ ├─ .env      # 存放各家密钥 └─ app.py    # 统一接口服务 ``` |

### .env 配置文件

|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` # 各家大模型密钥，等号前后禁止加空格 DOUBAO_KEY=你的火山方舟密钥 ZHIPU_KEY=你的智谱AI密钥 QWEN_KEY=你的通义千问密钥 ``` |

### app.py 统一调度代码（含跨域 + 异常捕获，解决 CORS 与接口崩溃）

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 ``` | ``` from flask import Flask, request, jsonify from openai import OpenAI, APIStatusError from dotenv import load_dotenv import os  load_dotenv() app = Flask(__name__)  # 全局跨域配置，解决前端CORS跨域报错 @app.after_request def add_cors_headers(response):     response.headers['Access-Control-Allow-Origin'] = '*'     response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'     response.headers['Access-Control-Allow-Headers'] = 'Content-Type'     return response  # 模型配置字典：统一封装各平台接口地址+模型标识 MODEL_MAP = {     "doubao":{         "key":os.getenv("DOUBAO_KEY"),         "url":"https://ark.cn-beijing.volces.com/api/v3",         "model":"替换为你的ep-xxxx模型ID"     },     "zhipu":{         "key":os.getenv("ZHIPU_KEY"),         "url":"https://open.bigmodel.cn/api/paas/v4/",         "model":"glm-4-flash"     },     "qwen":{         "key":os.getenv("QWEN_KEY"),         "url":"https://dashscope.aliyuncs.com/compatible-mode/v1",         "model":"qwen-turbo"     } }  # 通用大模型请求函数+异常捕获 def chat_answer(model_type, user_msg):     try:         cfg = MODEL_MAP[model_type]         client = OpenAI(api_key=cfg["key"], base_url=cfg["url"])         res = client.chat.completions.create(             model=cfg["model"],             messages=[{"role":"user","content":user_msg}]         )         return res.choices[0].message.content     except APIStatusError as err:         return f"接口调用异常：{str(err)}"     except Exception as e:         return f"服务异常：{str(e)}"  # 对外统一POST接口 @app.post("/api/chat") def chat_api():     data = request.get_json()     reply = chat_answer(data["model"], data["msg"])     return jsonify({"code":200, "data":reply})  if __name__ == '__main__':     app.run(host="127.0.0.1", port=5000, debug=True) ``` |

### 启动后端

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` cd ai-backend python app.py ``` |

服务运行在`http://127.0.0.1:5000`，前端统一调用`/api/chat`即可。

## 三、Vue3 前端：网页对话页面

1、创建 Vite+Vue 项目

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` mkdir ai-front && cd ai-front npm create vite@latest . -- --template vue ``` |

安装前端请求依赖 axios：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install axios ``` |

替换 src/App.vue 页面代码

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 ``` | ``` <template>   <div style="max-width:700px;margin:30px auto;padding:0 20px">     <h2 align="center">多模型通用AI问答</h2>     <div style="border:1px solid #eee;height:460px;overflow-y:auto;padding:12px;border-radius:8px;margin-bottom:15px">       <div v-for="(item,idx) in chatList" :key="idx" style="margin:10px 0;">         <p><b>{{item.role}}：</b>{{item.content}}</p>       </div>     </div>     <div>       <select v-model="selectModel" style="padding:7px;margin-right:8px">         <option value="doubao">豆包方舟大模型</option>         <option value="zhipu">智谱GLM免费大模型</option>         <option value="qwen">通义千问</option>       </select>       <input v-model="inputMsg" placeholder="输入提问" style="width:72%;padding:7px"/>       <button @click="sendMsg" style="padding:7px 12px;margin-left:6px">发送</button>     </div>   </div> </template> <script setup> import {ref} from 'vue' import axios from 'axios' const inputMsg = ref('') const selectModel = ref('doubao') // 默认选中豆包 const chatList = ref([])  async function sendMsg(){   if(!inputMsg.value.trim())return   chatList.value.push({role:"我",content:inputMsg.value})   try{     const res = await axios.post("http://127.0.0.1:5000/api/chat",{       model:selectModel.value,       msg:inputMsg.value     })     chatList.value.push({role:"AI",content:res.data.data})   }catch{     chatList.value.push({role:"AI",content:"请求出错，请检查后端服务"})   }   inputMsg.value = '' } </script> ``` |

### 启动前端预览

|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm run dev ``` |

打开页面即可自由切换三家大模型，完成问答交互。

## 四、项目拓展与上线优化

1.LangChain 拓展：引入 langchain 实现本地 PDF 知识库问答，上传文档后 AI 结合文档作答；

2.部署上线：后端部署云服务器，放行 5000 端口，前端接口替换为公网 IP，实现 24 小时在线；

3.Hexo 嵌入：前端打包`npm run build`，dist 静态资源放入 Hexo source/ai-chat，可做成博客右下角悬浮 AI 窗口。

## 五、踩坑小结

1. 国产模型大多兼容 OpenAI 调用格式，只需替换 base\_url 与密钥，极大降低多模型接入成本；
2. 密钥统一放`.env`，禁止明文写在代码内，防止上传 Github 泄露；
3. 前端不可直接裸写密钥请求 API，必须经过 Python 后端中转，规避密钥暴露、跨域 CSP 拦截问题；
4. 优先选用智谱 GLM-4-Flash，新用户超大免费额度，避开额度快速耗尽问题。

## 补充说明

三款模型全部为国产主流大模型，日常学习、博客内嵌 AI 对话完全够用，无高额付费门槛。