/**
 * Gallery from gallery.json. An item can be a real image or a gradient fallback.
 */

import { store } from '../data/store.js';
import { clear, el, emptyState, isSafeGradient, isSafeUrl } from '../dom.js';
import { openLightbox } from '../ui/lightbox.js';

function placeholder(item) {
  const height = Number(item.height);
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 240;
  const block = el('div', {
    className: 'gallery-placeholder',
    text: item.label || 'GOAT'
  });
  block.style.height = `${safeHeight}px`;
  block.style.fontSize = `${Math.min(safeHeight / 3, 80)}px`;
  if (isSafeGradient(item.gradient)) block.style.background = item.gradient.trim();
  return block;
}

function renderItem(item, index, items) {
  const label = item.label || 'Gallery image';
  const description = item.description || label;
  const card = el('div', {
    className: 'gallery-item',
    attrs: {
      role: 'button',
      tabindex: '0',
      'aria-label': `Open ${description}`
    }
  });
  const inner = el('div', { className: 'gallery-item-inner' });

  const showImage = () => {
    if (!isSafeUrl(item.image)) return false;
    const image = el('img', {
      className: 'gallery-item-img',
      attrs: { alt: description, loading: 'lazy', decoding: 'async' }
    });
    image.src = item.image.trim();
    image.addEventListener('error', () => {
      image.remove();
      inner.append(placeholder(item));
    });
    inner.append(image);
    return true;
  };

  if (!showImage()) inner.append(placeholder(item));

  const open = () => openLightbox(item, index, items);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    open();
  });

  card.append(inner, el('div', { className: 'gallery-item-overlay', text: '⊕', attrs: { 'aria-hidden': 'true' } }));
  return card;
}

export function renderGallery() {
  const root = document.querySelector('[data-render="gallery"]');
  if (!root) return;
  clear(root);

  const failed = store.state.errors.some((error) => error.key === 'gallery');
  const items = (Array.isArray(store.state.gallery) ? store.state.gallery : []).filter((item) => item && typeof item === 'object');
  if (!items.length) {
    root.append(emptyState(failed ? 'Gallery could not be loaded.' : 'No gallery images yet.'));
    return;
  }

  items.forEach((item, index) => {
    try {
      root.append(renderItem(item, index, items));
    } catch (error) {
      console.warn('[GOAT] Skipped a gallery item', error);
    }
  });
}
