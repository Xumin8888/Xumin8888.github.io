---
title: Hexo 博客性能优化实践指南
date: 2026-07-01 09:00:00
categories:
  - 博客搭建
tags:
  - Hexo
  - 性能优化
top_img: /img/bj.jpg
cover: /img/1.jpg
---

## 前言

在这个快节奏的时代，网站的加载速度直接影响用户体验。研究表明，页面加载时间每增加 1 秒，转化率就会下降 7%。对于博客来说，快速的加载速度不仅能提升用户阅读体验，还能提高搜索引擎排名，减少跳出率。

Hexo 作为静态博客框架，本身性能已经不错，但如果不加以优化，随着文章数量增多、图片资源增加、各种特效开启，网站加载速度会越来越慢。本文将从图片优化、资源加载、缓存策略、CDN 加速等多个方面，详细介绍 Hexo 博客的性能优化实践。

## 一、性能优化概述

### 1.1 为什么要做性能优化

- **用户体验**：加载快的网站用户更愿意停留和阅读
- **SEO 排名**：搜索引擎会把页面速度作为排名因素之一
- **降低跳出率**：加载慢会导致用户直接离开
- **节省流量**：优化后的资源更小，访问同样的内容消耗流量更少

### 1.2 性能检测工具

在优化之前，先了解一下常用的性能检测工具，可以帮助我们量化优化效果：

**在线检测工具：**
- **PageSpeed Insights**：Google 官方的性能检测工具，<https://pagespeed.web.dev/>
- **WebPageTest**：功能强大的网站性能测试，<https://www.webpagetest.org/>
- **GTmetrix**：综合性能检测，<https://gtmetrix.com/>
- **Lighthouse**：Chrome 开发者工具内置的审计工具

**浏览器开发者工具：**
- 打开 Chrome 开发者工具（F12）→ Network 面板
- 勾选「Disable cache」，刷新页面查看加载时间
- 查看瀑布图，分析各个资源的加载时间

### 1.3 核心性能指标

关注以下几个核心指标：

- **FCP（First Contentful Paint）**：首次内容绘制，页面开始显示内容的时间
- **LCP（Largest Contentful Paint）**：最大内容绘制，主要内容加载完成的时间
- **TTI（Time to Interactive）**：可交互时间，页面可以响应用户操作的时间
- **CLS（Cumulative Layout Shift）**：累计布局偏移，页面元素意外移动的程度

一般来说，LCP 控制在 2.5 秒以内，FCP 控制在 1.5 秒以内就算不错的成绩。

## 二、图片优化

图片通常是网页中体积最大的资源，图片优化是性能优化的重中之重。

### 2.1 图片压缩

在把图片放到博客之前，先进行压缩处理。

#### 在线压缩工具

- **TinyPNG**：<https://tinypng.com/>，支持 PNG 和 JPG，压缩率高，操作简单
- **iLoveIMG**：<https://www.iloveimg.com/zh-cn/compress-image>，支持多种格式
- **Squoosh**：<https://squoosh.app/>，Google 出品，可以实时对比效果

#### 本地压缩工具

如果你有很多图片需要压缩，可以使用本地工具：

**Node.js 脚本批量压缩：**

安装依赖：
```bash
npm install imagemin imagemin-mozjpeg imagemin-pngquant --save-dev
```

创建压缩脚本：
```javascript
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
  await imagemin(['source/img/*.{jpg,png}'], {
    destination: 'source/img-optimized/',
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
  console.log('图片压缩完成！');
})();
```

#### 图片压缩建议

- **JPG/JPEG**：适合照片类图片，质量设置 70-85 比较合适
- **PNG**：适合图标、透明背景的图片
- **WebP**：新一代图片格式，同样质量体积更小（注意兼容性）
- **GIF**：尽量避免使用，短视频可以考虑用 MP4 代替

### 2.2 选择合适的图片尺寸

很多人会直接把相机拍出的原图（几 MB 甚至十几 MB）放到博客上，这是非常影响加载速度的。

**图片尺寸建议：**

