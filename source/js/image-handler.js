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
      figure.classList.add('image-figure');
      const figcaption = document.createElement('figcaption');
      
      figcaption.innerText = `图 ${imageCounter}: ${img.alt}`;
      
      const imgClone = img.cloneNode(true);
      figure.appendChild(imgClone);
      figure.appendChild(figcaption);
      
      // If image is inside a p tag, replace the p tag with figure.
      // Otherwise, replace the image itself.
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