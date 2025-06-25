## Typo 魔改日志

本主题按照本人使用的 Typora 编辑器风格定制，旨在打造一款轻量级的`TeX`笔记样式。
本主题改编自 [Typo](https://github.com/rankangkang/hexo-theme-typo)。


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
在配置文件（如 `_config.typo.yml` 或 `themes/shiroi/_config.yml`）中添加开关
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

在配置文件（如 `_config.typo.yml` 或 `themes/shiroi/_config.yml`）中添加开关
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

### 左侧目录

### AI摘要

### AI搜索

### 背景

### Tags归档

### About

### 右侧profile