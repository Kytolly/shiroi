// themes/shiroi/source/js/codeblock-theme-toggle.js

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleConfig = window.THEME_CONFIG.code_block && window.THEME_CONFIG.code_block.theme_toggle;

  if (!themeToggleConfig || !themeToggleConfig.enable) {
    return;
  }

  const { to_light_button, to_dark_button, light_theme, dark_theme } = themeToggleConfig;
  const highlightThemeLink = document.getElementById('highlight-theme');

  if (!highlightThemeLink) {
    console.warn('highlight.js theme stylesheet with id "highlight-theme" not found.');
    return;
  }

  // Find all action containers that were created by highlight.js
  const actionContainers = document.querySelectorAll('.code-block-actions');
  if (actionContainers.length === 0) {
    return;
  }

  actionContainers.forEach(container => {
    // Create the theme toggle buttons
    const themeToggleContainer = document.createElement('div');
    themeToggleContainer.className = 'theme-toggle-container';

    const lightButton = document.createElement('button');
    lightButton.className = 'theme-toggle-btn light-btn';
    lightButton.innerHTML = (to_light_button && to_light_button !== 'undefined') ? `<img src="/${to_light_button}" alt="Light" class="no-process">` : 'Light';
    lightButton.style.display = 'none';

    const darkButton = document.createElement('button');
    darkButton.className = 'theme-toggle-btn dark-btn';
    darkButton.innerHTML = (to_dark_button && to_dark_button !== 'undefined') ? `<img src="/${to_dark_button}" alt="Dark" class="no-process">` : 'Dark';

    themeToggleContainer.appendChild(lightButton);
    themeToggleContainer.appendChild(darkButton);

    // Add event listeners
    darkButton.addEventListener('click', () => {
      highlightThemeLink.href = `/css/${dark_theme}.css`;
      darkButton.style.display = 'none';
      lightButton.style.display = 'inline-block';
    });
    lightButton.addEventListener('click', () => {
      highlightThemeLink.href = `/css/${light_theme}.css`;
      lightButton.style.display = 'none';
      darkButton.style.display = 'inline-block';
    });

    // Prepend the theme toggler to the actions container, before the copy button
    container.prepend(themeToggleContainer);
  });
}); 