---
title: Hexo 博客接入评论系统与访客统计完全指南
date: 2026-07-10 16:00:00
categories:
  - 博客搭建
tags:
  - Hexo
  - 博客搭建
  - 项目实战
top_img: /img/bj.jpg
cover: /img/2.jpg
---

## 前言

一个博客如果只有作者单方面输出，难免有些单调。接入评论系统和访客统计，可以让你的博客更加活跃和有趣：

- **评论系统**：让读者可以留言交流，增加互动性，也能收到读者的反馈
- **访客统计**：了解博客的访问量、用户来源、热门文章等数据，帮助你更好地运营博客

Hexo 作为静态博客，本身不具备后端能力，但我们可以通过第三方服务轻松实现这些功能。本文将详细介绍几种主流的评论系统和统计工具的接入方法，帮助你选择最适合自己的方案。

## 一、评论系统方案对比

目前主流的第三方评论系统有很多，各有优缺点。下面对比几种常见的方案：

| 评论系统 | 特点 | 优点 | 缺点 | 推荐度 |
|---------|------|------|------|--------|
| **Valine** | 基于 LeanCloud，无后端 | 轻量、快速、免费 | 需要注册 LeanCloud | ⭐⭐⭐⭐⭐ |
| **Waline** | Valine 的衍生版，有管理后台 | 功能更丰富、有后台 | 配置稍复杂 | ⭐⭐⭐⭐⭐ |
| **Gitalk** | 基于 GitHub Issues | 与 GitHub 结合紧密 | 用户需要 GitHub 账号 | ⭐⭐⭐⭐ |
| **Disqus** | 国外老牌评论系统 | 功能强大、用户多 | 国内访问慢、有广告 | ⭐⭐⭐ |
| **友言 / 多说** | 国内第三方评论 | 中文友好 | 很多已停止维护 | ⭐⭐ |

对于国内用户，最推荐的是 **Valine** 和 **Waline**，部署简单，访问速度快，功能也足够用。

## 二、Valine 评论系统接入

Valine 是一款快速、简洁且高效的无后端评论系统，基于 LeanCloud，是目前 Hexo 博客最常用的评论系统之一。

### 2.1 注册 LeanCloud

1. 访问 LeanCloud 官网：<https://console.leancloud.cn/>
2. 点击「注册」，使用邮箱注册账号
3. 登录后，点击「创建应用」
4. 应用名称随便填（如 `blog-comment`），应用版本选择「开发版」（免费）
5. 点击「创建」

### 2.2 获取 App ID 和 App Key

创建应用后：

1. 进入应用 → 设置 → 应用 Keys
2. 复制 `AppID` 和 `AppKey`（这两个后面配置需要用到）

### 2.3 配置安全域名

为了防止别人盗用你的 API，建议配置安全域名：

1. 进入应用 → 设置 → 安全中心
2. 在「Web 安全域名」中添加你的博客域名，如：
   ```
   https://你的用户名.github.io
   ```
3. 点击「保存」

### 2.4 Butterfly 主题配置 Valine

Butterfly 主题已经内置了 Valine 支持，只需要在主题配置文件中开启即可。

打开 `_config.butterfly.yml`，找到 `comments` 配置：

```yaml
comments:
  # 是否使用评论
  use: Valine
  
  # 评论系统的文本（在菜单、页脚等地方显示）
  text: true
  
  # 评论系统的懒加载
  lazyload: false
  
  # 评论数统计
  count: true

# Valine 评论配置
valine:
  enable: true
  appId: 你的AppId          # 替换成你的 AppID
  appKey: 你的AppKey        # 替换成你的 AppKey
  placeholder: 说点什么吧...  # 评论框占位文字
  avatar: mp                # 头像样式
  pageSize: 10              # 每页评论数
  visitor: true             # 文章访问量统计
  lang: zh-CN               # 语言
  highlight: true           # 代码高亮
  recordIP: false           # 是否记录 IP
  serverURLs:               # 自定义 API 地址（国内版需要填）
```

> 注意：如果你使用的是 LeanCloud 国内版，需要填写 `serverURLs`，在应用设置 → 应用 Keys 中可以找到「REST API 服务器地址」。

### 2.5 启用评论

默认情况下所有文章和页面都会启用评论。

如果想在特定页面关闭评论，在页面的 front-matter 中添加：

```yaml
comments: false
```

### 2.6 Valine 管理评论

Valine 没有专门的管理后台，但你可以在 LeanCloud 中管理评论数据：

1. 进入 LeanCloud 应用 → 存储 → 数据
2. 选择 `Comment` 表
3. 在这里可以查看、删除、编辑评论

虽然不如专门的后台方便，但日常使用也够用了。

## 三、Waline 评论系统接入

Waline 是从 Valine 衍生而来的一款评论系统，除了 Valine 的所有功能外，还增加了：

- 完整的管理后台
- 评论通知（邮件、微信等）
- 更多的评论管理功能
- 更丰富的配置选项

如果你需要更强大的功能，推荐使用 Waline。

### 3.1 Waline 部署方式

Waline 需要部署后端服务，有几种部署方式：

