---
title: 手把手给 Hexo 博客接入 AI 对话机器人
date: 2026-05-18 23:55:28
categories:
  - AI专栏
tags:
  - 项目实战
  - Hexo
  - AI
top_img: /img/bj.jpg
cover: /img/3.jpg
---

手把手给 Hexo 博客接入 AI 对话机器人

**专栏：AI 前端实战**

**前言**

在上一篇 AI 专栏开篇中我说过：前端学 AI 不需要学算法，只学**能落地、能提效、能写到项目里的实战能力**。

所以我的第一篇实战，直接拿我自己的 Hexo 博客开刀，**从零实现博客右侧悬浮 AI 智能助手**。

本文所有代码、样式、逻辑、动画，全部是我博客正在使用的版本，无冗余、无抄袭、无通用模板，**完全适配 Butterfly 主题**。

## 一、最终实现效果

1. 页面右下角悬浮 AI 按钮，hover 上浮变色
2. 点击弹出 AI 对话窗口
3. 支持输入问题、发送问答、回车发送
4. 请求中展示 三点 loading 动画
5. 样式简约、适配博客风格、层级最高不被遮挡

## 二、实现原理（前端专属）

全程 **纯前端实现**，不需要后端、不需要服务器：

1. 通过 Hexo inject 注入全局 CSS、HTML、JS
2. 悬浮按钮 + 弹窗结构固定在页面右下角
3. 使用 JS fetch 请求大模型 API
4. 处理加载动画、消息气泡样式、异常提示

## 三、完整可直接部署代码（我博客原版）

打开 `_config.butterfly.yml` ——> `inject` ——> `head`

以下为 **你现在正在用的原版样式代码**，无修改、不乱编：

### 1. 全局样式 CSS

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 ``` | ``` /* AI悬浮按钮优化 */ #ai-btn {   position:fixed;   right:5px;   bottom:207px;   width:46px;   height:46px;   border-radius:14px;   background:#6ca2ec;   color:#fff;   text-align:center;   cursor:pointer;   z-index:98;   box-shadow:0 3px 12px rgba(22,119,255,0.3);   transition: all 0.2s ease;   display:flex;   align-items:center;   justify-content:center; } #ai-btn:hover{   transform: translateY(-4px);   background:#0958d9; } /* 弹窗样式 */ #ai-chat {   position:fixed;   right:22px;   bottom:190px;   width:360px;   height:480px;   background:#fff;   border-radius:12px;   box-shadow:0 6px 24px rgba(0,0,0,0.12);   z-index:99;   display:flex;   flex-direction:column;   overflow:hidden; } #ai-chat.hidden {display:none;} #ai-chat-header {   background:#1677ff;   color:#fff;   padding:11px;   text-align:center;   font-weight:bold;   font-size:15px; } #ai-chat-body {flex:1;padding:12px;overflow:auto;background:#fafafa;} #ai-chat-input {display:flex;border-top:1px solid #e8e8e8;} #ai-chat-input input {flex:1;border:none;padding:12px;outline:none;font-size:14px;} #ai-chat-input button {width:72px;border:none;background:#1677ff;color:#fff;cursor:pointer;} .ai-msg {margin:9px 0;} .ai-msg.user {text-align:right;} .ai-msg.user span {background:#1677ff;color:#fff;padding:7px 11px;border-radius:12px 12px 2px 12px;display:inline-block;max-width:82%;} .ai-msg.bot {text-align:left;} .ai-msg.bot span {background:#ffffff;color:#333;padding:7px 11px;border-radius:12px 12px 12px 2px;display:inline-block;max-width:82%;border:1px solid #eee;} /* 加载动画 */ .loading-dot span{   display:inline-block;   width:6px;height:6px;   border-radius:50%;   background:#999;   margin:0 2px;   animation: dot 1.2s infinite; } .loading-dot span:nth-child(2){animation-delay:0.2s;} .loading-dot span:nth-child(3){animation-delay:0.4s;} @keyframes dot{   0%,100%{opacity:0.3;transform:scale(0.8);}   50%{opacity:1;transform:scale(1);} } ``` |

