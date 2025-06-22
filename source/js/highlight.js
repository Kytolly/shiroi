hljs.highlightAll()

document.addEventListener('DOMContentLoaded', () => {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('figure.highlight');
  const copyButtonConfig = window.THEME_CONFIG.code_block && window.THEME_CONFIG.code_block.copy_button;

  codeBlocks.forEach(codeBlock => {
    // If a header already exists, don't add another one.
    if (codeBlock.querySelector('.code-block-header')) {
      return;
    }

    // Add .hljs class to table to prevent three-line-table style
    const table = codeBlock.querySelector('table');
    if (table) {
      table.classList.add('hljs');
    }

    // Create the header container
    const header = document.createElement('div');
    header.className = 'code-block-header';

    // Extract language name and create the element
    const lang = Array.from(codeBlock.classList).find(cls => cls !== 'highlight') || 'code';
    const langName = document.createElement('span');
    langName.className = 'code-lang-name';
    langName.innerText = lang;
    header.appendChild(langName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'code-block-actions';

    // Copy Button Logic
    if (copyButtonConfig) {
      const container = document.createElement('div');
      container.className = 'copy-btn-container';
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      let originalContent;

      if (copyButtonConfig !== 'undefined') {
        const icon = document.createElement('img');
        icon.src = '/' + copyButtonConfig;
        icon.alt = 'Copy';
        icon.classList.add('no-process');
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
        }).catch(err => console.error('Failed to copy text: ', err));
      });
    }
    
    header.appendChild(actionsContainer);
    codeBlock.prepend(header);
  });
});
