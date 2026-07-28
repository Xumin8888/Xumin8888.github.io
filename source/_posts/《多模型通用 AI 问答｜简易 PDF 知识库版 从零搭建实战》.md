---
title: 多模型通用 AI 问答｜简易 PDF 知识库版 从零搭建实战
date: 2026-06-02 14:30:00
categories:
  - AI专栏
tags:
  - 项目实战
  - RAG
  - AI
top_img: /img/bj.jpg
cover: /img/3.jpg---

## 《多模型通用 AI 问答｜简易 PDF 知识库版 从零搭建实战》

> 项目实现：通义千问 / 智谱 GLM / 豆包三大模型接入 + PDF 本地文档问答，抛弃复杂 FAISS 向量库，轻量化开箱即用。

## 一、项目概述

本项目采用 **Flask 后端 + Vue 前端** 实现多模型对话系统，分为两种使用模式：

1. **普通闲聊对话**：直接调用大模型自由问答
2. **PDF 知识库问答**：上传本地 PDF，AI 依托文档内容精准作答

**踩坑优化重点：**

最初选用`FAISS+Embedding向量`做知识库，频繁出现索引损坏、向量接口密钥不兼容、扫描 PDF 无法入库等 BUG；最终**彻底移除 FAISS、向量模型**，改用`PDF全文提取+上下文拼接`极简方案，稳定性拉满，新手零报错。

## 二、环境依赖安装

运行

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install flask openai python-dotenv PyPDF2 ``` |

* `flask`：搭建后端 Web 接口
* `openai`：统一兼容格式调用三家大模型 API
* `python-dotenv`：读取`.env`密钥配置文件
* `PyPDF2`：PDF 文本解析提取

## 三、密钥配置 .env

项目根目录新建`.env`文件，统一存放各平台 Key：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` # 火山方舟-豆包 DOUBAO_KEY=ark-xxxx # 智谱大模型 ZHIPU_KEY=sk-xxxx # 阿里通义千问 QWEN_KEY=sk-xxxx ``` |

## 四、后端核心代码示例（app.py）

运行

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 ``` | ``` from flask import Flask, request, jsonify, Response, stream_with_context from openai import OpenAI from dotenv import load_dotenv import os  load_dotenv() app = Flask(__name__)  # 全局跨域配置，解决前端CORS报错 @app.after_request def add_cors_headers(response):     response.headers['Access-Control-Allow-Origin'] = '*'     response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'     response.headers['Access-Control-Allow-Headers'] = 'Content-Type'     return response @app.route('/<path:path>', methods=["OPTIONS"]) def opt(path):     return "",200  # 三大模型统一配置 MODEL_MAP = {     "doubao":{         "key":os.getenv("DOUBAO_KEY"),         "url":"https://ark.cn-beijing.volces.com/api/v3",         "model":"ep-xxxx 替换为自己火山方舟模型ID"     },     "zhipu":{         "key":os.getenv("ZHIPU_KEY"),         "url":"https://open.bigmodel.cn/api/paas/v4/",         "model":"glm-4-flash"     },     "qwen":{         "key":os.getenv("QWEN_KEY"),         "url":"https://dashscope.aliyuncs.com/compatible-mode/v1",         "model":"qwen-turbo"     } }  # 全局变量缓存PDF全文 pdf_content = ""  # PDF上传接口 @app.post("/api/upload_pdf") def upload():     global pdf_content     f = request.files["pdf"]     f.save("tmp.pdf")     from PyPDF2 import PdfReader     reader = PdfReader("tmp.pdf")     txt = ""     for page in reader.pages:         t = page.extract_text()         if t:             txt += t     pdf_content = txt     return jsonify({"code":200,"msg":"上传成功，文档已载入"})  # 清空知识库接口 @app.post("/api/clear_kb") def clear():     global pdf_content     pdf_content = ""     if os.path.exists("tmp.pdf"):         os.remove("tmp.pdf")     return jsonify({"code":200,"msg":"知识库清空完毕"})  # 流式生成回复 def stream_generate(model_type,prompt):     cfg = MODEL_MAP[model_type]     cli = OpenAI(api_key=cfg["key"],base_url=cfg["url"])     s = cli.chat.completions.create(model=cfg["model"],messages=[{"role":"user","content":prompt}],stream=True)     for ch in s:         if ch.choices and ch.choices[0].delta.content:             yield ch.choices[0].delta.content  # 普通对话流式接口 @app.post("/api/chat_stream") def chat_stream():     d = request.get_json()     return Response(stream_generate(d["model"],d["msg"]),mimetype="text/event-stream")  # PDF知识库问答流式接口 @app.post("/api/chat_pdf_stream") def pdf_stream():     d = request.get_json()     q = d["msg"]     global pdf_content     if not pdf_content:         prompt = "没有上传任何文档，请先上传PDF"     else:         prompt = f"""参考下面文档内容回答问题，只根据文档作答 【文档内容】 {pdf_content} 【问题】{q}"""     return Response(stream_generate(d["model"],prompt),mimetype="text/event-stream")  if __name__ == '__main__':     app.run(host="127.0.0.1",port=5000,debug=True) ``` |

## 五、接口说明

| 接口地址 | 请求方式 | 功能 |
| --- | --- | --- |
| `/api/upload_pdf` | POST | 接收 PDF，提取全文存入内存 |
| `/api/clear_kb` | POST | 清空内存文档、删除临时文件 |
| `/api/chat_stream` | POST | 普通对话流式输出 |
| `/api/chat_pdf_stream` | POST | PDF 文档专属问答 |

## 六、前端使用操作指南

### 1. 普通对话

1. 勾选「普通对话」
2. 下拉选择：豆包 / 智谱 / 通义千问
3. 输入问题发送即可闲聊

### 2. PDF 知识库问答（固定操作顺序）

1. 勾选「PDF 知识库问答」
2. 先点击**清空知识库**，清理上次残留文档
3. 选择本地 PDF 上传，弹窗提示`上传成功`
4. 围绕 PDF 内容提问，AI 仅依据文档内容作答

> ⚠️ 局限：当前为全文拼接上下文，适合中小型 PDF；超大文件会超出 LLM 上下文上限。

## 七、踩坑总结（干货重点）

### 1. FAISS 方案踩坑（废弃原因）

1. **向量参数不兼容**：OpenAIEmbedding 和通义、智谱向量接口参数格式不一致，400/404 报错；
2. **FAISS 索引极易损坏**：中途关闭程序、PDF 无有效文字，直接造成`faiss_db`索引破损，全部检索 500；
3. **扫描 PDF 无法解析**：图片版 PDF 提取不到文字，向量库为空，查询无结果。

### 2. 最终优化方案

**剔除 FAISS + 所有 Embedding 向量依赖**，直接提取 PDF 全文拼接 Prompt 送入大模型，从根源消灭上述全部异常。

### 3. 跨域问题

后端全局配置 CORS 响应头 + OPTIONS 放行，解决前端`5173`和后端`5000`端口跨域拦截。

## 八、项目启动

运行

|  |  |
| --- | --- |
| ``` 1 ``` | ``` python app.py ``` |

启动成功：`Running on http://127.0.0.1:5000`，前端 Vue 项目对接接口即可。

## 九、后续优化方向

1. 支持多 PDF 同时上传管理
2. 超长文档自动摘要截取，规避上下文超限
3. 增加 FAISS 向量 / 全文检索双模式一键切换