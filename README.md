<h1 align="center">typo</h1>

<p align="center">一个简单的 hexo 主题</p>

<p align='center'>
简体中文 ｜ <a href="https://github.com/rankangkang/hexo-theme-typo/blob/main/README.en.md">English</a>
</p>

## ✨ 特性

- 黑夜模式
- 代码高亮
  - light mode: atom-one-light
  - dark mode: atom-one-dark
- 多样字体
  - 文章使用 Montserrat 字体
  - 代码使用 JetBrains Mono 字体

## 📦 安装

```bash
git clone --depth=1 https://github.com/rankangkang/hexo-theme-typo.git themes/typo
```

并在 `_config.yaml` 中进行如下配置：

```yaml _config.yaml
theme: typo
```

## 🌈 配置

### 代码高亮

主题使用 highlight.js 高亮代码，为此，您需要事先禁用默认的 highlight 配置。

```yaml _config.yaml
highlight:
  line_number: false
  auto_detect: false
  tab_replace: ''
  wrap: false
  hljs: false
```

### 黑夜模式

typo 使用媒体查询的 `prefer-color-scheme` 配置实现黑夜模式，当您的设备切换主题时，typo 的主题也会自动切换。

当然，您也可以使用 Chrome DevTools 来模拟切换动作，有以下两种方式：

- 打开 Chrome DevTools 的“绘制”tab，切换 “Emulate CSS media feature prefers-color-scheme”配置即可

- 打开 Chrome DevTools，键入 <kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>p</kbd>，并输入 `prefer-color-scheme`，选择对应模式切换即可

### theme 配置项

typo 对外提供了一些自定义配置，在 `typo/_config.yaml` 下配置即可。

- `title`：网站标题
- `favicon`: favicon（指向的文件需放置在 source 目录下）
- `icon`: 网站图标（指向的文件需放置在 source 目录下）
- `menu`: 菜单导航
- `copyright`: 底栏 copyright 展示内容

默认配置如下：

```yaml typo/_config.yaml
title: typo
favicon: /icon.svg
icon: /icon.svg

menu:
  archives: /archives
  about: /about

copyright: 2024 typo
```

## 🔗 想要开发一个自己的主题？

👉🏻 来 [这里](https://github.com/rankangkang/hexo-themes) 快速开始，这可能会很有帮助 ~

😁 Happy coding ~

### 数学公式支持
此时数学公式的渲染器为`hexo-renderer-marked`;
在`layout/head.ejs`添加如下代码，以使得渲染器支持数学公式
```ejs
  <!-- 数学公式 -->
  <% if (theme.mathjax || config.mathjax) { %>
    <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
      }
    };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <% } %>
```
在配置文件（如 `_config.typo.yml` 或 `themes/typo/_config.yml`）中添加开关
```yml
mathjax: true
```

### 标题自动编号

在 `source/js/` 目录下新建一个文件 `heading-numbering.js`，内容如下：

```js

document.addEventListener('DOMContentLoaded', function () {
  // 只在文章页生效
  if (!document.querySelector('.post')) return;

  // 只处理 h2-h6
  const headings = document.querySelectorAll('.post h2, .post h3, .post h4, .post h5, .post h6');
  const nums = [0, 0, 0, 0, 0]; // 对应 h2-h6

  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]) - 2; // h2->0, h3->1, ...
    if (level < 0) return; // 跳过 h1

    // 当前级别+1，低级别归零
    nums[level]++;
    for (let i = level + 1; i < nums.length; i++) nums[i] = 0;

    // 生成编号字符串
    const numbering = nums.slice(0, level + 1).join('.');

    // 插入编号
    heading.innerHTML = `<span class="heading-number">${numbering} </span>` + heading.innerHTML;
  });
});
```

在 `source/css/` 目录下新建一个文件 `heading-numbering.css`，内容如下：
```css
.heading-number {
  color: #888;
  font-weight: normal;
  margin-right: 0.5em;
  font-size: 0.95em;
}
```

在 `themes/typo/layout/_partial/head.ejs` 的 `</head>` 前注入两个文件。
```ejs
...
  <%- css('css/root.css') %>
  <%- css('css/style.css') %>
  <%- css('css/post.css') %>
  <%- js('js/heading-numbering.js') %>
</head>
```

在配置文件（如 `_config.typo.yml` 或 `themes/typo/_config.yml`）中添加开关
```yml
heading_numbering: true
```

### 去掉标题前符号
注释掉上面`source/css/post.css`中的以下代码：
```css
.post-content h1::before,
.post-content h2::before,
.post-content h3::before,
.post-content h4::before,
.post-content h5::before,
.post-content h6::before {
  content: "⌗";
  padding-right: 10px;
  color: var(--color-hashtag);
  font-weight: 600;
}
```

### 在无序列表前面加点
修改`source/css/root.css`中的全局样式，原来的样式为
```css
ul,
ol {
  list-style: none;
}
```
注释掉它，替换成如下样式
```css
/* ul,
ol {
  list-style: none;
} */
.post-content ul {
  list-style: disc;
  padding-left: 2em; /* 保证缩进美观 */
}
.post-content ul ul {
  list-style: circle;
}
```