- **Vercel 部署**：最简单，免费，推荐
- **云函数部署**：阿里云、腾讯云云函数
- **自己服务器部署**：适合有服务器的用户

这里以 Vercel 部署为例。

### 3.2 部署后端

1. 注册 Vercel 账号：<https://vercel.com/>（可以直接用 GitHub 登录）
2. 打开 Waline 的一键部署链接：<https://waline.js.org/guide/deploy/vercel.html>
3. 按照文档指引，点击 Deploy 按钮
4. 配置环境变量中的 `LEAN_ID` 和 `LEAN_KEY`（即 LeanCloud 的 AppID 和 AppKey）
5. 部署完成后，你会得到一个 Vercel 域名

### 3.3 Butterfly 主题配置 Waline

在主题配置文件中：

```yaml
comments:
  use: Waline

waline:
  enable: true
  serverURL: https://your-waline.vercel.app  # 替换成你的 Waline 服务地址
  placeholder: 说点什么吧...
  avatar: mp
  pageSize: 10
  visitor: true
  lang: zh-CN
  highlight: true
  requiredFields: []
```

### 3.4 管理后台

Waline 有专门的管理后台，访问地址：

```
https://你的-waline-地址/ui/register
```

第一次访问时注册管理员账号，之后就可以在后台管理评论了。

## 四、Gitalk 评论系统接入

Gitalk 是一个基于 GitHub Issues 的评论系统，评论内容会保存为 GitHub 仓库的 Issues。

如果你希望读者都是 GitHub 用户，或者想把评论和代码仓库放在一起，可以考虑 Gitalk。

### 4.1 创建 GitHub OAuth App

1. 登录 GitHub，进入 Settings → Developer settings → OAuth Apps
2. 点击「New OAuth App」
3. 填写信息：
   - Application name：随便填，如 `Blog Comments`
   - Homepage URL：你的博客地址
   - Application description：可选
   - Authorization callback URL：你的博客地址
4. 点击「Register application」
5. 记录下 `Client ID` 和 `Client Secret`

### 4.2 创建评论仓库

在 GitHub 上创建一个新仓库，用来存储评论（也可以直接用博客仓库）。

### 4.3 Butterfly 主题配置 Gitalk

```yaml
comments:
  use: Gitalk

gitalk:
  enable: true
  client_id: 你的ClientID
  client_secret: 你的ClientSecret
  repo: 仓库名          # 如 blog-comments
  owner: 你的GitHub用户名
  admin:
    - 你的GitHub用户名
  language: zh-CN
  perPage: 10
  distractionFreeMode: false
```

### 4.4 初始化评论

Gitalk 需要为每篇文章手动初始化评论：

1. 发布新文章后，打开文章页面
2. 使用你的 GitHub 账号登录评论
3. 点击「初始化 Issues」按钮

之后读者就可以评论了。

> 缺点：每篇文章都需要手动初始化，且读者需要有 GitHub 账号。

## 五、多种评论系统切换

Butterfly 主题支持同时配置多种评论系统，让用户选择使用哪种：

```yaml
comments:
  use:
    - Valine
    - Gitalk
  # 或者只启用一种
  # use: Valine
```

用户可以在评论区切换不同的评论系统。

## 六、访客统计方案

了解博客的访问数据对运营博客很有帮助。下面介绍几种常用的统计方案。

### 6.1 不蒜子（极简统计）

不蒜子是一个非常轻量的网页计数器，只有两行代码，适合只需要简单统计的博客。

#### 特点

- 极简，只有计数功能
- 不需要注册
- 代码量极小，不影响速度
- 有 PV（页面浏览量）和 UV（独立访客）统计

#### Butterfly 主题配置

Butterfly 主题已经内置了不蒜子统计：

```yaml
# 不蒜子统计
busuanzi:
  enable: true
  # 全站 UV
  site_uv: true
  # 全站 PV
  site_pv: true
  # 文章 PV
  page_pv: true
```

开启后，页脚或文章中会自动显示访问量。

> 不蒜子的缺点是功能比较简单，没有详细的数据分析。但对于个人博客来说，知道大概的访问量也就够了。

### 6.2 百度统计

百度统计是国内最常用的网站统计工具，功能全面，免费使用。

#### 注册与配置

1. 访问百度统计官网：<https://tongji.baidu.com/>
2. 使用百度账号登录
3. 点击「新增网站」
4. 填写网站信息：
   - 网站域名：你的博客域名
   - 网站名称：随便填
   - 行业类别：选择合适的类别
5. 点击「确定」
6. 获取代码，复制脚本内容

#### Butterfly 主题配置

在主题配置文件中找到 `baidu_push` 或 `analytics` 相关配置：

```yaml
# 百度统计
baidu_analytics: 你的百度统计ID
```

或者，如果主题没有内置，可以手动添加代码。在主题配置的 `inject` 中添加：

```yaml
inject:
  head:
    - <script>
    - var _hmt = _hmt || [];
    - (function() {
    -   var hm = document.createElement("script");
    -   hm.src = "https://hm.baidu.com/hm.js?你的统计ID";
    -   var s = document.getElementsByTagName("script")[0]; 
    -   s.parentNode.insertBefore(hm, s);
    - })();
    - </script>
```

