---
title: 多模型 AI 问答｜全文 / FAISS 向量双检索 + 多 PDF 上传
date: 2026-06-02 15:30:00
categories:
  - AI专栏
tags:
  - 项目实战
  - RAG
  - AI
top_img: /img/bj.jpg
cover: /img/4.jpg
---

# 《多模型 AI 问答（全文 / FAISS 向量双检索 + 多 PDF 上传）》

## 一、项目概况

前后端分离：**Flask (Python 后端)+Vue3 前端**，接入**豆包方舟、智谱 GLM、通义千问**三大大模型，实现两种对话模式：普通闲聊、PDF 知识库问答；

核心亮点：**全文检索 / FAISS 向量检索一键切换、支持多选批量上传 PDF、长文档自动分片防上下文溢出**。

> 开发踩坑：初期只用 FAISS 频繁索引损坏、向量类不兼容 LangChain 报错，优化后双方案并存，小文档用全文、大文档用向量。

## 二、环境安装

运行

|  |  |
| --- | --- |
| ``` 1 ``` | ``` pip install flask openai python-dotenv PyPDF2 dashscope faiss-cpu langchain langchain-text-splitters ``` |

## 三、密钥配置 .env

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` DOUBAO_KEY=ark-xxx ZHIPU_KEY=sk-xxx QWEN_KEY=sk-xxx ``` |

## 四、后端核心（需修复向量兼容 BUG）

> 关键修复点：自定义`QwenEmbedding`新增`__call__`方法，适配 LangChain 的 FAISS 底层调用规则，解决`object not callable`报错。

运行

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 149 150 151 152 153 154 155 156 157 ``` | ``` from flask import Flask, request, jsonify, Response, stream_with_context from openai import OpenAI from dotenv import load_dotenv import os, shutil from PyPDF2 import PdfReader from langchain_text_splitters import RecursiveCharacterTextSplitter from langchain_community.vectorstores import FAISS import dashscope from dashscope import TextEmbedding  load_dotenv() app = Flask(__name__)  # 全局跨域配置 @app.after_request def add_cors_headers(response):     response.headers['Access-Control-Allow-Origin'] = '*'     response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'     response.headers['Access-Control-Allow-Headers'] = 'Content-Type'     return response @app.route('/<path:path>', methods=["OPTIONS"]) def opt(path):     return "",200  # 三大模型统一配置 MODEL_MAP = {     "doubao":{         "key":os.getenv("DOUBAO_KEY"),         "url":"https://ark.cn-beijing.volces.com/api/v3",         "model":"ep-xxxx替换成自己方舟模型ID"     },     "zhipu":{         "key":os.getenv("ZHIPU_KEY"),         "url":"https://open.bigmodel.cn/api/paas/v4/",         "model":"glm-4-flash"     },     "qwen":{         "key":os.getenv("QWEN_KEY"),         "url":"https://dashscope.aliyuncs.com/compatible-mode/v1",         "model":"qwen-turbo"     } }  FAISS_PATH = "./faiss_db" Q_KEY = os.getenv("QWEN_KEY") dashscope.api_key = Q_KEY  # 通义向量类（关键：__call__兼容LangChain） class QwenEmbedding:     def __call__(self, text):         if isinstance(text, str):             return self.embed_query(text)         return self.embed_documents(text)      def embed_documents(self, texts):         res = TextEmbedding.call(model="text-embedding-v1", input=texts)         return [i["embedding"] for i in res.output["embeddings"]]      def embed_query(self, text):         res = TextEmbedding.call(model="text-embedding-v1", input=[text])         return res.output["embeddings"][0]["embedding"]  def get_embedding():     return QwenEmbedding()  all_pdf_text = "" # 文本分片参数 text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)  # 多文件PDF上传接口 @app.post("/api/upload_pdf") def upload():     try:         global all_pdf_text         file_list = request.files.getlist("pdf")         total_text = ""         for f in file_list:             fn = f.filename             f.save(fn)             rd = PdfReader(fn)             pt = ""             for p in rd.pages:                 t = p.extract_text()                 if t:                     pt += t             total_text += pt             os.remove(fn)         # 全文内存存储（精简截取）         short = "\n".join(text_splitter.split_text(total_text)[:6])         all_pdf_text += short         # FAISS向量入库         sp = text_splitter.split_text(total_text)         emb = get_embedding()         if os.path.exists(FAISS_PATH):             db = FAISS.load_local(FAISS_PATH, emb, allow_dangerous_deserialization=True)             db.add_texts(sp)         else:             db = FAISS.from_texts(sp, emb)         db.save_local(FAISS_PATH)         return jsonify({"code":200,"msg":f"成功上传{len(file_list)}个PDF"})     except Exception as e:         print("上传报错：",e)         return jsonify({"code":500,"msg":str(e)})  # 清空知识库：清空内存+删除向量库 @app.post("/api/clear_kb") def clear():     global all_pdf_text     all_pdf_text = ""     if os.path.exists(FAISS_PATH):         shutil.rmtree(FAISS_PATH)     return jsonify({"code":200,"msg":"已清空"})  # LLM流式输出封装 def stream_generate(model_type,prompt):     cfg = MODEL_MAP[model_type]     cli = OpenAI(api_key=cfg["key"],base_url=cfg["url"])     s = cli.chat.completions.create(model=cfg["model"],messages=[{"role":"user","content":prompt}],stream=True)     for chunk in s:         if chunk.choices and chunk.choices[0].delta.content:             yield chunk.choices[0].delta.content  # 普通对话接口 @app.post("/api/chat_stream") def chat_stream():     d = request.get_json()     return Response(stream_generate(d["model"],d["msg"]),mimetype="text/event-stream")  # PDF问答双模式接口 full=全文 / faiss=向量 @app.post("/api/chat_pdf_stream") def pdf_stream():     try:         data = request.get_json()         q = data["msg"]         mode = data.get("search_type","full")         global all_pdf_text         if not all_pdf_text and not os.path.exists(FAISS_PATH):             prompt = "未上传PDF"         else:             if mode == "full":                 # 全文模式：截取前3500字符防超限                 doc = all_pdf_text[:3500]                 prompt = f"""依据文档回答：{doc}\n问题:{q}"""             else:                 # FAISS：相似度召回top3片段                 emb = get_embedding()                 db = FAISS.load_local(FAISS_PATH, emb, allow_dangerous_deserialization=True)                 hit = db.similarity_search(q,k=3)                 cnt = "\n".join([x.page_content for x in hit])                 prompt = f"""参考:{cnt}\n问题:{q}"""         return Response(stream_generate(data["model"],prompt),mimetype="text/event-stream")     except Exception as e:         print("FAISS检索报错详情>>>>",e)         return jsonify({"code":500,"msg":str(e)})  if __name__ == '__main__':     app.run(host="127.0.0.1",port=5000,debug=True) ``` |

