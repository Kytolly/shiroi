/**
 * code-block.js
 * 代码块增强功能的主入口和协调器。
 * 负责初始化 highlight.js，并集成头部、复制和主题切换功能。
 */

// 确保 highlight.js 库已初始化
// 如果 highlight.js 是通过 CDN 或其他方式全局加载的，这一行通常在DOMContentLoaded之前执行。
// 但为了确保，这里保留一下。
if (typeof hljs !== 'undefined') {
  hljs.highlightAll();
}

document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('figure.highlight');

  // 从 window.THEME_CONFIG 中获取配置
  const copyButtonConfig = window.THEME_CONFIG.code_block.copy_button;
  const themeToggleEnable = window.THEME_CONFIG.code_block.theme_toggle.enable === 'true';
  const macEnhancerEnable = window.THEME_CONFIG.code_block.mac_enhancer.enable === 'true';
  const initFoldedStatus = window.THEME_CONFIG.code_block.mac_enhancer.init_folded_status === 'true'; // 新增：初始折叠状态开关
  
  const themeToggleConfig = {
    enable: themeToggleEnable,
    to_light_button: window.THEME_CONFIG.code_block.theme_toggle.to_light_button,
    to_dark_button: window.THEME_CONFIG.code_block.theme_toggle.to_dark_button,
    light_theme: window.THEME_CONFIG.code_block.theme_toggle.light_theme,
    dark_theme: window.THEME_CONFIG.code_block.theme_toggle.dark_theme,
  };

  // *** 函数定义：创建代码块头部 ***
  function createCodeBlockHeader(langName) {
    const header = document.createElement('div');
    header.className = 'code-block-header';

    const langSpan = document.createElement('span');
    langSpan.className = 'code-lang-name';
    langSpan.innerText = langName;
    header.appendChild(langSpan);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'code-block-actions';
    header.appendChild(actionsContainer);

    return { header, actionsContainer };
  }

  // *** 函数定义：添加复制按钮 ***
  function addCopyButton(actionsContainer, codeBlock, copyButtonPath) {
    const container = document.createElement('div');
    container.className = 'copy-btn-container';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';

    let originalContent;

    if (copyButtonPath) {
      const icon = document.createElement('img');
      icon.src = '/' + copyButtonPath;
      copyButton.appendChild(icon);
      originalContent = icon.outerHTML;
    } else {
      copyButton.innerText = 'copy';
      originalContent = 'copy';
    }

    container.appendChild(copyButton);
    actionsContainer.appendChild(container);

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
  }

  // *** 函数定义：添加Mac风格交通灯 ***
  function addMacTrafficLights(header, codeBlock) {
    header.classList.add('mac-style');

    const trafficLightsContainer = document.createElement('div');
    trafficLightsContainer.className = 'mac-traffic-lights';

    const redDot = document.createElement('span');
    redDot.className = 'dot red';
    trafficLightsContainer.appendChild(redDot);

    const yellowDot = document.createElement('span');
    yellowDot.className = 'dot yellow';
    trafficLightsContainer.appendChild(yellowDot);

    const greenDot = document.createElement('span');
    greenDot.className = 'dot green';
    trafficLightsContainer.appendChild(greenDot);

    header.prepend(trafficLightsContainer);

    // Add click event to toggle collapse
    trafficLightsContainer.addEventListener('click', () => {
      codeBlock.classList.toggle('is-collapsed');
    });
  }

  codeBlocks.forEach(codeBlock => {
    // 防止重复创建头部
    if (codeBlock.querySelector('.code-block-header')) return;

    // 添加 .hljs 类以防止三线表样式冲突
    const table = codeBlock.querySelector('table');
    if (table) {
      table.classList.add('hljs');
    }

    // 获取语言名称
    const lang = Array.from(codeBlock.classList).find(cls => cls !== 'highlight') || 'code';

    // 创建代码块头部
    const { header, actionsContainer } = createCodeBlockHeader(lang);
    codeBlock.prepend(header);

    // 添加复制按钮
    if (copyButtonConfig) {
      addCopyButton(actionsContainer, codeBlock, copyButtonConfig);
    }

    // 添加主题切换按钮
    if (themeToggleConfig.enable) {
      window.addThemeToggleButton(actionsContainer, codeBlock, themeToggleConfig);
      // 默认设置为浅色主题，与CSS变量的默认值保持一致
      codeBlock.classList.add('theme-light');
    }

    // 添加Mac风格增强
    if (macEnhancerEnable) {
      addMacTrafficLights(header, codeBlock);
      // 如果init_folded_status为true，则初始自动折叠代码块
      if (initFoldedStatus) {
        codeBlock.classList.add('is-collapsed');
      }
    }
  });
}); 