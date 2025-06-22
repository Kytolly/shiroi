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

  const images = content.querySelectorAll('img:not(.no-process)');

  images.forEach(img => {
    const parent = img.parentNode;

    // Only apply logic to images that are the sole content of a paragraph,
    // or to images that have an alt tag for a caption.
    if (parent.tagName === 'P' && parent.textContent.trim() === '' || (caption && img.alt)) {
      
      if (caption && img.alt) {
        imageCounter++;
        const figure = document.createElement('figure');
        figure.classList.add('image-figure');
        
        const figcaption = document.createElement('figcaption');
        figcaption.innerText = `图 ${imageCounter}: ${img.alt}`;
        
        // The image is moved into the new figure, not cloned.
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        // Replace the parent <p> tag with the new <figure>
        parent.parentNode.replaceChild(figure, parent);

      } else if (center) {
        // For images in a <p> tag without a caption, center the <p> tag itself
        // or add a class to the image, but replacing the P is cleaner.
        parent.style.textAlign = 'center';
      }
    }
  });
}); 