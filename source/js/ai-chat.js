(function () {
  const presetReplies = {
    '你好': '你好呀！👋 我是博客小助手，可以帮你解答关于这个博客的各种问题。试试问我：\n- 博客有多少篇文章？\n- 怎么联系博主？\n- 博客用的什么主题？',
    '你是谁': '我是这个博客的 AI 小助手 🤖，可以回答你关于博客内容、技术文章、项目展示等方面的问题。有什么想了解的吗？',
    '博客': '这个博客是 Xu Min 的个人技术博客，使用 Hexo + Butterfly 主题搭建。主要分享前端技术、AI 应用开发、项目实战等内容。',
    '文章': '目前博客共有 50+ 篇技术文章，涵盖：\n- 📌 前端开发（Vue、React、工程化）\n- 🤖 AI 专栏（LangChain、RAG、提示词）\n- 💼 面试专题（简历、笔试题、面试题）\n- 🛠️ 博客搭建（Hexo、SEO、优化）\n- 📁 项目实战',
    '有多少篇文章': '目前博客共有 50+ 篇技术文章，持续更新中！可以在首页或归档页面查看全部文章。',
    '多少篇': '目前博客共有 50+ 篇技术文章，涵盖前端、AI、面试、项目等多个方向。',
    '博主': '博主是 Xu Min，一名前端开发工程师，热爱技术，专注于 Web 前端开发与 AI 应用落地。',
    '联系': '可以通过以下方式联系博主：\n📧 邮箱：3140387327@qq.com\n🐙 GitHub：https://github.com/Xumin8888',
    '怎么联系': '可以通过以下方式联系博主：\n📧 邮箱：3140387327@qq.com\n🐙 GitHub：https://github.com/Xumin8888',
    '邮箱': '博主邮箱：3140387327@qq.com',
    'github': '博主的 GitHub：https://github.com/Xumin8888',
    '主题': '博客使用的是 Hexo Butterfly 主题，一个优雅且功能丰富的 Hexo 主题。',
    'hexo': '博客使用 Hexo 静态博客框架搭建，部署在 GitHub Pages 上。',
    '前端': '前端相关的文章主要有：\n- Vue / React 框架\n- TypeScript\n- 工程化与性能优化\n- 浏览器与网络\n- 手写代码\n可以在「前端」分类下查看更多。',
    'vue': 'Vue 相关文章推荐：\n- Vue3 后台管理系统项目实战\n- 前端面试题 - Vue 篇\n可以在 Vue 标签下查看更多。',
    'react': 'React 相关文章推荐：\n- React 电商项目实战\n- 前端面试题 - React 篇\n可以在 React 标签下查看更多。',
    'ai': 'AI 专栏包含以下内容：\n- LangChain 入门实战\n- RAG 检索增强生成\n- 提示词工程技巧\n- AI 项目实战\n- 多模型接入\n可以在「AI专栏」分类下查看更多。',
    '面试': '面试专题包含：\n- 简历指南\n- 前端面试题（12个方向）\n- 面试技巧\n可以在「面试专题」菜单下查看。',
    '项目': '项目展示包括：\n- 点餐小程序（uni-app）\n- 外卖系统（React）\n- 数据大屏（Vue3）\n- 线上学习平台\n- Vue3 后台管理系统\n- React 电商项目\n可以在「项目」菜单下查看。',
    '简历': '简历相关的文章可以查看「面试专题」下的「简历指南」，里面有简历制作技巧和注意事项。',
    '谢谢': '不客气！😊 如果还有其他问题，随时问我~',
    '感谢': '不客气！能帮到你我很开心~ 🌟',
    '再见': '再见！👋 欢迎常来逛逛~',
    '拜拜': '拜拜~ 🚀 下次见！'
  };

  const defaultReply = '这个问题我暂时回答不上来呢 🤔 你可以试试问我：\n- 博客有多少篇文章？\n- 怎么联系博主？\n- 前端有哪些文章？\n- AI 专栏有什么内容？';

  function matchReply(message) {
    const msg = message.toLowerCase();
    for (const key in presetReplies) {
      if (msg.includes(key.toLowerCase())) {
        return presetReplies[key];
      }
    }
    return defaultReply;
  }

  function formatReply(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>')}</p>`)
      .join('');
  }

  function initChat() {
    const aiBtn = document.getElementById('ai-btn');
    const aiChat = document.getElementById('ai-chat');
    const chatBody = document.getElementById('ai-chat-body');
    const input = document.getElementById('ai-chat-input input');
    const sendBtn = document.getElementById('ai-chat-input button');
    const closeBtn = document.getElementById('ai-chat-close');

    if (!aiBtn || !aiChat || !chatBody || !input || !sendBtn) return;

    let isOpen = false;

    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        aiChat.classList.add('show');
        setTimeout(() => input.focus(), 300);
        if (chatBody.children.length === 0) {
          addBotMessage('你好！👋 我是博客小助手，有什么可以帮你的吗？可以点击下方快捷问题提问~');
        }
      } else {
        aiChat.classList.remove('show');
      }
    }

    function addUserMessage(text) {
      const div = document.createElement('div');
      div.className = 'ai-msg user';
      div.innerHTML = `<span>${escapeHtml(text)}</span>`;
      chatBody.appendChild(div);
      scrollToBottom();
    }

    function addBotMessage(text) {
      const div = document.createElement('div');
      div.className = 'ai-msg bot';
      div.innerHTML = `<span>${formatReply(text)}</span>`;
      chatBody.appendChild(div);
      scrollToBottom();
    }

    function addLoading() {
      const div = document.createElement('div');
      div.className = 'ai-msg bot loading-dot';
      div.innerHTML = '<span></span><span></span><span></span>';
      chatBody.appendChild(div);
      scrollToBottom();
      return div;
    }

    function scrollToBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    async function sendMsg() {
      const val = input.value.trim();
      if (!val) return;

      addUserMessage(val);
      input.value = '';
      sendBtn.disabled = true;

      const loadingDom = addLoading();

      setTimeout(() => {
        loadingDom.remove();
        const reply = matchReply(val);
        addBotMessage(reply);
        sendBtn.disabled = false;
        input.focus();
      }, 600 + Math.random() * 800);
    }

    aiBtn.addEventListener('click', toggleChat);
    closeBtn && closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMsg);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMsg();
      }
    });

    const quickQuestions = document.querySelectorAll('.quick-question');
    quickQuestions.forEach(q => {
      q.addEventListener('click', () => {
        input.value = q.textContent;
        sendMsg();
      });
    });

    function toggleAiBtn() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 56) {
        aiBtn.classList.add('show');
      } else {
        if (!isOpen) {
          aiBtn.classList.remove('show');
        }
      }
    }

    window.addEventListener('scroll', toggleAiBtn, { passive: true });
    toggleAiBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }
})();
