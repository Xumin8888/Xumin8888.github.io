---
title: Hexo Butterfly 主题配置完全指南
date: 2026-06-15 10:00:00
categories:
  - 博客搭建
tags:
  - Hexo
  - 项目实战
top_img: /img/bj.jpg
cover: /img/4.jpg
---

## 前言

Butterfly 是目前 Hexo 生态中最受欢迎的主题之一，以其精美的界面设计、丰富的功能特性和高度的可定制性深受用户喜爱。无论是导航栏、背景图、侧边栏，还是页脚、文章样式、动画效果，Butterfly 都提供了详尽的配置选项。

本文将系统性地介绍 Butterfly 主题的各项核心配置，从基础的导航菜单到高级的页面美化，帮助你打造一个独一无二的个人博客。无论你是刚接触 Butterfly 的新手，还是想要深入定制主题的老用户，都能在本文中找到有价值的内容。

## 一、主题安装与基础配置

### 1.1 安装 Butterfly 主题

如果你还没有安装主题，先执行以下命令：

```bash
# 在博客根目录下执行
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

安装必要的渲染插件：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

### 1.2 启用主题

打开 Hexo 根目录的 `_config.yml`，找到 `theme` 配置项：

```yaml
theme: butterfly
```

### 1.3 主题配置文件说明

Butterfly 主题的所有配置都在 `themes/butterfly/_config.yml` 文件中。这个文件内容比较多，但不用担心，我们会分门别类地讲解。

> **最佳实践**：建议不要直接修改主题目录下的 `_config.yml`，而是在 Hexo 根目录创建一个 `_config.butterfly.yml` 文件，把自定义配置写在那里。这样主题更新时不会覆盖你的配置。

创建方式：
1. 复制 `themes/butterfly/_config.yml` 到博客根目录
2. 重命名为 `_config.butterfly.yml`
3. 以后修改配置就改这个文件

## 二、导航栏配置

导航栏是博客的门户，合理配置导航栏能让访客快速找到想要的内容。

### 2.1 基础菜单配置

在主题配置文件中搜索 `menu`：

```yaml
menu:
  首页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  分类: /categories/ || fas fa-folder-open
  标签: /tags/ || fas fa-tags
  留言板: /messageboard/ || fas fa-comments
  关于: /about/ || fas fa-heart
```

**菜单格式说明：**
```
菜单名: 路径 || 图标类名
```

- `菜单名`：显示在导航栏上的文字
- `路径`：点击后跳转的链接
- `图标`：使用 Font Awesome 图标，格式为 `fas fa-xxx` 或 `fa fa-xxx`

### 2.2 二级菜单（下拉菜单）

Butterfly 支持二级下拉菜单，配置方式如下：

```yaml
menu:
  首页: / || fas fa-home
  文章:
    归档: /archives/ || fas fa-archive
    分类: /categories/ || fas fa-folder-open
    标签: /tags/ || fas fa-tags
  作品集: /projects/ || fas fa-th
  关于:
    关于我: /about/ || fas fa-user
    留言板: /messageboard/ || fas fa-comments
```

### 2.3 图标查找

菜单项的图标可以在 [Font Awesome 官网](https://fontawesome.com/icons) 查找。注意 Butterfly 使用的是 Font Awesome 5 版本，图标名称需要对应。

常用图标参考：
- `fas fa-home`：首页
- `fas fa-archive`：归档
- `fas fa-folder-open`：分类
- `fas fa-tags`：标签
- `fas fa-user`：用户/关于
- `fas fa-comments`：评论/留言
- `fas fa-th`：作品/相册
- `fas fa-book`：书籍/文章
- `fas fa-link`：友链

## 三、背景图与顶部图配置

### 3.1 网站背景图

配置全站的背景图片：

```yaml
# 网站背景图
background: /img/bj.jpg

# 背景图透明度（可选）
opacity: 0.8
```

如果想要纯色背景：

```yaml
background: '#f5f5f5'
```

### 3.2 首页顶部图

首页顶部的大图（Hero 区域）：

```yaml
# 首页顶部图
index_img: /img/bj.jpg
```

如果不想要顶部图，可以设置为 `false`：

```yaml
index_img: false
```

### 3.3 文章顶部图

每篇文章的顶部图有几种配置方式：

**全局默认文章顶部图：**
```yaml
# 默认文章顶部图
post_img: /img/default-post.jpg
```

**单篇文章顶部图（在文章的 front-matter 中设置）：**
```markdown
---
title: 文章标题
date: 2026-01-01
top_img: /img/specific-post.jpg
cover: /img/cover.jpg
---
```

**按分类/标签设置不同的顶部图（更高级）：**
可以通过修改主题源码实现，建议有一定基础后再尝试。

### 3.4 归档/分类/标签页顶部图

```yaml
# 归档页顶部图
archive_img: /img/archive.jpg

# 分类页顶部图
category_img: /img/category.jpg