| 图片用途 | 建议宽度 | 说明 |
|---------|---------|------|
| 文章内图片 | 800-1200px | 宽度足够即可，太大没有意义 |
| 封面图/缩略图 | 400-600px | 列表中显示的小图 |
| 顶部背景图 | 1920px | 适配大多数屏幕宽度 |
| 头像 | 200-300px | 不需要太大 |

**调整图片尺寸的工具：**
- Windows 自带的「画图」工具
- Photoshop / GIMP
- 在线工具：<https://www.iloveimg.com/zh-cn/resize-image>

### 2.3 图片懒加载

懒加载就是让图片在进入视口之前不加载，只有当用户滚动到图片附近时才加载。这样可以加快首屏加载速度，节省流量。

#### Butterfly 主题内置懒加载

Butterfly 主题已经内置了图片懒加载功能，直接在配置文件中开启即可：

```yaml
lazyload:
  enable: true
  # 加载中的占位图（可选）
  placeholder: /img/loading.gif
  # 加载失败时显示的图片（可选）
  errorimg: /img/error.jpg
```

开启后，文章中的图片会自动应用懒加载。

#### 手动实现（如果主题不支持）

如果你的主题没有内置懒加载，可以使用 `lozad.js` 等库手动实现：

安装插件：
```bash
npm install hexo-lazyload-image --save
```

在 `_config.yml` 中配置：
```yaml
lazyload:
  enable: true
  onlypost: false
  loadingImg: /img/loading.gif
```

### 2.4 使用 WebP 格式

WebP 是 Google 推出的新一代图片格式，在保持相同画质的情况下，体积比 JPG 和 PNG 小 25%-35%。

但需要注意浏览器兼容性问题（不过现在主流浏览器都支持了）。

**转换工具：**
- **XnConvert**：<https://www.xnview.com/en/xnconvert/>
- **在线转换**：<https://convertio.co/zh/jpg-webp/>

**使用 WebP 并提供降级方案：**

在主题中可以使用 `<picture>` 标签，让支持 WebP 的浏览器加载 WebP，不支持的加载原图：

```html
<picture>
  <source srcset="/img/photo.webp" type="image/webp">
  <img src="/img/photo.jpg" alt="描述">
</picture>
```

> 这个需要修改主题源码，有一定基础的同学可以尝试。

## 三、资源优化

### 3.1 精简 CSS 和 JS

#### 按需启用主题功能

Butterfly 主题功能很多，但很多功能你可能用不上。检查一下主题配置，把不需要的功能关掉：

```yaml
# 不需要的特效可以关掉
fireworks:
  enable: false  # 鼠标点击烟花效果

canvas_nest:
  enable: false  # 首页线条动画

click_heart:
  enable: false  # 点击爱心效果
```

这些特效虽然好看，但都会增加 JS 体积和运行时消耗。如果追求性能，建议只保留真正需要的功能。

#### 移除不必要的第三方库

检查博客中是否引入了用不到的第三方库，比如：
- 没用的统计代码
- 多余的字体文件
- 不使用的插件脚本

### 3.2 字体优化

#### 使用系统字体

如果不是特别需要，优先使用系统字体，避免加载外部字体文件：

```yaml
# 主题字体配置，优先系统字体
font:
  global-font-size: 16px
  code-font-size: 14px
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

#### 字体子集化

如果一定要使用自定义字体，建议对字体进行子集化处理，只保留需要的字符。

工具推荐：
- **Fontmin**：<http://ecomfe.github.io/fontmin/>
- **字蛛（Font-Spider）**：<http://font-spider.org/>

### 3.3 代码压缩

Hexo 生成静态文件时，可以对 HTML、CSS、JS 进行压缩。

#### 安装压缩插件

```bash
npm install hexo-all-minifier --save
```

#### 配置压缩选项

在 `_config.yml` 中添加：

```yaml
all_minifier: true
html_minifier:
  enable: true
  exclude:
    - '**/demos/**'  # 排除 demos 目录，避免破坏嵌入的项目