## 五、前端 Vue 完整代码示例

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 ``` | ``` <template>   <div style="max-width:700px;margin:30px auto;padding:0 20px">     <h2 align="center">多模型通用AI问答｜PDF 知识库版</h2>      <!-- 功能切换区 -->     <div style="margin-bottom:10px">       <input type="radio" v-model="chatMode" value="normal">普通对话       <input type="radio" v-model="chatMode" value="pdf">PDF知识库问答       <span v-if="chatMode==='pdf'" style="margin-left:12px">         <select v-model="searchType" style="padding:4px;margin-right:8px">           <option value="full">全文检索</option>           <option value="faiss">FAISS向量检索</option>         </select>         <input type="file" ref="fileRef" accept=".pdf" multiple @change="uploadPdf"/>         <button @click="clearKB" style="margin-left:6px;padding:4px 8px">清空知识库</button>       </span>     </div>      <!-- 聊天盒子 -->     <div ref="chatWrap" style="border:1px solid #eee;height:460px;overflow-y:auto;padding:12px;border-radius:8px;margin-bottom:15px">       <div v-for="(item,idx) in chatList" :key="idx" style="margin:10px 0;">         <p><b>{{item.role}}：</b>{{item.content}}</p>       </div>     </div>      <div>       <select v-model="selectModel" style="padding:7px;margin-right:8px">         <option value="doubao">豆包方舟大模型</option>         <option value="zhipu">智谱GLM免费大模型</option>         <option value="qwen">通义千问</option>       </select>       <input v-model="inputMsg" placeholder="输入提问" style="width:72%;padding:7px"/>       <button @click="sendMsg" style="padding:7px 12px;margin-left:6px">发送</button>     </div>   </div> </template> <script setup> import {ref,nextTick} from 'vue' import axios from 'axios' const inputMsg = ref('') const selectModel = ref('doubao') const chatList = ref([]) const chatMode = ref('normal') const searchType = ref('full') const fileRef = ref(null) const chatWrap = ref(null)  // 多PDF批量上传 async function uploadPdf(){   let form = new FormData()   Array.from(fileRef.value.files).forEach(file=>form.append("pdf",file))   let res = await axios.post("http://127.0.0.1:5000/api/upload_pdf",form)   alert(res.data.msg)   fileRef.value.value = "" }  // 清空知识库 async function clearKB(){   await axios.post("http://127.0.0.1:5000/api/clear_kb")   alert("全文+向量知识库已全部清空") }  // 流式发送消息 async function sendMsg(){   if(!inputMsg.value.trim())return   const userText = inputMsg.value   chatList.value.push({role:"我",content:userText})   let aiItem = {role:"AI",content:"正在思考中…"}   chatList.value.push(aiItem)   await nextTick()   chatWrap.value.scrollTop = chatWrap.value.scrollHeight    const apiUrl = chatMode.value==='normal' ? "/api/chat_stream" : "/api/chat_pdf_stream"   let payload   if(chatMode.value === 'pdf'){     payload = {model:selectModel.value,msg:userText,search_type: searchType.value}   }else{     payload = {model:selectModel.value,msg:userText}   }    const res = await fetch(`http://127.0.0.1:5000${apiUrl}`,{     method:"POST",     headers:{"Content-Type":"application/json"},     body:JSON.stringify(payload)   })   aiItem.content = ""   const reader = res.body.getReader()   const decoder = new TextDecoder("utf-8")   while(true){     const {done,value} = await reader.read()     if(done) break     const text = decoder.decode(value)     aiItem.content += text     chatWrap.value.scrollTop = chatWrap.value.scrollHeight   }   inputMsg.value = '' } </script> ``` |

