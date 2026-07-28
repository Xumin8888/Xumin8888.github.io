---
title: LangChain 入门实战：从零搭建第一个AI应用
date: 2026-07-12 14:20:00
categories:
  - AI专栏
tags:
  - 项目实战
  - LangChain
  - AI
  - RAG
top_img: /img/bj.jpg
cover: /img/2.jpg
---

## 前言

如果你已经会用 fetch 直接调用大模型 API，并且做过一些简单的 AI 对话应用，那么恭喜你，你已经入门了 AI 应用开发。

但当你想做更复杂的 AI 应用时——比如知识库问答、智能客服、AI 代理——你会发现纯手写代码变得越来越麻烦：
- 要自己管理对话历史和上下文
- 要自己处理文档加载、文本分割、向量化
- 要自己串联多个模型调用逻辑
- 要自己处理各种异常情况和重试机制

这时候，LangChain 就派上用场了。作为目前最流行的 AI 应用开发框架，LangChain 把这些通用能力都封装好了，让你能更快地构建复杂的 AI 应用。

这篇文章，我会从一个前端开发者的视角，带你从零入门 LangChain，并用它搭建一个完整的 RAG 知识库问答应用。**全程实战，不讲晦涩理论**。

## 一、LangChain 是什么？为什么要用它？

### 1.1 一句话理解 LangChain

**LangChain 是一个「大模型应用开发框架」**，你可以把它理解为 AI 界的 Vue/React——它帮你封装好了底层的繁琐操作，让你专注于业务逻辑。

### 1.2 LangChain 的核心能力

| 能力模块 | 作用 | 不用 LangChain 会怎样 |
|---------|------|---------------------|
| Models | 统一对接各种大模型 API | 每个厂商的接口格式都不一样，要写多套适配代码 |
| Prompts | 提示词模板管理 | 字符串拼接又乱又难维护 |
| Chains | 多步骤链式调用 | 自己写逻辑分支，代码又臭又长 |
| Memory | 对话记忆管理 | 自己维护历史消息，容易出 bug |
| Retrievers | 检索器（向量检索等） | 自己接向量数据库，实现相似度搜索 |
| Agents | AI 智能体（工具调用） | 自己实现 ReAct 逻辑，极其复杂 |

### 1.3 前端开发者怎么学 LangChain？

好消息是，LangChain 有 JavaScript 版本（LangChain.js），前端开发者可以无缝上手，不用学 Python。

**学习路径建议**：
1. 先掌握大模型 API 的基础调用（这一步你应该已经会了）
2. 学习 LangChain 的核心概念（Model、Prompt、Chain、Memory）
3. 做一个 RAG 知识库问答项目（最经典的入门项目）
4. 再探索 Agent、工具调用等高级特性

## 二、环境准备

### 2.1 初始化项目

我们用 Node.js + LangChain.js 来开发，这样前端同学最熟悉。

```bash
mkdir langchain-demo
cd langchain-demo
npm init -y
```

### 2.2 安装依赖

```bash
# 核心包
npm install langchain @langchain/openai

# 文档加载和分割
npm install pdf-parse recursive-text-splitter

# 向量数据库（用 FAISS，本地文件存储，不需要额外部署）
npm install faiss-node

# 环境变量管理
npm install dotenv
```

> 说明：我们用通义千问或豆包的 API 来演示，它们都兼容 OpenAI 格式，可以直接用 `@langchain/openai` 包。

### 2.3 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# 通义千问配置（示例）
OPENAI_API_KEY=你的API_KEY
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MODEL_NAME=qwen-plus

# 向量模型配置
EMBEDDING_MODEL=text-embedding-v1
```

## 三、LangChain 核心概念实战

### 3.1 Model：最简单的大模型调用

先从最简单的开始——用 LangChain 调用大模型。

新建 `01-simple-chat.js`：

```javascript
require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

// 1. 初始化模型
const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL
  }
});

