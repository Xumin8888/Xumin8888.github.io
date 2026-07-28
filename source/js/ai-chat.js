const chatBtn = document.querySelector('#ai-btn');
const chatBox = document.querySelector('#ai-chat');
const chatBody = document.querySelector('#ai-chat-body');
const input = document.querySelector('#ai-chat-input input');
const sendBtn = document.querySelector('#ai-chat-input button');

chatBtn.onclick = () => chatBox.classList.toggle('hidden');

const presetReplies = {
  '你好': '你好呀！👋 我是前端AI小助手，可以帮你解答前端技术问题。',
  '你是谁': '我是这个博客的AI小助手 🤖，可以回答你关于前端开发、AI应用、博客技术等方面的问题。',
  '博客': '这个博客是 Xu Min 的个人技术博客，使用 Hexo + Butterfly 主题搭建，分享前端技术和AI实战内容。',
  '文章': '博客目前有50+篇技术文章，涵盖前端开发、AI专栏、面试专题、博客搭建、项目实战等多个方向。',
  '有多少篇文章': '目前博客共有50+篇技术文章，持续更新中！可以在归档页面查看全部文章。',
  '多少篇': '50+篇，涵盖前端、AI、面试、项目等多个方向。',
  '博主': '博主是 Xu Min，一名前端开发工程师，专注于Web前端开发与AI应用落地。',
  '联系': '可以通过以下方式联系博主：\n📧 邮箱：3140387327@qq.com\n🐙 GitHub：https://github.com/Xumin8888',
  '怎么联系': '可以通过以下方式联系博主：\n📧 邮箱：3140387327@qq.com\n🐙 GitHub：https://github.com/Xumin8888',
  '邮箱': '博主邮箱：3140387327@qq.com',
  'github': '博主GitHub：https://github.com/Xumin8888',
  '主题': '博客使用的是 Hexo Butterfly 主题，一个优雅且功能丰富的 Hexo 主题。',
  'hexo': '博客使用 Hexo 静态博客框架搭建，部署在 GitHub Pages 上。',
  '前端': '前端相关文章涵盖：Vue、React、TypeScript、工程化、性能优化、浏览器原理、手写代码等多个方向。',
  'vue': 'Vue 相关文章推荐：\n- Vue3 组合式 API 完全指南\n- 前端面试题 - Vue 篇\n可以在Vue标签下查看更多。',
  'react': 'React 相关文章推荐：\n- React Hooks 完全指南\n- React 电商项目实战\n可以在React标签下查看更多。',
  'ai': 'AI专栏包含：LangChain入门实战、RAG检索增强生成、提示词工程、AI项目实战、多模型接入等内容。',
  '面试': '面试专题包含简历指南、前端面试题（12个方向）、面试技巧等内容。',
  '项目': '项目展示包括：点餐小程序、外卖系统、数据大屏、线上学习平台、Vue3后台管理系统、React电商项目等。',
  '简历': '简历相关内容可以查看面试专题下的简历指南，里面有简历制作技巧和注意事项。',
  '谢谢': '不客气！😊 有问题随时问我~',
  '感谢': '不客气！能帮到你我很开心~ 🌟',
  '再见': '再见！👋 欢迎常来逛逛~',
  '拜拜': '拜拜~ 🚀 下次见！'
};

function getReply(message) {
  const msg = message.toLowerCase();
  for (const key in presetReplies) {
    if (msg.includes(key.toLowerCase())) {
      return presetReplies[key];
    }
  }
  return '这个问题我暂时回答不上来呢 🤔 你可以试试问我前端技术、博客内容、或者怎么联系博主~';
}

async function sendMsg() {
  const val = input.value.trim();
  if (!val) return;

  chatBody.innerHTML += `<div class="ai-msg user"><span>${val}</span></div>`;
  input.value = '';

  const loadDom = document.createElement('div');
  loadDom.className = 'ai-msg bot loading-dot';
  loadDom.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(loadDom);
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    loadDom.remove();
    const reply = getReply(val);
    chatBody.innerHTML += `<div class="ai-msg bot"><span>${reply.replace(/\n/g, '<br>')}</span></div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600 + Math.random() * 800);
}

sendBtn.onclick = sendMsg;
input.onkeydown = e => e.key === 'Enter' && sendMsg();
