## Typo 魔改日志
### 数学公式支持
此时markdown渲染器为`hexo-renderer-syzoj-renderer`;
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
添加样式文件`source/css/mathjax.css`使得渲染器渲染出字体为`Times New Roman`。

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


### 图片样式

此功能用于自动居中图片，并将其 `alt` 文本作为带编号的图注（例如"图1：xxx"）显示。所有功能都由主题配置文件中的开关控制。

首先，在主题配置文件 `_config.yaml` 中添加以下开关：
```yaml
# Image settings
image:
  enable: true  # 总开关
  center: true  # 居中图片
  caption: true # 将 alt 文本作为带编号的图注显示
```

然后，在 `source/css/` 目录下新建 `image-handler.css` 文件。为了避免居中样式影响到代码块等也使用 `<figure>` 标签的元素，我们为图片的 `<figure>` 指定了一个特定的类 `image-figure`：
```css
.post-content .image-figure,
.post-content img.centered {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.post-content figcaption {
  margin-top: 0.8em;
  font-size: 0.9em;
  color: #888;
}
```

接着，在 `source/js/` 目录下新建 `image-handler.js` 文件。此脚本会查找文章中的所有图片，并根据配置应用样式和添加图注：
```js
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THEME_CONFIG === 'undefined' || !THEME_CONFIG.image) {
    return;
  }

  const { center, caption } = THEME_CONFIG.image;
  if (!center && !caption) {
    return;
  }

  let imageCounter = 0;
  const content = document.querySelector('.post-content');

  if (!content) return;

  const images = content.querySelectorAll('img');

  images.forEach(img => {
    if (caption && img.alt) {
      imageCounter++;
      const figure = document.createElement('figure');
      figure.classList.add('image-figure'); // 添加特定类以供 CSS 选择
      const figcaption = document.createElement('figcaption');
      
      figcaption.innerText = `图 ${imageCounter}: ${img.alt}`;
      
      const imgClone = img.cloneNode(true);
      figure.appendChild(imgClone);
      figure.appendChild(figcaption);
      
      const parent = img.parentNode;
      if (parent.tagName === 'P') {
        parent.parentNode.replaceChild(figure, parent);
      } else {
        parent.replaceChild(figure, img);
      }

    } else if (center) {
      img.classList.add('centered');
    }
  });
});
```

最后，修改布局文件来引入这些资源。

在 `layout/_partial/head.ejs` 中添加 CSS 文件的链接：
```ejs
  <!-- 图片样式 -->
  <% if (theme.image && theme.image.enable) { %>
  <%- css('css/image-handler.css') %>
  <% } %>
```

在 `layout/layout.ejs` 的 `</body>` 标签前添加 JavaScript 脚本和配置注入：
```ejs
  <!-- 图片样式 -->
  <% if (theme.image && theme.image.enable) { %>
    <script>
      const THEME_CONFIG = {
        image: {
          center: <%- theme.image.center || false %>,
          caption: <%- theme.image.caption || false %>
        }
      };
    </script>
    <%- js('js/image-handler.js') %>
  <% } %>
```

