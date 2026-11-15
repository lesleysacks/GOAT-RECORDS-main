/**
 * gallery.js
 *
 * Builds the gallery from data/gallery.json when it loads,
 * and from the same labels already shipped with the page until then.
 */

const galleryFallback = [
  { label: 'STAGE', height: 280, image: 'images/mockups/gallery-stage.svg', description: 'Preview mockup of a stage. Not a GOAT RECORDS photograph.' },
  { label: 'STUDIO', height: 200, image: 'images/mockups/gallery-studio-session.svg', description: 'Preview mockup of a recording session. Not a GOAT RECORDS photograph.' },
  { label: 'CROWD', height: 340, image: 'images/mockups/gallery-crowd.svg', description: 'Preview mockup of a crowd. The figures are not GOAT RECORDS artists.' },
  { label: 'LIGHTS', height: 220, image: 'images/mockups/gallery-lights.svg', description: 'Preview mockup of stage lights. Not a GOAT RECORDS photograph.' },
  { label: 'ARTIST', height: 360, image: 'images/mockups/gallery-artist-silhouette.svg', description: 'Preview silhouette mockup. This is not a GOAT RECORDS artist.' },
  { label: 'BACKSTAGE', height: 200, image: 'images/mockups/gallery-backstage.svg', description: 'Preview mockup of a backstage corridor. Not a GOAT RECORDS photograph.' },
  { label: 'FESTIVAL', height: 300, image: 'images/mockups/gallery-festival.svg', description: 'Preview mockup of a festival stage. Not a GOAT RECORDS photograph.' },
  { label: 'STUDIO', height: 240, image: 'images/mockups/gallery-studio-gear.svg', description: 'Preview mockup of studio equipment. Not a GOAT RECORDS photograph.' },
  { label: 'MERCH', height: 260, image: 'images/mockups/gallery-merch-display.svg', description: 'Preview mockup of a merch display. Not official GOAT RECORDS products.' }
];

function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !Array.isArray(items) || !items.length) return;

  window.galleryItems = items;
  grid.replaceChildren();

  items.forEach((item, index) => {
    const label = item.label || 'Gallery';
    const description = item.description || '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-label', description ? `${label}. ${description}` : label);

    const inner = document.createElement('div');
    inner.className = 'gallery-item-inner';

    if (item.image) {
      const img = document.createElement('img');
      img.className = 'gallery-item-img';
      img.src = item.image;
      img.alt = description || `Preview mockup: ${label}`;
      img.style.height = `${item.height || item.h || 240}px`;
      img.loading = 'lazy';
      img.decoding = 'async';
      inner.append(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'gallery-placeholder';
      placeholder.style.height = `${item.height || item.h || 240}px`;
      placeholder.style.background = item.gradient || item.bg || '#111';
      placeholder.textContent = label;
      inner.append(placeholder);
    }

    const caption = document.createElement('span');
    caption.className = 'gallery-item-overlay';
    caption.textContent = label;

    button.append(inner, caption);
    button.addEventListener('click', () => {
      if (typeof openLightbox === 'function') openLightbox(window.galleryItems[index], index);
    });
    grid.append(button);
  });
}

renderGallery(galleryFallback);

window.addEventListener('goatDataLoaded', () => {
  const items = window.goatData?.gallery;
  if (Array.isArray(items) && items.length) renderGallery(items);
});

if (window.goatData?.ready && Array.isArray(window.goatData.gallery) && window.goatData.gallery.length) {
  renderGallery(window.goatData.gallery);
}
