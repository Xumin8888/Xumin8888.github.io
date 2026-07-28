const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'source', '_posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const postConfigs = {
    'Axios.md': {
        categories: ['前端'],
        tags: ['前端', 'Axios', '网络请求']
    },
    'h5小程序项目上传博客.md': {
        categories: ['项目'],
        tags: ['uni-app', '小程序', 'Hexo']
    },
    'hello-world.md': {
        categories: ['随笔'],
        tags: ['随笔']
    },
    'Hexo 部署错误解决.md': {
        categories: ['博客搭建'],
        tags: ['Hexo', '报错解决']
    },
    'NodeJS.md': {
        categories: ['前端'],
        tags: ['NodeJS', '后端']
    },
    '《AI 多模型问答项目 开发修改 + GitHub 开源全流程总结》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实战', '项目']
    },
    '《全文检索 VS FAISS 向量检索》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实操', '向量数据库']
    },
    '《前端fetch请求大模型API踩坑汇总》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实操', '前端']
    },
    '《多厂商大模型API统一接入实战-DeepSeek豆包通义一站式调用》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实战', 'API']
    },
    '《多模型 AI 问答（全文  FAISS 向量双检索 + 多 PDF 上传》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实战', '向量数据库']
    },
    '《多模型通用 AI 问答｜简易 PDF 知识库版 从零搭建实战》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实战', '知识库']
    },
    '《手把手给 Hexo 博客接入 AI 对话机器人》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实操', 'Hexo']
    },
    '《解决致命问题：前端直接调用大模型密钥泄露 + 跨域 CORS 彻底解决方案》.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '实操', '跨域安全']
    },
    '个人博客.md': {
        categories: ['博客搭建'],
        tags: ['Hexo', '教程']
    },
    '开篇.md': {
        categories: ['AI专栏'],
        tags: ['大模型', '开篇']
    },
    '数据大屏.md': {
        categories: ['项目'],
        tags: ['ECharts', '数据可视化', '项目']
    },
    '点餐小程序.md': {
        categories: ['项目'],
        tags: ['uni-app', '小程序', '项目']
    },
    '简历指南.md': {
        categories: ['面试专题'],
        tags: ['简历', '面试']
    },
    '线上学习系统.md': {
        categories: ['项目'],
        tags: ['uni-app', '前端', '项目']
    },
    '项目上传到博客上.md': {
        categories: ['博客搭建'],
        tags: ['Hexo', '部署', '教程']
    }
};

for (const file of files) {
    const config = postConfigs[file];
    if (!config) {
        console.log('⚠️  跳过: ' + file + ' (未配置)');
        continue;
    }
    
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const parts = content.split('---');
    if (parts.length < 3) {
        console.log('⚠️  跳过: ' + file + ' (格式不对)');
        continue;
    }
    
    let frontMatter = parts[1];
    
    frontMatter = frontMatter.replace(/categories:\s*.*\n?/g, '');
    frontMatter = frontMatter.replace(/categories:\n(?:\s+-\s+.*\n)*/g, '');
    frontMatter = frontMatter.replace(/tags:\s*.*\n?/g, '');
    frontMatter = frontMatter.replace(/tags:\n(?:\s+-\s+.*\n)*/g, '');
    
    frontMatter = frontMatter.trim() + '\n\n';
    frontMatter += 'categories:\n';
    for (const cat of config.categories) {
        frontMatter += '  - ' + cat + '\n';
    }
    
    frontMatter += 'tags:\n';
    for (const tag of config.tags) {
        frontMatter += '  - ' + tag + '\n';
    }
    
    parts[1] = '\n' + frontMatter;
    content = parts.join('---');
    
    fs.writeFileSync(filePath, content);
    console.log('✅ ' + file);
}

console.log('\n🎉 全部完成!');
