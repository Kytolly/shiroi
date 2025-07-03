/**
 * code-block-theme-toggle.js
 * 负责为代码块添加昼夜主题切换按钮和切换逻辑。
 */

window.addThemeToggleButton = function(actionsContainer, codeBlock, themeToggleConfig) {
  console.log('themeToggleConfig in addThemeToggleButton:', themeToggleConfig);
  if (!themeToggleConfig || !themeToggleConfig.enable) return;

  const lightButton = document.createElement('button');
  lightButton.className = 'theme-toggle-btn light';
  const lightIcon = document.createElement('img');
  lightIcon.src = '/' + themeToggleConfig.to_light_button;
  lightButton.appendChild(lightIcon);

  const darkButton = document.createElement('button');
  darkButton.className = 'theme-toggle-btn dark';
  const darkIcon = document.createElement('img');
  darkIcon.src = '/' + themeToggleConfig.to_dark_button;
  darkButton.appendChild(darkIcon);

  const prismLightCssId = 'prism-light-theme';
  const prismDarkCssId = 'prism-dark-theme';

  // Function to load a CSS file
  const loadCss = (id, path) => {
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = path;
      document.head.appendChild(link);
    }
  };

  // Function to unload a CSS file
  const unloadCss = (id) => {
    const link = document.getElementById(id);
    if (link) {
      link.remove();
    }
  };

  // Function to set code block theme
  const setCodeBlockTheme = (figure, theme) => {
    figure.classList.remove('theme-light', 'theme-dark');
    if (theme === 'light') {
      figure.classList.add('theme-light');
      loadCss(prismLightCssId, themeToggleConfig.light_theme);
      unloadCss(prismDarkCssId);
      lightButton.style.display = 'none';
      darkButton.style.display = 'inline-block';
    } else if (theme === 'dark') {
      figure.classList.add('theme-dark');
      loadCss(prismDarkCssId, themeToggleConfig.dark_theme);
      unloadCss(prismLightCssId);
      darkButton.style.display = 'none';
      lightButton.style.display = 'inline-block';
    }
    localStorage.setItem('code-block-theme-' + codeBlock.id, theme);
  };

  // Initial state: load saved theme or default to light
  const savedCodeBlockTheme = localStorage.getItem('code-block-theme-' + codeBlock.id);
  if (savedCodeBlockTheme) {
    setCodeBlockTheme(codeBlock, savedCodeBlockTheme);
  } else {
    setCodeBlockTheme(codeBlock, 'light'); // Default to light theme for code blocks
  }

  actionsContainer.appendChild(lightButton);
  actionsContainer.appendChild(darkButton);

  darkButton.addEventListener('click', () => {
    setCodeBlockTheme(codeBlock, 'dark');
  });

  lightButton.addEventListener('click', () => {
    setCodeBlockTheme(codeBlock, 'light');
  });
}; 