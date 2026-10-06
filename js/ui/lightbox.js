/**
 * Gallery lightbox. Opens from a gallery item, which may be a photo or a fallback.
 */

import { el, isSafeGradient, isSafeUrl } from '../dom.js';

let lastFocus = null;

function lightboxRoot() {
  return document.getElementById('lightbox');
}

export function closeLightbox() {
  const lightbox = lightboxRoot();
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  lastFocus = null;
}

function placeholder(item, index, total) {
  const block = el('div', { className: 'lb-placeholder' });
  if (isSafeGradient(item.gradient)) block.style.background = item.gradient.trim();
  block.append(
    el('div', { className: 'lb-placeholder-title', text: item.label || 'GOAT' }),
    el('div', { className: 'lb-placeholder-sub', text: `GOAT RECORDS — ${index + 1} / ${total}` })
  );
  return block;
}

export function openLightbox(item, index, items) {
  const lightbox = lightboxRoot();
  const content = document.getElementById('lb-content');
  if (!lightbox || !content || !item) return;

  const list = Array.isArray(items) ? items : [];
  const total = list.length || 1;
  content.replaceChildren();

  const description = item.description || item.label || 'Gallery image';
  const showPhoto = isSafeUrl(item.image) && !String(item.image).startsWith('data:');

  if (showPhoto) {
    const image = el('img', {
      className: 'lightbox-img-display',
      attrs: { alt: description }
    });
    image.src = item.image.trim();
    image.addEventListener('error', () => {
      image.remove();
      content.append(placeholder({ ...item, image: '' }, index, total));
    });
    content.append(image);
    const caption = el('p', { className: 'lb-placeholder-sub', text: `${description} — ${index + 1} / ${total}` });
    content.append(caption);
  } else {
    content.append(placeholder(item, index, total));
  }

  lastFocus = document.activeElement;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const close = document.getElementById('lb-close');
  if (close) close.focus();
}

export function initLightbox() {
  const lightbox = lightboxRoot();
  const close = document.getElementById('lb-close');
  if (!lightbox) return;

  if (close) close.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}
