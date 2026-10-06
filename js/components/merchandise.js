/**
 * Merch grid from merchandise.json. Prices are display-only — there is no checkout.
 */

import { store } from '../data/store.js';
import { clear, el, emptyState, formatPrice, isSafeGradient, isSafeUrl } from '../dom.js';

function symbolNode(item) {
  const symbol = item.symbol || 'G';
  const compact = String(symbol).length > 3;
  return el('div', {
    className: compact ? 'merch-symbol merch-symbol--compact' : 'merch-symbol',
    text: symbol
  });
}

function renderItem(item) {
  const card = el('article', { className: 'merch-card fade-in' });
  if (item.new) card.append(el('div', { className: 'merch-new', text: 'New' }));

  const frame = el('div', { className: 'merch-img' });
  const inner = el('div', { className: 'merch-img-inner merch-img-inner--mark' });
  if (isSafeGradient(item.gradient)) inner.style.background = item.gradient.trim();

  const photo = item.image && isSafeUrl(item.image) && !String(item.image).startsWith('data:');
  if (photo) {
    const image = el('img', {
      className: 'merch-photo',
      attrs: { alt: item.name || 'Merchandise', loading: 'lazy', decoding: 'async' }
    });
    image.src = item.image.trim();
    image.addEventListener('error', () => {
      image.remove();
      inner.append(symbolNode(item), el('div', { className: 'merch-type', text: item.type || '' }));
    });
    inner.append(image);
  } else {
    inner.append(symbolNode(item));
    if (item.type) inner.append(el('div', { className: 'merch-type', text: item.type }));
  }
  frame.append(inner);

  const body = el('div', { className: 'merch-body' });
  body.append(el('div', { className: 'merch-name', text: item.name || 'Product' }));
  if (item.description) body.append(el('div', { className: 'merch-desc', text: item.description }));

  const footer = el('div', { className: 'merch-footer' });
  const price = el('div', { className: 'merch-price', text: `R${formatPrice(item.price)}` });
  price.append(el('span', { text: ` ${item.currency || 'ZAR'}` }));
  const buy = el('button', {
    className: 'merch-buy',
    text: 'Buy Now',
    attrs: { type: 'button' }
  });
  footer.append(price, buy);
  body.append(footer);
  card.append(frame, body);
  return card;
}

export function renderMerchandise() {
  const root = document.querySelector('[data-render="merchandise"]');
  if (!root) return;
  clear(root);

  const failed = store.state.errors.some((error) => error.key === 'merchandise');
  const items = Array.isArray(store.state.merchandise) ? store.state.merchandise : [];
  if (!items.length) {
    root.append(emptyState(failed ? 'Merchandise could not be loaded.' : 'No products in the drop yet.'));
    return;
  }

  items.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    try {
      root.append(renderItem(item));
    } catch (error) {
      console.warn('[GOAT] Skipped a product', error);
    }
  });
}
