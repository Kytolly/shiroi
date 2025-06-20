# shiroi
a Hexo theme(adapted by Typo) tailored for TeX fancier.


## Installation

```bash
cd themes
git clone https://github.com/Kytolly/shiroi.git
```

add an item in `_config.yaml`:

```yaml _config.yaml
theme: shiroi
```

## 🌈 Configuration

### Code Highlighting

Shiroi uses `highlight.js` to highlight code. 
To do this, you need to disable the default highlight configuration beforehand.

```yaml _config.yaml
highlight:
  line_number: false
  auto_detect: false
  tab_replace: ''
  wrap: false
  hljs: false
```

### Traits

Shiroi inherit base configuration and you can get reference in [Typo](https://github.com/rankangkang/hexo-theme-typo).

But the author adjust some styles to fit Typora norm.
* List::before: a dot or a small circle, or numbers, not `None`;
* delete heading::before `#`: it is so strange.

### Mathjax support
Shiroi choose Mathjax to rendering math formular. 
You can turn on or off this option in `_config.typo.yml` 
(or `themes/shiroi/_config.yml`, if you like but not recommend).

```yml
mathjax: true
```

### Heading numbering

Heading numbering is a global attribute in your writing.
You don't need to add index for every heading when you write an essay.
It is also an option in `_config.typo.yml` 
(or `themes/shiroi/_config.yml`, if you like but not recommend).
```yml
heading_numbering: true
```
