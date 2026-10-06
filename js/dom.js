/**
 * Small DOM helpers. Dynamic text goes through textContent.
 * String templates are avoided for data that comes from JSON.
 */

const SAFE_GRADIENT = /^linear-gradient\([^;{}<>]+\)$/i;

export function isSafeUrl(value) {
  if (typeof value !== 'string') return false;
  const url = value.trim();
  if (!url || /[\u0000-\u001F]/.test(url)) return false;
  if (/^\s*javascript:/i.test(url) || /^\s*data:(?!image\/)/i.test(url)) return false;
  if (url.startsWith('//')) return false;
  if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;
  if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url)) return true;
  if (/^data:image\/(?:png|jpe?g|gif|webp|svg\+xml)/i.test(url)) return true;
  return /^[a-z0-9_./% -]+$/i.test(url) && !url.includes('..');
}

export function isSafeGradient(value) {
  return typeof value === 'string' && SAFE_GRADIENT.test(value.trim()) && !/url\(|expression|javascript/i.test(value);
}

export function el(tag, options = {}) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text != null) node.textContent = String(options.text);
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value != null && value !== false) node.setAttribute(key, String(value));
    });
  }
  (options.children || []).forEach((child) => {
    if (child) node.append(child);
  });
  return node;
}

export function clear(node) {
  if (!node) return;
  node.replaceChildren();
}

export function appendLink(parent, href, className, text, label) {
  const anchor = el('a', { className, text });
  if (label) anchor.setAttribute('aria-label', label);
  if (isSafeUrl(href)) {
    anchor.href = href.trim();
    if (/^https?:\/\//i.test(href.trim())) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
  } else {
    anchor.href = '#';
  }
  parent.append(anchor);
  return anchor;
}

export function emptyState(message) {
  return el('p', { className: 'empty-state', text: message });
}

export function getPath(root, path) {
  if (!root || !path) return undefined;
  return String(path).split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), root);
}

export function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return number.toLocaleString('en-US');
}

export function telHref(phone) {
  const compact = String(phone || '').replace(/[^\d+]/g, '');
  return compact ? `tel:${compact}` : '';
}
