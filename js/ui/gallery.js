/**
 * gallery.js
 *
 * Builds the gallery from data/gallery.json when it loads,
 * and from the same labels already shipped with the page until then.
 */

const galleryFallback = [
  { label: 'STAGE', height: 280, gradient: 'linear-gradient(135deg,#1a0000,#330000,#000)', description: 'Live stage performance' },
  { label: 'STUDIO', height: 200, gradient: 'linear-gradient(135deg,#000,#0d0d0d,#1a1a1a)', description: 'Recording studio session' },
  { label: 'CROWD', height: 340, gradient: 'linear-gradient(135deg,#0d0000,#200000)', description: 'Crowd at live event' },
  { label: 'LIGHTS', height: 220, gradient: 'linear-gradient(135deg,#110000,#1a0000,#0d0d00)', description: 'Stage lighting setup' },
  { label: 'ARTIST', height: 360, gradient: 'linear-gradient(135deg,#000,#0a0a1a,#000)', description: 'Artist portrait' },
  { label: 'BACKSTAGE', height: 200, gradient: 'linear-gradient(135deg,#0a0a0a,#1a0a00)', description: 'Backstage moments' },
  { label: 'FESTIVAL', height: 300, gradient: 'linear-gradient(135deg,#0d0000,#1a0000,#000)', description: 'Festival performance' },
  { label: 'STUDIO', height: 240, gradient: 'linear-gradient(135deg,#000,#111,#0a000a)', description: 'Studio equipment' },
  { label: 'MERCH', height: 260, gradient: 'linear-gradient(135deg,#0d0d0d,#1a0000)', description: 'Merchandise display' }
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
      img.alt = description || label;
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
