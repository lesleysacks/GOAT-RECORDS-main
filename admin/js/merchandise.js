import { store } from '../../js/data/store.js';
import { el, formatPrice } from '../../js/dom.js';
import { editor, notifyChanged } from './state.js';
import { closeModal, openModal, showMessage } from './ui.js';

function field(id) {
  return document.getElementById(id);
}

export function renderMerch() {
  const list = document.getElementById('merchList');
  if (!list) return;
  const items = Array.isArray(store.state.merchandise) ? store.state.merchandise : [];
  list.replaceChildren();
  if (!items.length) {
    list.append(el('p', { className: 'empty-note', text: 'No products yet.' }));
    return;
  }

  items.forEach((item, index) => {
    const card = el('article', { className: 'item-card' });
    const info = el('div', { className: 'item-info' });
    info.append(el('h3', { text: item.name || 'Untitled product' }));
    info.append(el('p', { text: item.description || '' }));
    info.append(el('p', { className: 'item-price', text: `R${formatPrice(item.price)} ${item.currency || 'ZAR'}` }));
    const actions = el('div', { className: 'item-actions' });
    actions.append(
      el('button', { className: 'btn-small', text: 'Edit', attrs: { type: 'button', 'data-action': 'merch-edit', 'data-index': index } }),
      el('button', { className: 'btn-small secondary', text: 'Delete', attrs: { type: 'button', 'data-action': 'merch-delete', 'data-index': index } })
    );
    card.append(info, actions);
    list.append(card);
  });
}

export function openMerchModal() {
  editor.merch = -1;
  field('merchName').value = '';
  field('merchPrice').value = '';
  field('merchDesc').value = '';
  openModal('merchModal');
}

export function editMerch(index) {
  const item = store.state.merchandise[index];
  if (!item) return;
  editor.merch = index;
  field('merchName').value = item.name || '';
  field('merchPrice').value = item.price ?? '';
  field('merchDesc').value = item.description || '';
  openModal('merchModal');
}

export function saveMerch() {
  const name = field('merchName').value.trim();
  const price = Number(field('merchPrice').value);
  if (!name || !Number.isFinite(price)) {
    showMessage('Product name and price are required', 'error');
    return;
  }
  const existing = editor.merch >= 0 ? store.state.merchandise[editor.merch] : null;
  const item = {
    ...(existing || {}),
    id: existing?.id || `merch-${Date.now()}`,
    name,
    price,
    description: field('merchDesc').value.trim(),
    currency: existing?.currency || 'ZAR',
    new: existing?.new === true,
    gradient: existing?.gradient || 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
    symbol: existing?.symbol || name.slice(0, 1).toUpperCase(),
    type: existing?.type || 'ITEM',
    image: existing?.image || ''
  };

  if (existing) store.state.merchandise[editor.merch] = item;
  else store.state.merchandise.push(item);

  closeModal('merchModal');
  notifyChanged();
  showMessage('Product saved in this session', 'success');
}

export function deleteMerch(index) {
  if (!store.state.merchandise[index]) return;
  if (!window.confirm('Delete this product?')) return;
  store.state.merchandise.splice(index, 1);
  notifyChanged();
  showMessage('Product removed from this session', 'success');
}