css_minifier:
  enable: true

js_minifier:
  enable: true
  exclude:
    - '**/*.min.js'

image_minifier:
  enable: false  # 图片压缩建议手动控制，关掉自动压缩
```

> 注意：开启压缩后，生成速度会变慢一些，但部署后的文件体积会更小。

## 四、CDN 加速

CDN（内容分发网络）可以把你的网站资源缓存到全球各地的节点，用户访问时从最近的节点获取，从而加快访问速度。

### 4.1 静态资源 CDN

对于 jsDelivr、cdnjs 等公共 CDN 上有的库，可以改用 CDN 地址。

Butterfly 主题支持配置 CDN：

```yaml
CDN:
  # 内部选项，请勿随意修改
  option:
    jquery_cdn: https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
    fontawesome_css: https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.0/css/all.min.css
    # 更多 CDN 配置...
```

使用 CDN 的好处：
- 分担服务器流量
- 从就近节点加载，速度更快
- 浏览器可能已经缓存过，直接使用

### 4.2 图片 CDN

如果图片比较多，可以考虑使用图床服务：

- **微博图床**：免费但稳定性一般
- **SM.MS**：<https://sm.ms/>，免费版有空间限制
- **七牛云 / 又拍云**：有免费额度，稳定可靠
- **GitHub + jsDelivr**：把图片放 GitHub，通过 jsDelivr 访问

**GitHub + jsDelivr 使用方法：**

1. 在 GitHub 创建一个专门放图片的仓库，比如 `blog-images`
2. 把图片上传到仓库
3. 使用 jsDelivr 的 CDN 地址访问：

```
https://cdn.jsdelivr.net/gh/你的用户名/仓库名/图片路径
```

例如：
```
https://cdn.jsdelivr.net/gh/username/blog-images/photo.jpg
```

### 4.3 全站 CDN

如果对速度要求比较高，可以考虑使用全站 CDN：

- **Cloudflare**：<https://www.cloudflare.com/>，免费版功能足够个人博客使用
- **七牛云**：国内访问速度快，需要备案
- **又拍云**：有联盟计划，博客可以申请免费额度

**Cloudflare 配置步骤（以 GitHub Pages 为例）：**

1. 注册 Cloudflare 账号
2. 添加你的站点
3. 按照提示修改域名的 DNS 服务器
4. 等待 DNS 生效
5. 在 Cloudflare 中开启缓存和优化功能

Cloudflare 免费版提供的功能：
- 全球 CDN 加速
- 免费 SSL 证书
- 基础的 DDoS 防护
- 自动压缩静态资源

> 注意：GitHub Pages 自定义域名 + Cloudflare 是很不错的组合，既免费又能获得不错的速度。

## 五、缓存策略

### 5.1 HTTP 缓存

合理设置 HTTP 缓存头，可以让用户再次访问时直接使用本地缓存，不需要重新下载。

如果使用 Cloudflare，可以在 Cache Rules 中配置缓存规则：

- HTML 页面：缓存时间短一些（比如 1 小时），保证内容能及时更新
- 图片、CSS、JS：缓存时间长一些（比如 7 天或 30 天），这些文件变化少

### 5.2 Service Worker

Service Worker 可以实现更高级的缓存策略，让博客在离线时也能访问。

Butterfly 主题支持 PWA（渐进式 Web 应用）：

```yaml
pwa:
  enable: true
  manifest: /manifest.json
  # 主题颜色
  theme_color: "#006bee"
  # 图标
  icon: /img/pwa-icon.png
```

还需要安装 hexo-offline 插件：

```bash
npm install hexo-offline --save
```

在 `_config.yml` 中配置：

```yaml
# offline config passed to sw-precache.
offline:
  maximumFileSizeToCacheInBytes: 5242880
  staticFileGlobs:
    - public/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2,xml,json}
  stripPrefix: public
  runtimeCaching:
    - urlPattern: /**/*
      handler: cacheFirst
      options:
        origin: cdn.jsdelivr.net