# 标签页顶部图
tag_img: /img/tag.jpg
```

## 四、侧边栏配置

侧边栏是 Butterfly 主题的特色之一，可以展示个人信息、文章分类、热门文章等。

### 4.1 侧边栏位置与显示

```yaml
aside:
  # 是否启用侧边栏
  enable: true
  
  # 侧边栏位置：left 或 right
  position: right
  
  # 是否在移动端显示侧边栏按钮
  mobile: true
  
  # 侧边栏显示的内容（按顺序）
  card:
    card_author: true       # 作者信息卡片
    card_announcement: true # 公告卡片
    card_recent_post: true  # 最新文章
    card_categories: true   # 文章分类
    card_tags: true         # 文章标签
    card_archives: true     # 归档
    card_webinfo: true      # 网站信息
```

### 4.2 作者信息卡片

这是侧边栏最重要的部分，展示你的个人信息：

```yaml
# 作者头像
avatar:
  img: /img/avatar.jpg
  # 鼠标悬停时是否旋转
  effect: true

# 作者名称（如果不设置会使用 _config.yml 中的 author）
author: 你的名字

# 个人介绍/签名
introduction: 热爱技术，热爱生活

# 社交链接
social:
  fab fa-github: https://github.com/你的用户名 || GitHub
  fas fa-envelope: mailto:your@email.com || Email
  fab fa-qq: tencent://message/?uin=你的QQ号 || QQ
  fab fa-weixin: javascript:; || 微信
  fab fa-zhihu: https://www.zhihu.com/people/你的用户名 || 知乎
```

社交链接格式：
```
图标类名: 链接 || 提示文字
```

### 4.3 公告卡片

在侧边栏显示一条公告：

```yaml
announcement: >
  <p>欢迎来到我的博客！</p>
  <p>这里记录我的学习与生活~</p>
```

支持 HTML 标签，可以写得更丰富。

### 4.4 标签云配置

自定义侧边栏标签云的样式：

```yaml
tagcloud:
  # 标签云颜色是否随标签数量变化
  color: true
  
  # 最小字号
  min_font: 12
  
  # 最大字号
  max_font: 30
  
  # 起始颜色（十六进制）
  start_color: '#a4d8fa'
  
  # 结束颜色
  end_color: '#337ab7'
```

## 五、页脚配置

页脚位于博客底部，通常显示版权信息、备案号等。

### 5.1 基础页脚配置

```yaml
footer:
  # 页脚背景图（可选）
  footer_bg: false
  
  # 版权信息
  copyright:
    # 是否显示 Hexo 主题信息
    enable: true
    
    # 自定义版权文字
    copyright: © 2024 你的博客名
    
    # 备案号（可选）
    icp: 京ICP备xxxxxxx号
    
    # 公安备案号（可选）
    psb: 
      url: http://www.beian.gov.cn
      text: 京公网安备xxxxxxxxxx号
```

### 5.2 页脚自定义内容

如果想要在页脚添加更多内容，可以使用 `footer_custom_text`：

```yaml
footer_custom_text: 
```

支持 HTML，可以添加友情链接、统计代码等。

## 六、文章页面配置

### 6.1 文章封面图

文章列表中显示的封面图：

```yaml
# 默认是否显示封面
cover:
  index_enable: true
  aside_enable: true
  archives_enable: true
  
  # 封面图在文章列表中的位置：left 或 right
  position: both
  
  # 默认封面（文章没有设置 cover 时使用）
  default_cover:
    - /img/1.jpg
    - /img/2.jpg
    - /img/3.jpg
```

单篇文章的封面在 front-matter 中设置：
```yaml
cover: /img/post-cover.jpg
```

### 6.2 文章元信息

文章标题下方显示的信息：

```yaml
post_meta:
  page: # 文章列表页
    date_type: both  # 显示创建日期还是更新日期，或都显示
    date_format: date  # 日期格式
    categories: true  # 是否显示分类
    tags: false  # 是否显示标签
  post: # 文章详情页
    date_type: both
    date_format: date
    categories: true
    tags: true
```

### 6.3 文章版权信息

在文章末尾显示版权声明：

```yaml
post_copyright:
  enable: true
  decode: false
  author_href: 
  license: CC BY-NC-SA 4.0
  license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
```

### 6.4 文章分页

```yaml
post_pagination: true  # 上一篇/下一篇
```

## 七、代码高亮配置

Butterfly 提供了多种代码高亮主题可供选择。

### 7.1 代码高亮主题

```yaml
highlight_theme: mac  # 可选：darker / pale night / light / ocean / mac / 等
```

常用主题：
- `mac`：类似 macOS 终端风格（推荐）
- `darker`：深色主题
- `light`：浅色主题
- `ocean`：海洋蓝风格

### 7.2 代码复制按钮

```yaml
highlight_copy: true  # 是否显示复制按钮
highlight_lang: true  # 是否显示代码语言
highlight_shrink: false  # 是否默认折叠代码块
```

### 7.3 代码行号

```yaml
# 行号显示：true / false / 'both'
line_number: true
```

## 八、搜索功能

Butterfly 支持本地搜索功能，不需要依赖第三方服务。

### 8.1 安装搜索插件

```bash
npm install hexo-generator-search --save
```

### 8.2 配置搜索功能

在主题配置文件中：

```yaml
search:
  enable: true
  path: search.xml
  placeholder: 搜索...
  maxlength: 2000  # 每篇文章索引的最大字符数