## 六、两种检索模式区别

1. **全文检索 (full)**

   PDF 文本存入内存，提问自动截取前 3500 字符拼接 prompt；

   ✅ 无向量、不调用通义 Embedding、不会库损坏、稳定；

   ✅ 适用：20 页以内小型 PDF、合同、短文。
2. **FAISS 向量检索 (faiss)**

   文档自动分片→调用通义向量转数字→存入 faiss\_db 索引；提问转向量，召回最相似 3 段内容；

   ✅ 超大百页文档不超限、精准匹配相关片段；

   ❌ 依赖通义 Key、索引异常易损坏；适用：书籍、长篇手册。

## 七、标准使用步骤

1. 后端：`python app.py`启动服务
2. 前端：

* 普通对话：勾选普通→选模型→直接提问
* PDF 知识库：

  ① 先点【清空知识库】删除旧数据

  ② 多选 PDF 上传

## 一、代码本身**已经支持多文件上传**

1. 前端标签：`input ... multiple`，浏览器弹窗可以按住`Ctrl多选多个PDF`；
2. 后端：`request.files.getlist("pdf")`，循环遍历全部文件逐个解析，合并全文、批量向量化入库；

> ❗ 误区：**不是一次性拖拽文件夹，是弹窗按住 Ctrl 鼠标多选 PDF**。

## 二、正确多 PDF 上传操作

1. 点击上传按钮 → 弹出文件选择框
2. Windows：按住`Ctrl`，鼠标逐个点选多个 PDF → 打开
3. 上传弹窗提示：`成功上传N个PDF`，代表多文件解析入库成功
4. 两种库同步生成：内存全文、FAISS 向量库

## 三、双检索 & 多 PDF 功能总结（并入博客）

### 1、多 PDF 批量上传

* 开启`multiple`属性，Ctrl 多选文件；
* 后端循环读取每份 PDF 文本，全部合并汇总；
* 同时写入**内存全文库 + FAISS 向量库**，切换检索模式不用重新上传文件。

### 2、双检索模式

1. 全文检索 full（小文档优选）

   全部文档文本拼接存入内存，提问截取前 3500 字符，不走向量接口、零报错，适合几十页以内文档。
2. FAISS 向量检索 faiss（大文档优选）

   文档自动分片→通义 Embedding 生成向量→本地 faiss\_db 存索引；提问相似度匹配 top3 片段，超长文档不会上下文溢出。

### 3、关键历史 BUG & 修复

1. 自定义 QwenEmbedding 缺少`__call__` → LangChain 调用 FAISS 报错对象不可调用

修复：向量类增加

|  |  |
| --- | --- |
| ``` 1 ``` | ``` __call__ ``` |

函数，适配 LangChain 底层规范，现在 FAISS 正常读写索引。

2. 早期单 FAISS 方案痛点：索引损坏、密钥异常、小文档冗余；改成**双库并存架构**，上传一次两种数据都生成。

## 四、精简最终使用流程

1. 启动后端：`python app.py`
2. 前端→PDF 知识库→清空知识库（清旧库）
3. 上传：`Ctrl多选多个PDF`
4. 切换：全文 / FAISS，针对文档提问

③ 下拉选「全文 / FAISS」

④ 针对文档内容提问

## 八、踩坑复盘

1. 最初 FAISS 单独方案：索引破损、扫描 PDF 无文字、向量类缺少`__call__`导致 LangChain 报错；
2. 优化方案：双模式并存，上传同时生成内存全文 + 向量库，按需切换；
3. 超长文档内置分片 + 字符截断，规避 LLM 上下文长度超限。

## 九、后续拓展方向

1. PDF 文档列表管理，单独删除某份文件；
2. 文件持久化本地保存；
3. 自动判断文档大小智能选择检索模式。