```

开启 PWA 后：
- 用户访问过的页面可以离线访问
- 可以添加到桌面，像 App 一样打开
- 再次访问速度更快

## 六、其他优化技巧

### 6.1 文章摘要

首页如果显示全文，页面会很长，加载也慢。建议使用摘要功能。

#### 自动摘要

在 `_config.yml` 中设置：

```yaml
# 首页文章显示的字数（自动截断）
excerpt_length: 200
```

#### 手动摘要

在文章中使用 `<!-- more -->` 标记：

```markdown
这里是文章摘要部分...

<!-- more -->

这里是文章正文...
```

这样首页就只会显示 `<!-- more -->` 之前的内容。

### 6.2 减少首页文章数量

如果首页显示太多文章，也会影响加载速度。

在 `_config.yml` 中调整：

```yaml
# 每页显示 10 篇文章，根据需要调整
per_page: 10
```

### 6.3 开启 Gzip 压缩

如果你的服务器或 CDN 支持 Gzip 或 Brotli 压缩，一定要开启。文本类资源压缩后体积可以减少 60%-80%。

GitHub Pages 默认是开启 Gzip 的。

如果使用 Nginx，可以在配置中添加：
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 6.4 DNS 预解析

对于页面中引用的外部资源，可以提前进行 DNS 解析，减少请求时的 DNS 查询时间。

在主题的 `head` 部分添加：

```html
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
```

Butterfly 主题可以通过配置添加。

### 6.5 预连接

对于重要的第三方域名，可以建立预连接：

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net">
```

## 七、优化建议优先级

这么多优化点，应该先做哪个？这里给一个优先级建议：

### 高优先级（投入小，收益大）

1. **图片压缩**：把所有图片都压缩一遍，效果最明显
2. **图片懒加载**：开启主题自带的懒加载功能
3. **关闭不需要的特效**：不用的功能都关掉
4. **开启 Gzip 压缩**：确保服务器开启了压缩

### 中优先级

1. **使用 CDN**：静态资源走 CDN
2. **代码压缩**：开启 hexo-all-minifier
3. **合理设置缓存**：配置缓存策略
4. **字体优化**：尽量用系统字体

### 低优先级（投入大，收益小）

1. **PWA/Service Worker**：提升二次访问速度
2. **WebP 格式图片**：需要处理兼容性
3. **HTTP/2**：需要服务器支持
4. **各种预加载/预解析**：细节优化

## 八、性能优化注意事项

### 8.1 不要过度优化

性能优化是为了提升用户体验，不要为了优化而优化，影响了网站的正常功能和美观度。

比如：
- 图片压缩太厉害导致画质太差
- 把所有动画都关掉，网站变得很呆板
- 为了减少请求数，把所有 JS 打包成一个巨大的文件

找到性能和体验的平衡点最重要。

### 8.2 优化后要测试

每做完一项优化，都要测试一下：
1. 网站功能是否正常
2. 视觉效果有没有受影响
3. 速度有没有实际提升

不要改了一堆配置，结果把网站搞坏了。

### 8.3 定期检测

网站是不断迭代的，文章在增加，功能在变化，性能也会变化。建议每隔一段时间（比如一个月）做一次性能检测，看看有没有需要优化的地方。

## 总结

Hexo 博客的性能优化是一个系统性的工程，涉及图片、代码、网络、缓存等多个方面。回顾一下本文介绍的主要内容：

1. **图片优化**：压缩、调整尺寸、懒加载、WebP 格式
2. **资源优化**：精简功能、字体优化、代码压缩
3. **CDN 加速**：静态资源 CDN、图片 CDN、全站 CDN
4. **缓存策略**：HTTP 缓存、Service Worker
5. **其他技巧**：文章摘要、减少首页文章数、Gzip 压缩

性能优化没有银弹，需要根据自己博客的实际情况选择合适的优化方案。建议先从高优先级的优化项做起，用工具检测效果，逐步提升。

记住，性能优化不是一蹴而就的事情，而是一个持续改进的过程。希望本文能帮助你打造一个既美观又快速的个人博客！