```

在 Hexo 根目录 `_config.yml` 中添加：

```yaml
search:
  path: search.xml
  field: post
  content: true
  format: html
```

配置完成后，导航栏会出现搜索图标。

## 九、阅读进度与返回顶部

### 9.1 阅读进度条

在页面顶部显示阅读进度：

```yaml
reading_progress:
  enable: true
  color: '#00c4b6'
  height: 2px
```

### 9.2 返回顶部按钮

```yaml
back_to_top:
  enable: true
  bar: false  # 是否显示滚动条
  go_percent: 0.3  # 滚动到多少位置时显示按钮
```

## 十、特效与动画

Butterfly 内置了很多有趣的特效，可以根据喜好开启。

### 10.1 鼠标点击特效

```yaml
# 鼠标点击烟花效果
fireworks:
  enable: true
  
  # 粒子颜色
  colors:
    - '#FF5A5F'
    - '#FFBD00'
    - '#18DF18'
    - '#1DD6FF'
    - '#994FFF'
```

### 10.2 页面打字效果

首页副标题打字机效果：

```yaml
subtitle:
  enable: true
  # 打字效果的文字，可以有多条
  sub: 
    - 欢迎来到我的博客
    - 记录技术，分享生活
    - Stay hungry, stay foolish
  # 打字速度
  startDelay: 300
  typeSpeed: 150
  # 回退速度
  backSpeed: 50
  # 循环
  loop: true
```

### 10.3 图片懒加载

```yaml
lazyload:
  enable: true
  placeholder: /img/loading.gif  # 加载中的占位图
```

### 10.4 图片放大功能

点击图片可以放大查看：

```yaml
fancybox: true
```

## 十一、404 页面

自定义 404 页面：

在 `source/` 目录下创建 `404.md`：

```markdown
---
title: 404 - 页面不见了
date: 2026-01-01 00:00:00
type: "404"
layout: "404"
top_img: /img/404.jpg
description: 你访问的页面不存在或已被删除
---
```

主题配置中可以设置 404 图片：

```yaml
error_404:
  enable: true
  subtitle: 页面不存在
  background: /img/404-bg.jpg
```

## 十二、常用页面创建

### 12.1 分类页

```bash
hexo new page categories
```

编辑 `source/categories/index.md`：
```markdown
---
title: 分类
date: 2026-01-01 00:00:00
type: "categories"
layout: "categories"
top_img: /img/bj.jpg
---
```

### 12.2 标签页

```bash
hexo new page tags
```

编辑 `source/tags/index.md`：
```markdown
---
title: 标签
date: 2026-01-01 00:00:00
type: "tags"
layout: "tags"
top_img: /img/bj.jpg
---
```

### 12.3 关于页

```bash
hexo new page about
```

编辑 `source/about/index.md`，在其中编写你的个人介绍。

### 12.4 留言板

```bash
hexo new page messageboard
```

编辑 `source/messageboard/index.md`：
```markdown
---
title: 留言板
date: 2026-01-01 00:00:00
top_img: /img/bj.jpg
---

欢迎留言交流~
```

然后配置评论系统，留言板就会自动显示评论区。

## 十三、配置优化建议

### 13.1 不要盲目开启所有功能

Butterfly 功能很多，但不建议全部开启。功能越多，页面加载越慢。只开启你真正需要的功能。

推荐必开功能：
- 搜索功能
- 代码高亮与复制
- 返回顶部
- 图片懒加载

可选功能（按需开启）：
- 鼠标点击特效
- 打字机效果
- 烟花特效

### 13.2 图片资源优化

- 所有背景图、封面图建议压缩后再使用
- 图片格式优先使用 WebP（需要浏览器支持）
- 图片尺寸不要过大，一般宽度 1920px 足够

### 13.3 配置文件格式注意

YAML 配置文件对格式要求很严格：
- 使用 2 个空格缩进
- 冒号后面必须有空格
- 列表使用 `- ` 开头
- 字符串包含特殊字符时用引号括起来

修改配置后建议先本地预览：
```bash
hexo clean && hexo g && hexo s
```

确认没问题再部署。

## 十四、主题更新

Butterfly 主题更新比较频繁，定期更新可以获得新功能和 bug 修复。

### 14.1 更新主题

```bash
cd themes/butterfly
git pull
```

### 14.2 注意事项

- 更新前备份你的主题配置
- 如果你使用了 `_config.butterfly.yml`，主题更新不会影响你的配置
- 大版本更新时注意查看更新日志，可能有不兼容的配置变更

## 总结

Butterfly 主题的配置选项非常丰富，本文只涵盖了最常用的部分。更多高级配置和功能可以参考 [Butterfly 官方文档](https://butterfly.js.org/)。

配置主题是一个循序渐进的过程，不用追求一次配置完美。先把基础功能配置好，博客正常运行起来，然后再慢慢美化和优化。享受折腾的过程，也是搭建博客的乐趣之一。

希望本文能帮助你更好地配置 Butterfly 主题，打造一个令自己满意的个人博客！