### 2. 页面结构 HTML（body 注入）

这是我们之前加的悬浮按钮 + 弹窗结构：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 ``` | ``` <div id="ai-btn">   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">     <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>   </svg> </div>  <div id="ai-chat" class="hidden">   <div id="ai-chat-header">前端AI小助手</div>   <div id="ai-chat-body"></div>   <div id="ai-chat-input">     <input type="text" placeholder="输入问题，回车发送">     <button>发送</button>   </div> </div> ``` |

### 3. JS 交互逻辑（我们之前对接的豆包 API）

实现：点击弹窗、发送消息、loading、AI 回复渲染

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 ``` | ``` const chatBtn = document.querySelector('#ai-btn'); const chatBox = document.querySelector('#ai-chat'); const chatBody = document.querySelector('#ai-chat-body'); const input = document.querySelector('#ai-chat-input input'); const sendBtn = document.querySelector('#ai-chat-input button');  // 弹窗开关 chatBtn.onclick = () => chatBox.classList.toggle('hidden');  // 发送消息 async function sendMsg() {   const val = input.value.trim();   if (!val) return;    // 用户消息   chatBody.innerHTML += `<div class="ai-msg user"><span>${val}</span></div>`;   input.value = '';    // loading   const loadDom = document.createElement('div');   loadDom.className = 'ai-msg bot loading-dot';   loadDom.innerHTML = '<span></span><span></span><span></span>';   chatBody.appendChild(loadDom);   chatBody.scrollTop = chatBody.scrollHeight;    try {     const res = await fetch("你的API地址", {       method: "POST",       headers: {         "Content-Type": "application/json"       },       body: JSON.stringify({         message: val       })     })      const data = await res.json();     loadDom.remove();      if (data.content) {       chatBody.innerHTML += `<div class="ai-msg bot"><span>${data.content}</span></div>`     } else {       chatBody.innerHTML += `<div class="ai-msg bot"><span>AI 返回异常</span></div>`     }   } catch (err) {     loadDom.remove();     chatBody.innerHTML += `<div class="ai-msg bot"><span>请求失败，请检查接口配置</span></div>`   }   chatBody.scrollTop = chatBody.scrollHeight; }  sendBtn.onclick = sendMsg; input.onkeydown = e => e.key === 'Enter' && sendMsg(); ``` |

## 四、我实战中遇到的问题（真实踩坑）

1. **YAML 缩进报错**：CSS 前面空格不对直接全站编译失败
2. **图片路径错误**：本地路径必须 `/img/xxx.jpg`
3. **缺少 url() 引号** 导致 Hexo 直接 FATAL 报错
4. 直接前端请求 API 存在**跨域风险**

## 五、进阶优化方向

基础版的 AI 对话机器人已经能用了，但还有很多可以优化的地方。这里给大家提供几个进阶优化方向。

### 5.1 上下文记忆：让 AI 记住你说过的话

基础版每次对话都是独立的，AI 记不住之前的内容。要实现多轮对话，需要把历史消息一起发给大模型。

```javascript
// 存储对话历史
const chatHistory = [];

// 发送消息时，带上历史记录
async function sendMsg() {
  const val = input.value.trim();
  if (!val) return;

  // 添加用户消息到历史
  chatHistory.push({ role: 'user', content: val });

  // ... UI 渲染 ...

  try {
    const res = await fetch("你的API地址", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: chatHistory,  // 发送完整历史
        max_tokens: 1000
      })
    });

    const data = await res.json();
    // 添加 AI 回复到历史
    chatHistory.push({ role: 'assistant', content: data.content });

    // ... 渲染回复 ...
  } catch (err) {
    // 错误处理
  }
}
```

> 注意：历史消息太多会消耗更多 token，建议只保留最近 10-20 轮对话，或者做摘要压缩。

### 5.2 流式输出：打字机效果提升体验

