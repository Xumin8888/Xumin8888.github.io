---
title: Hexo 博客从零搭建到部署完全教程
date: 2026-01-05 09:00:00
categories:
  - 博客搭建
tags:
  - Hexo
  - 教程
  - 博客搭建
top_img: /img/bj.jpg
cover: /img/6.jpg
---

## 前言

Hexo 是一个快速、简洁且高效的博客框架，使用 Markdown 解析文章，几秒内即可生成静态网页。本文将从零开始，带你一步步搭建属于自己的 Hexo 博客并部署到 GitHub Pages。

## 一、环境准备

### 1.1 安装 Node.js

Hexo 依赖 Node.js，所以首先需要安装：

- **推荐版本**：Node.js 14.0+
- **下载地址**：https://nodejs.org/

安装完成后验证：

```bash
node -v
npm -v
```

### 1.2 安装 Git

```bash
git --version
```

### 1.3 安装 Hexo CLI

```bash
npm install -g hexo-cli
```

## 二、初始化博客

### 2.1 创建博客

```bash
hexo init my-blog
cd my-blog
npm install
```

### 2.2 目录结构

```
my-blog/
├── _config.yml      # 网站配置
├── package.json     # 应用信息
├── scaffolds/       # 模板文件夹
├── source/          # 资源文件夹
│   └── _posts/      # 文章
└── themes/          # 主题文件夹
```

### 2.3 常用命令

```bash
hexo new "文章标题"    # 新建文章
hexo generate        # 生成静态文件
hexo server          # 启动本地服务器
hexo deploy          # 部署网站
hexo clean           # 清除缓存
hexo g               # generate 简写
hexo s               # server 简写
hexo d               # deploy 简写
```

## 三、基础配置

### 3.1 网站配置

打开 `_config.yml`：

```yaml
# Site
title: 我的博客          # 网站标题
subtitle: 记录技术与生活  # 网站副标题
description: 前端技术博客  # 网站描述
keywords: 前端,博客,Hexo  # 关键词
author: Your Name       # 作者
language: zh-CN         # 语言
timezone: Asia/Shanghai # 时区

# URL
url: https://yourname.github.io
root: /
permalink: :year/:month/:day/:title/
```

### 3.2 主题配置

**安装 Butterfly 主题：**

```bash
npm install hexo-theme-butterfly
```

修改 `_config.yml`：

```yaml
theme: butterfly
```

**创建主题配置文件：**

```bash
# 方式一：复制配置文件
cp node_modules/hexo-theme-butterfly/_config.yml _config.butterfly.yml

# 方式二：在根目录创建 _config.butterfly.yml
```

### 3.3 安装必要插件

```bash
# 部署插件
npm install hexo-deployer-git --save

# 搜索插件
npm install hexo-generator-search --save

# 站点地图
npm install hexo-generator-sitemap --save

# RSS
npm install hexo-generator-feed --save
```

## 四、写作指南

### 4.1 新建文章

```bash
hexo new "文章标题"
```

### 4.2 Front-matter

文章开头的 YAML 配置：

```yaml
---
title: 文章标题
date: 2026-01-01 12:00:00
categories:
  - 分类1
  - 分类2
tags:
  - 标签1
  - 标签2
top: false       # 是否置顶
cover: /img/cover.jpg  # 封面图
top_img: /img/top.jpg  # 顶部图
---
```

### 4.3 Markdown 语法

Hexo 支持标准 Markdown 和一些扩展语法：

```markdown
## 标题

**粗体** *斜体* ~~删除线~~

> 引用

- 列表项1
- 列表项2

`行内代码`

```javascript
// 代码块
function hello() {
  console.log('Hello Hexo!')
}
```

[链接文字](https://example.com)

![图片描述](/img/example.jpg)

| 列1 | 列2 |
| --- | --- |
| 内容1 | 内容2 |
```

### 4.4 资源文件夹

```
source/
├── _posts/
│   └── 文章标题.md
├── img/          # 图片资源
├── css/          # 自定义样式
├── js/           # 自定义脚本
└── about/        # 关于页面
    └── index.md
```

## 五、页面创建

### 5.1 分类页

```bash
hexo new page categories
```

编辑 `source/categories/index.md`：

```yaml
---
title: 分类
type: "categories"
date: 2026-01-01
---
```

### 5.2 标签页

```bash
hexo new page tags
```

```yaml
---
title: 标签
type: "tags"
date: 2026-01-01
---
```

### 5.3 关于页

```bash
hexo new page about
```

```yaml
---
title: 关于我
date: 2026-01-01
---

## 关于我

这里写关于你的内容...
```

## 六、部署到 GitHub Pages

### 6.1 创建 GitHub 仓库

1. 新建仓库，名称为 `yourname.github.io`
2. 仓库设为 Public

### 6.2 配置部署

修改 `_config.yml`：

```yaml
deploy:
  type: git
  repo: https://github.com/yourname/yourname.github.io.git
  branch: gh-pages
  message: "Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}"
```

### 6.3 执行部署

```bash
hexo clean && hexo g && hexo d
```

### 6.4 配置自定义域名（可选）

1. 在域名服务商添加 CNAME 记录
2. 在 `source` 目录创建 `CNAME` 文件，写入你的域名

## 七、常用优化

### 7.1 永久链接优化

```yaml
# _config.yml
permalink: :title/
```

### 7.2 添加搜索功能

```yaml
# _config.yml
search:
  path: search.xml
  field: post
  content: true
  format: html
```

### 7.3 开启 RSS

```yaml
# _config.yml
feed:
  type: atom
  path: atom.xml
  limit: 20
```

## 八、常见问题

### 8.1 部署后样式丢失

执行 `hexo clean` 后重新生成部署：

```bash
hexo clean && hexo g -d
```

### 8.2 图片不显示

确保图片路径正确，放在 `source/img/` 目录下，引用路径为 `/img/xxx.jpg`。

### 8.3 中文文件名乱码

```bash
git config --global core.quotepath false
```

## 九、主题美化（Butterfly）

### 9.1 导航菜单

```yaml
# _config.butterfly.yml
menu:
  首页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
  关于: /about/ || fas fa-user
```

### 9.2 社交链接

```yaml
social:
  fab fa-github: https://github.com/yourname || GitHub
  fas fa-envelope: mailto:you@example.com || Email
```

### 9.3 代码高亮

```yaml
highlight_theme: mac
highlight_height_limit: 300
```

## 十、总结

搭建 Hexo 博客的步骤：

1. ✅ 安装 Node.js 和 Git
2. ✅ 安装 Hexo CLI
3. ✅ 初始化博客
4. ✅ 配置网站信息
5. ✅ 安装和配置主题
6. ✅ 新建文章和页面
7. ✅ 部署到 GitHub Pages

博客搭建只是开始，持续输出优质内容才是最重要的！