// 2. 调用模型
async function main() {
  const messages = [
    new SystemMessage('你是一个专业的前端技术顾问，回答问题要简洁、准确。'),
    new HumanMessage('用一句话解释什么是闭包？')
  ];

  const response = await model.invoke(messages);
  console.log('AI 回答：', response.content);
}

main();
```

运行一下：

```bash
node 01-simple-chat.js
```

看到了吗？只需要几行代码，就能完成大模型调用。LangChain 帮你封装了 HTTP 请求、错误处理等底层细节。

### 3.2 Prompt Template：提示词模板化

当提示词复杂的时候，用字符串拼接很难维护。LangChain 的 PromptTemplate 可以帮你优雅地管理提示词。

新建 `02-prompt-template.js`：

```javascript
require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL }
});

// 定义提示词模板
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个{role}，回答问题要{style}。'],
  ['human', '{question}']
]);

// 输出解析器
const outputParser = new StringOutputParser();

// 链式调用：prompt -> model -> outputParser
const chain = prompt.pipe(model).pipe(outputParser);

async function main() {
  const result = await chain.invoke({
    role: '前端技术专家',
    style: '通俗易懂，用大白话讲',
    question: '什么是虚拟 DOM？它有什么好处？'
  });

  console.log(result);
}

main();
```

这里我们第一次接触到了 **Chain（链）** 的概念——把多个步骤串联起来，数据依次流过每个环节。

### 3.3 Memory：让 AI 记住对话历史

默认情况下，大模型是「健忘」的——每次调用都是独立的，它记不住之前说过什么。Memory 模块就是用来解决这个问题的。

新建 `03-chat-memory.js`：

```javascript
require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { BufferMemory } = require('langchain/memory');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL }
});

// 记忆存储
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: 'chat_history'
});

// 提示词模板，注意这里的 MessagesPlaceholder
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个友好的 AI 助手。'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}']
]);

const chain = RunnableSequence.from([
  {
    input: (input) => input.input,
    chat_history: async () => {
      const { chat_history } = await memory.loadMemoryVariables({});
      return chat_history;
    }
  },
  prompt,
  model,
  new StringOutputParser()
]);

async function chat(input) {
  const response = await chain.invoke({ input });
  
  // 保存对话历史
  await memory.saveContext(
    { input },
    { output: response }
  );
  
  return response;
}

async function main() {
  console.log('用户：你好，我叫小明');
  let reply = await chat('你好，我叫小明');
  console.log('AI：', reply);
  
  console.log('\n用户：我叫什么名字？');
  reply = await chat('我叫什么名字？');
  console.log('AI：', reply);
}

main();
```

运行一下，你会发现 AI 记住了你的名字！这就是 Memory 的作用。

## 四、进阶实战：搭建 RAG 知识库问答

掌握了核心概念后，我们来做一个真正有价值的项目——**RAG 知识库问答系统**。

RAG（Retrieval-Augmented Generation，检索增强生成）的原理很简单：
1. 把文档切成小块，转向量后存入向量数据库
2. 用户提问时，先从向量库中检索相关片段
3. 把相关片段和问题一起送给大模型生成答案

### 4.1 准备文档

在项目根目录创建一个 `docs` 文件夹，放几个 PDF 文档进去（也可以用 TXT 或 Markdown）。

### 4.2 构建向量索引

新建 `04-build-vector-store.js`：

```javascript
require('dotenv').config();
const { OpenAIEmbeddings } = require('@langchain/openai');
const { FAISS } = require('@langchain/community/vectorstores/faiss');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const fs = require('fs');
const path = require('path');

// 向量模型
const embeddings = new OpenAIEmbeddings({
  modelName: process.env.EMBEDDING_MODEL,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL }
});

