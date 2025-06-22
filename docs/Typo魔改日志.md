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

### 三线表样式

此功能用于将标准的 Markdown 表格渲染为学术论文中常见的三线表样式，以增强可读性和专业性。该功能可通过主题配置文件中的开关进行控制。

首先，在主题配置文件 `_config.shiroi.yml` 中添加以下开关：
```yaml
# Table style
three_line_table: true
```

然后，在 `source/css/` 目录下新建一个 `three-line-table.css` 文件，内容如下。为了避免样式污染用于代码块的表格（它们在渲染后也是 `<table>` 结构），所有规则都使用了 `:not(.hljs)` 选择器进行限定。
```css
/* Three-line table style, excluding tables used for code blocks */
.post-content table:not(.hljs) {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid var(--color-post-content, #333);
  border-bottom: 2px solid var(--color-post-content, #333);
  margin: 1.5em 0;
  font-size: 0.95em;
}

.post-content table:not(.hljs) th,
.post-content table:not(.hljs) td {
  border: none;
  padding: 0.75em 1em;
  text-align: left;
}

.post-content table:not(.hljs) thead th {
  border-bottom: 1px solid var(--color-post-content, #333);
  text-align: center;
  font-weight: 600;
}

.post-content table:not(.hljs) tbody tr:nth-child(even) {
  background-color: var(--color-table-row, #f9f9f9);
}

.post-content table:not(.hljs) caption {
  caption-side: bottom;
  text-align: center;
  font-size: 0.9em;
  color: #888;
  margin-top: 0.5em;
}
```

最后，在 `themes/shiroi/layout/_partial/head.ejs` 中添加以下代码，以根据配置开关加载样式文件：
```ejs
  <!-- 三线表样式 -->
  <% if (theme.three_line_table) { %>
    <%- css('css/three-line-table.css') %>
  <% } %>
```

### 图片样式

此功能用于自动居中图片，并将其 `alt` 文本作为带编号的图注（例如"图1：xxx"）显示。此方案经过调试，能够正确处理将图片渲染为 `<p><img></p>` 的渲染器。所有功能都由主题配置文件中的开关控制。

首先，在主题配置文件 `_config.yaml` 中添加以下开关：
```yaml
# Image settings
image:
  enable: true  # 总开关
  center: true  # 居中图片
  caption: true # 将 alt 文本作为带编号的图注显示
```

然后，在 `source/css/` 目录下新建 `image-handler.css` 文件。我们使用 `display: table;` 技巧让 `<figure>` 元素的宽度自适应其内容，从而使 `margin: auto;` 能够生效，实现真正的居中。
```css
.post-content .image-figure {
  /* This makes the figure shrink-wrap its content, allowing margin:auto to work */
  display: table;
  margin-left: auto;
  margin-right: auto;
}

.post-content .image-figure figcaption {
  margin-top: 0.8em;
  font-size: 0.9em;
  color: #888;
  text-align: center; /* Explicitly center the caption text */
}
```