现在很多大模型 API 都支持流式输出（stream），可以让回复一个字一个字地「蹦」出来，体验好很多。

实现思路：
1. 请求时加上 `stream: true` 参数
2. 使用 `ReadableStream` 逐块读取响应
3. 实时更新到页面上

```javascript
// 流式输出示例
async function sendMsgStream() {
  const response = await fetch("你的API地址", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: val,
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    // 解析 SSE 格式的流式数据
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const content = json.choices?.[0]?.delta?.content || '';
          result += content;
          // 实时更新到页面
          aiMessageElement.innerHTML = result;
        } catch (e) {}
      }
    }
  }
}
```

### 5.3 接口代理：解决密钥泄露和跨域问题

**重要提醒**：上面的代码是直接前端调用 API，有两个大问题：
1. 密钥直接暴露在前端代码里，任何人都能看到
2. 会有跨域问题（CORS）

生产环境一定要用后端代理，前端只请求自己的后端，由后端去调用大模型 API。

最简单的方案：
- 用 Node.js / Python 写一个简单的后端代理服务
- 或者用云函数（Vercel / 阿里云函数计算 / 微信云函数）
- 或者用 Nginx 反向代理

这个话题比较大，我会在后续文章中详细讲。

### 5.4 更多体验优化

- **快捷提问**：预设几个常见问题，点击直接发送
- **清空对话**：一键清空历史记录
- **消息复制**：点击消息可以复制内容
- **错误重试**：请求失败时显示「重新发送」按钮
- **打字提示**：对方正在输入时显示「AI 正在思考...」
- **暗黑模式**：跟随博客主题切换明暗
- **移动端适配**：小屏幕上优化布局

### 5.5 功能扩展思路

- **知识库问答**：让 AI 基于博客文章内容回答问题（RAG）
- **文章摘要**：自动生成当前文章的摘要
- **文章翻译**：一键翻译整篇文章
- **AI 写作助手**：帮助写博客文章
- **智能搜索**：用 AI 优化博客站内搜索

## 六、常见问题 FAQ

### Q1：大模型 API 怎么申请？
A：国内推荐：
- 豆包（火山方舟）：https://www.volcengine.com/product/ark
- 通义千问（阿里云百炼）：https://bailian.console.aliyun.com/
- 智谱 AI：https://www.zhipuai.cn/

新用户一般都有免费额度，个人开发完全够用。

### Q2：会不会很花钱？
A：普通对话非常便宜。比如通义千问 qwen-turbo，100 万 token 才几块钱，个人博客一天可能几分钱都不到。

### Q3：可以接入多个模型吗？
A：可以，做个下拉选择，用户可以切换不同的大模型。不同模型擅长的方向不一样，给用户更多选择。

### Q4：Hexo Butterfly 主题怎么注入？
A：在 `_config.butterfly.yml` 里找到 `inject` 配置：
- CSS 注入到 `head`
- HTML 注入到 `bottom`
- JS 注入到 `bottom`

注意 YAML 格式，缩进一定要对，不然 Hexo 编译会报错。

## 七、总结

这是我第一次真正把**AI 能力落地到自己前端项目**。

不是练习、不是看视频、是**真正写进自己博客、自己网站、自己作品**的实战。

整个过程中，我不仅学会了怎么调用大模型 API，更重要的是理解了「前端怎么和 AI 结合」——前端是 AI 能力触达用户的最后一公里，交互、体验、可视化，这些都是我们前端的主场。

一个简单的 AI 聊天机器人，看起来不难，但从 0 到 1 真正做出来、部署上线，中间会遇到各种各样的坑。而踩坑的过程，就是成长最快的时候。

后续我会继续优化这个博客 AI 助手，包括：
- 上下文记忆和多轮对话
- 流式输出打字机效果
- 后端接口代理，解决密钥泄露和跨域
- 知识库问答，基于博客文章内容回答问题
- 更多有趣的 AI 小功能

如果你也在做类似的东西，欢迎一起交流！