async function buildVectorStore() {
  const docsDir = './docs';
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.pdf'));
  
  let allDocs = [];
  
  for (const file of files) {
    console.log(`正在处理：${file}`);
    const loader = new PDFLoader(path.join(docsDir, file));
    const docs = await loader.load();
    
    // 文本分割
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50
    });
    const splitDocs = await splitter.splitDocuments(docs);
    
    allDocs = allDocs.concat(splitDocs);
  }
  
  console.log(`文档分片总数：${allDocs.length}`);
  
  // 构建 FAISS 向量库
  const vectorStore = await FAISS.fromDocuments(allDocs, embeddings);
  
  // 保存到本地
  await vectorStore.save('./faiss_index');
  console.log('向量库构建完成，已保存到 faiss_index 目录');
}

buildVectorStore();
```

运行：

```bash
node 04-build-vector-store.js
```

### 4.3 实现 RAG 问答

新建 `05-rag-chat.js`：

```javascript
require('dotenv').config();
const { ChatOpenAI, OpenAIEmbeddings } = require('@langchain/openai');
const { FAISS } = require('@langchain/community/vectorstores/faiss');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');

// 初始化模型
const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL }
});

// 向量模型
const embeddings = new OpenAIEmbeddings({
  modelName: process.env.EMBEDDING_MODEL,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL }
});

// RAG 提示词模板
const ragPrompt = ChatPromptTemplate.fromTemplate(`
你是一个专业的文档问答助手。请根据以下提供的上下文内容回答用户的问题。
如果答案不在上下文中，请说"抱歉，我在文档中没有找到相关信息"，不要编造答案。

上下文内容：
{context}

用户问题：{question}

请用中文回答：
`);

// 格式化检索到的文档
function formatDocs(docs) {
  return docs.map((doc, i) => `[文档${i + 1}] ${doc.pageContent}`).join('\n\n');
}

async function main() {
  // 加载向量库
  const vectorStore = await FAISS.load('./faiss_index', embeddings);
  const retriever = vectorStore.asRetriever({ k: 3 }); // 检索 Top 3 相关片段
  
  // 构建 RAG Chain
  const ragChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocs),
      question: new RunnablePassthrough()
    },
    ragPrompt,
    model,
    new StringOutputParser()
  ]);
  
  // 测试问答
  const question = '请简述一下项目的核心功能是什么？';
  console.log('问题：', question);
  console.log('正在检索并生成答案...\n');
  
  const answer = await ragChain.invoke(question);
  console.log('回答：', answer);
}

main();
```

运行看看效果：

```bash
node 05-rag-chat.js
```

恭喜你！你已经用 LangChain 搭建了一个完整的 RAG 知识库问答系统。

## 五、LangChain 学习建议

### 5.1 从哪里开始学？

1. **官方文档**：LangChain 官方文档写得很详细，还有大量示例代码
2. **实战项目**：找几个小项目练手，比如智能客服、代码审查、文案生成
3. **看源码**：遇到问题时翻翻 LangChain.js 的源码，其实不难懂

### 5.2 常见的坑

1. **不要盲目追求 Agent**：Agent 看起来很酷，但实际项目中 80% 的场景用 Chain 就够了
2. **注意 Token 消耗**：文档分片不要太大，检索结果也不要太多，不然很费钱
3. **做好异常处理**：大模型 API 不稳定，超时、限流、报错是常事，要有重试和降级机制
4. **数据安全**：敏感数据不要随便传给第三方大模型，注意合规

### 5.3 下一步学什么？

- **多模态**：接入图片理解、语音识别等能力
- **Agent & Tools**：让 AI 能调用工具，执行复杂任务
- **流式输出**：让回复一个字一个字地出来，体验更好
- **生产部署**：性能优化、缓存、监控、限流

## 结语

LangChain 是一个非常强大的工具，但它本质上只是一个「脚手架」——真正决定 AI 应用质量的，还是你对业务的理解、对提示词的打磨、对用户体验的把控。

对于前端开发者来说，LangChain.js 是进入 AI 应用开发领域的绝佳入口。你不需要学 Python，不需要懂深度学习，用你熟悉的 JavaScript，就能快速构建出有价值的 AI 应用。

不要纠结于「要不要学 LangChain」，直接动手做一个项目吧。在做的过程中，你自然就会了。