接着，在 `source/js/` 目录下新建 `image-handler.js` 文件。此脚本会查找文章中被单独包裹在 `<p>` 标签里的图片，然后用一个带有 `.image-figure` 类的 `<figure>` 元素替换掉原来的 `<p>` 标签，并根据配置添加图注。
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
    const parent = img.parentNode;

    // Only apply to images that are the sole child of a paragraph.
    if (parent.tagName === 'P' && parent.children.length === 1) {
      if (caption && img.alt) {
        imageCounter++;
        const figure = document.createElement('figure');
        figure.classList.add('image-figure');
        
        const figcaption = document.createElement('figcaption');
        figcaption.innerText = `图 ${imageCounter}: ${img.alt}`;
        
        // Move the image into the new figure.
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        // Replace the parent <p> tag with the new <figure>.
        parent.parentNode.replaceChild(figure, parent);

      } else if (center) {
        // For images in a <p> tag without a caption, center the <p> tag itself.
        parent.style.textAlign = 'center';
      }
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

### 代码块样式升级

在`source/css/post.css`中，注释掉如下代码。
```css
.post-content table td,
.post-content table th {
  border: 1px solid #6b6b6b;
  padding: 6px 13px;
}

.post-content table tr {
  border-top: 1px solid #c6cbd1;
}
```

### 代码块样式升级

此功能旨在将默认的代码块替换为一个功能更丰富、样式更现代的组件。它包含一个标题栏，用于显示代码语言和提供一键复制功能，并采用了仅保留关键分割线的极简设计。

#### 1. 功能开关与配置

在主题配置文件 `_config.shiroi.yml` 中添加以下配置，用于控制复制按钮的显示内容。

```yaml
# Code block settings
code_block:
  # When copy_button is empty, the button displays the word "copy".
  # If a path to an SVG is provided, the SVG will be displayed as a clickable button.
  copy_button: icon/copy.svg
```

#### 2. JavaScript 逻辑

此项目依赖 `highlight.js` 库，请确保它已被引入。我们在 `themes/shiroi/source/js/highlight.js` 文件中添加了用于动态创建标题栏、语言名称和复制按钮的逻辑。

```js
// themes/shiroi/source/js/highlight.js

hljs.highlightAll()

document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('figure.highlight');
  const copyButtonConfig = SHIROI_CONFIG.copy_button;

  codeBlocks.forEach(codeBlock => {
    // Add .hljs class to table to prevent three-line-table style
    const table = codeBlock.querySelector('table');
    if (table) {
      table.classList.add('hljs');
    }

    // Create a header for language name and copy button
    const header = document.createElement('div');
    header.className = 'code-block-header';

    // Display language name
    const lang = Array.from(codeBlock.classList).find(cls => cls !== 'highlight') || 'code';
    const langName = document.createElement('span');
    langName.className = 'code-lang-name';
    langName.innerText = lang;
    header.appendChild(langName);

    // Create and append copy button
    const container = document.createElement('div');
    container.className = 'copy-btn-container';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';

    let originalContent;

    if (copyButtonConfig && copyButtonConfig !== 'undefined') {
      const icon = document.createElement('img');
      icon.src = '/' + copyButtonConfig;
      copyButton.appendChild(icon);
      originalContent = icon.outerHTML;
    } else {
      copyButton.innerText = 'copy';
      originalContent = 'copy';
    }

    container.appendChild(copyButton);
    header.appendChild(container); // Append button to header

    // Add the full header to the top of the code block
    codeBlock.prepend(header);

    copyButton.addEventListener('click', () => {
      const codeToCopy = codeBlock.querySelector('.code').innerText;
      navigator.clipboard.writeText(codeToCopy).then(() => {
        copyButton.innerText = 'copied!';
        setTimeout(() => {
          copyButton.innerHTML = originalContent;
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
});
```

#### 3. CSS 样式

所有样式都集中在 `themes/shiroi/source/css/code-block-base.css` 文件中。这份样式表经过了多次迭代，拥有极高的优先级，能够覆盖主题中其他冲突的全局样式，确保最终效果的稳定。

```css
/* themes/shiroi/source/css/code-block-base.css */

/*
  Shiroi Code Block Styling - FINAL
  - A clean, headered code block
  - Language display and copy button
  - Only two separator lines: one under the header, one between line numbers and code.
  - Fix for rounded corners and persistent borders.
*/

/* Main container: no border/shadow, just a rounded shape with a background */
figure.highlight {
  border-radius: 8px;
  margin: 1.5em 0;
  overflow: hidden;
  background-color: #f7f7f7; /* Provides a base for the rounded shape */
}

/* Header for language name and copy button */
.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1em;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eee; /* Horizontal separator */
}

.code-lang-name {
  font-size: 0.9em;
  color: #555;
  text-transform: capitalize;
  font-family: 'JetBrains Mono', monospace;
}

/* Copy button styling */
.copy-btn-container .copy-btn {
  border: none;
  cursor: pointer;
  background-color: transparent;
  opacity: 0.6;
}

.copy-btn-container .copy-btn:hover {
  opacity: 1;
}

.copy-btn-container .copy-btn img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

/* --- OVERRIDES FOR CONFLICTING GLOBAL STYLES --- */

/* This is the container for the code proper */
figure.highlight table.hljs {
  background-color: white;
  width: 100%;
  margin: 0;
  border-spacing: 0;
  /* Apply border-radius to the table itself to fix corner clipping */
  border-radius: 0 0 8px 8px;
}

/* Nuke all borders on table cells from other stylesheets with high specificity */
.post-content figure.highlight table.hljs td {
  border: none !important;
  padding: 0 !important; /* Reset padding before applying it below */
}

/* Apply padding and the vertical separator ONLY where intended */
.post-content figure.highlight table.hljs .gutter {
  padding: 1em !important;
  border-right: 1px solid #eee !important; /* The one true vertical line */
}

.post-content figure.highlight table.hljs .code {
  padding: 1em !important;
}
```

#### 4. 模板注入

为了让上述功能生效，需要在模板文件中引入对应的CSS、JS和配置。

在 `themes/shiroi/layout/_partial/head.ejs` 中添加：
```ejs
  <!-- 代码块基础样式 -->
  <%- css('css/code-block-base.css') %>

  <!-- 将配置传给前端JS -->
  <script>
    const SHIROI_CONFIG = {
      copy_button: "<%- theme.code_block.copy_button %>"
    }
  </script>
```

在 `themes/shiroi/layout/post.ejs` 的末尾（或合适的位置）引入主逻辑脚本：
```ejs
<%- js('js/highlight.js') %>
```

#### 5. 解决样式冲突（重要）

在调试过程中，我们发现主题（或插件）的全局样式对代码块造成了严重干扰，例如：
- `post.css` 中可能存在针对 `table tr` 或 `table td` 的全局边框样式。
- `highlight.js` 默认样式或主题的其他部分可能也包含冲突的 `td` 边框。

我们最终的解决方案**不是**去修改这些原始文件（如 `post.css`），因为这会破坏模块性且难以维护。取而代之的是，在 `code-block-base.css` 中，我们使用了**高优先级、高特异性**的CSS选择器来**覆盖**这些冲突样式，确保我们的代码块样式能够稳定生效。

例如，以下在 `code-block-base.css` 中的规则就是专门用来对抗这些全局样式的：
```css
/* Nuke all borders on table cells from other stylesheets with high specificity */
.post-content figure.highlight table.hljs td {
  border: none !important;
  padding: 0 !important; /* Reset padding before applying it below */
}

/* Apply padding and the vertical separator ONLY where intended */
.post-content figure.highlight table.hljs .gutter {
  padding: 1em !important;
  border-right: 1px solid #eee !important; /* The one true vertical line */
}
```
这种方法保证了功能的独立性和可维护性。

至此，代码块升级工作全部完成。

### 代码块深浅主题样式
