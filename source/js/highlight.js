document.addEventListener('DOMContentLoaded', () => {
  // 1. 先等页面加载完，然后执行语法高亮
  hljs.highlightAll();

  // 2. 接着，执行我们自己的逻辑，为已高亮的代码块添加标题栏和按钮
  const codeBlocks = document.querySelectorAll('figure.highlight');
  const codeBlockConfig = window.THEME_CONFIG.code_block || {};
  const copyButtonConfig = codeBlockConfig.copy_button;
  const themeToggleConfig = codeBlockConfig.theme_toggle;

  codeBlocks.forEach(codeBlock => {
    // Prevent duplicate headers
    if (codeBlock.querySelector('.code-block-header')) {
      return;
    }
    
    // Set default theme
    codeBlock.classList.add('theme-light');

    // Add .hljs class to table to prevent three-line-table style
    const table = codeBlock.querySelector('table');
    if (table) {
      table.classList.add('hljs');
    }

    // --- Create Header & Actions ---
    const header = document.createElement('div');
    header.className = 'code-block-header';

    const lang = Array.from(codeBlock.classList).find(cls => cls !== 'highlight') || 'code';
    const langName = document.createElement('span');
    langName.className = 'code-lang-name';
    langName.innerText = lang;
    header.appendChild(langName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'code-block-actions';

    // --- Theme Toggler Logic ---
    if (themeToggleConfig && themeToggleConfig.enable) {
      const { to_light_button, to_dark_button } = themeToggleConfig;
      
      const themeToggleContainer = document.createElement('div');
      themeToggleContainer.className = 'theme-toggle-container';

      const lightButton = document.createElement('button');
      lightButton.className = 'theme-toggle-btn light-btn';
      lightButton.innerHTML = (to_light_button) ? `<img src="/${to_light_button}" alt="Light" class="no-process">` : 'Light';
      lightButton.style.display = 'none';

      const darkButton = document.createElement('button');
      darkButton.className = 'theme-toggle-btn dark-btn';
      darkButton.innerHTML = (to_dark_button) ? `<img src="/${to_dark_button}" alt="Dark" class="no-process">` : 'Dark';

      darkButton.addEventListener('click', () => {
        const figure = darkButton.closest('figure.highlight');
        if (figure) {
          figure.classList.remove('theme-light');
          figure.classList.add('theme-dark');
        }
        darkButton.style.display = 'none';
        lightButton.style.display = 'inline-block';
      });

      lightButton.addEventListener('click', () => {
        const figure = lightButton.closest('figure.highlight');
        if (figure) {
          figure.classList.remove('theme-dark');
          figure.classList.add('theme-light');
        }
        lightButton.style.display = 'none';
        darkButton.style.display = 'inline-block';
      });
      
      themeToggleContainer.appendChild(lightButton);
      themeToggleContainer.appendChild(darkButton);
      actionsContainer.appendChild(themeToggleContainer);
    }

    // --- Copy Button Logic ---
    if (copyButtonConfig) {
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

      container.appendChild(copyButton);
      actionsContainer.appendChild(container);
    }

    header.appendChild(actionsContainer);
    codeBlock.prepend(header);
  });
});
