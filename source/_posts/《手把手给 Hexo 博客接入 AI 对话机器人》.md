---
title: 《手把手给 Hexo 博客接入 AI 对话机器人》
date: 2026-05-18 23:55:28
tags: [前端, React, Vue, Hexo, Xumin, 熊猫, 项目]
cover: /img/cat.jpg
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

## 五、总结

这是我第一次真正把**AI 能力落地到自己前端项目**。

不是练习、不是看视频、是**真正写进自己博客、自己网站、自己作品**的实战。

后续我会继续优化：上下文记忆、流式输出、接口代理防泄密。