#### 百度统计能看什么

- 访问量（PV/UV）趋势
- 访客地区分布
- 来源网站（用户从哪来的）
- 搜索关键词
- 热门页面
- 访客属性（浏览器、操作系统、分辨率等）
- 访问时长、跳出率等

### 6.3 Google Analytics（谷歌分析）

Google Analytics 是全球最流行的网站分析工具，功能非常强大。

#### 注册配置

1. 访问 Google Analytics：<https://analytics.google.com/>
2. 使用 Google 账号登录
3. 创建媒体资源，获取衡量 ID（格式如 `G-XXXXXXXXXX`）
4. 获取代码

#### Butterfly 主题配置

```yaml
# Google Analytics
google_analytics: G-XXXXXXXXXX
```

Google Analytics 的功能非常全面，但缺点是国内访问可能不太稳定，数据可能有延迟。

### 6.4 友盟 / CNZZ 等其他统计

国内还有一些其他统计工具，比如：
- 友盟+（原 CNZZ）
- 51.la
- 腾讯分析

使用方法都差不多，注册获取代码，添加到博客中即可。

## 七、文章访问量统计

除了全站统计，很多人还希望在每篇文章显示阅读量。

### 7.1 Valine 实现文章阅读量

如果使用 Valine 评论系统，可以直接用它的 visitor 功能：

```yaml
valine:
  visitor: true  # 开启文章访问量统计
```

开启后，每篇文章的标题下方会显示阅读量。

### 7.2 Waline 实现文章阅读量

同理，Waline 也支持：

```yaml
waline:
  visitor: true
```

### 7.3 不蒜子实现单页阅读量

如果用不蒜子，也可以显示单页 PV：

```yaml
busuanzi:
  page_pv: true
```

## 八、评论与统计的最佳实践

### 8.1 评论系统选择建议

**个人博客推荐：**
- 追求简单快速：**Valine**
- 需要管理后台和更多功能：**Waline**
- 主要读者是开发者：**Gitalk**
- 面向国外用户：**Disqus**

### 8.2 统计工具选择建议

- 只想知道大概访问量：**不蒜子**
- 国内用户为主：**百度统计**
- 国际用户或需要详细分析：**Google Analytics**
- 可以同时使用多个统计工具，数据对比着看

### 8.3 性能考虑

评论系统和统计代码都会增加页面加载时间，需要权衡：

1. **评论懒加载**：开启评论的懒加载，滚动到评论区才加载
2. **统计代码异步加载**：确保统计脚本是异步加载的，不阻塞页面渲染
3. **不要同时用太多**：同时加载三四个统计工具，会明显拖慢页面
4. **CDN 加速**：评论系统的资源如果能走 CDN 更好

### 8.4 反垃圾评论

评论系统用久了，难免会遇到垃圾评论。几个应对方法：

1. **评论审核**：开启评论审核，评论需要管理员通过后才显示
2. **关键词过滤**：设置敏感关键词过滤
3. **限制频率**：防止恶意刷屏
4. **定期清理**：定期清理垃圾评论

Waline 在这方面做得比较好，有比较完善的反垃圾机制。

## 九、常见问题

### 9.1 评论系统加载不出来

**可能原因：**
- AppID 或 AppKey 填错了
- 安全域名没有配置正确
- LeanCloud 应用被冻结了（长期不用可能被回收）
- 网络问题（LeanCloud 国内版和国际版搞混了）

**解决方法：**
1. 检查配置信息是否正确
2. 打开浏览器控制台，看报错信息
3. 确认 LeanCloud 应用状态正常

### 9.2 评论数显示不对

如果是 Valine/Waline，评论数统计可能有延迟，或者需要手动刷新一下。

### 9.3 统计数据不准

- 不蒜子等简单统计的数据只能作为参考
- 不同统计工具的统计规则不同，数据有差异是正常的
- 浏览器的广告拦截插件可能导致统计代码不加载
- 自己的访问也会被统计进去（有些统计可以排除自己的 IP）

### 9.4 如何防止刷评论

- 开启评论审核
- 限制同一 IP 评论频率
- 使用验证码（Valine/Waline 都有相关插件）
- 定期清理垃圾评论

## 十、总结

接入评论系统和访客统计，是让博客从「单方面输出」变成「互动交流」的重要一步。

回顾一下本文介绍的主要内容：

1. **评论系统**：
   - **Valine**：轻量快速，推荐入门使用
   - **Waline**：功能丰富，有管理后台，推荐进阶使用
   - **Gitalk**：基于 GitHub Issues，适合开发者博客

2. **访客统计**：
   - **不蒜子**：极简，只看数字
   - **百度统计**：国内常用，功能全面
   - **Google Analytics**：功能强大，国际通用

根据自己的需求选择合适的方案，不要贪多。一个好用的评论系统 + 一个靠谱的统计工具，就足够了。

希望本文能帮助你顺利为博客接入评论和统计，让你的博客更加活跃！
