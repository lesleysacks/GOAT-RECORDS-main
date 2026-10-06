import { store } from '../../js/data/store.js';
import { el } from '../../js/dom.js';
import { editor, notifyChanged } from './state.js';
import { closeModal, openModal, showMessage } from './ui.js';

function field(id) {
  return document.getElementById(id);
}

export function renderGallery() {
  const list = document.getElementById('galleryList');
  if (!list) return;
  const items = Array.isArray(store.state.gallery) ? store.state.gallery : [];
  list.replaceChildren();
  if (!items.length) {
    list.append(el('p', { className: 'empty-note', text: 'No gallery items yet.' }));
    return;
  }

  items.forEach((item, index) => {
    const card = el('article', { className: 'item-card' });
    const info = el('div', { className: 'item-info' });
    info.append(el('h3', { text: item.label || 'Untitled' }));
    const detail = item.image ? 'Image set' : `Fallback height: ${item.height || 240}px`;
    info.append(el('p', { text: item.description || detail }));
    const actions = el('div', { className: 'item-actions' });
    actions.append(
      el('button', { className: 'btn-small', text: 'Edit', attrs: { type: 'button', 'data-action': 'gallery-edit', 'data-index': index } }),
      el('button', { className: 'btn-small secondary', text: 'Delete', attrs: { type: 'button', 'data-action': 'gallery-delete', 'data-index': index } })
    );
    card.append(info, actions);
    list.append(card);
  });
}

function fill(item) {
  field('galleryLabel').value = item?.label || '';
  field('galleryDescription').value = item?.description || '';
  field('galleryHeight').value = item?.height || 240;
  field('galleryGradient').value = item?.gradient || '';
  field('galleryImage').value = item?.image || '';
}

export function openGalleryModal() {
  editor.gallery = -1;
  fill(null);
  openModal('galleryModal');
}

export function editGallery(index) {
  const item = store.state.gallery[index];
  if (!item) return;
  editor.gallery = index;
  fill(item);
  openModal('galleryModal');
}

export function saveGallery() {
  const label = field('galleryLabel').value.trim();
  if (!label) {
    showMessage('Gallery label is required', 'error');
    return;
  }
  const existing = editor.gallery >= 0 ? store.state.gallery[editor.gallery] : null;
  const height = Number(field('galleryHeight').value);
  const item = {
    ...(existing || {}),
    id: existing?.id || `gallery-${Date.now()}`,
    label,
    description: field('galleryDescription').value.trim(),
    height: Number.isFinite(height) && height > 0 ? height : 240,
    gradient: field('galleryGradient').value.trim(),
    image: field('galleryImage').value.trim()
  };

  if (existing) store.state.gallery[editor.gallery] = item;
  else store.state.gallery.push(item);

  closeModal('galleryModal');
  notifyChanged();
  showMessage('Gallery item saved in this session', 'success');
}

export function deleteGallery(index) {
  if (!store.state.gallery[index]) return;
  if (!window.confirm('Delete this gallery item?')) return;
  store.state.gallery.splice(index, 1);
  notifyChanged();
  showMessage('Gallery item removed from this session', 'success');
}
