import { store } from '../../js/data/store.js';
import { notifyChanged } from './state.js';
import { showMessage } from './ui.js';

function field(id) {
  return document.getElementById(id);
}

export function renderLabel() {
  const label = store.state.label || {};
  const contact = label.contact || {};
  if (!field('labelName')) return;
  field('labelName').value = label.name || '';
  field('labelTagline').value = label.tagline || '';
  field('labelEmail').value = contact.generalEmail || '';
  field('bookingsEmail').value = contact.bookingsEmail || '';
  field('labelDesc').value = label.description || '';
}

export function saveLabelInfo() {
  const label = store.state.label || {};
  label.name = field('labelName').value.trim();
  label.tagline = field('labelTagline').value.trim();
  label.contact = label.contact || {};
  label.contact.generalEmail = field('labelEmail').value.trim();
  label.contact.bookingsEmail = field('bookingsEmail').value.trim();
  label.description = field('labelDesc').value.trim();
  store.state.label = label;
  notifyChanged({ label: true });
  showMessage('Label info saved in this session', 'success');
}
