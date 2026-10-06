import { dateParts } from '../../js/config.js';
import { store } from '../../js/data/store.js';
import { el } from '../../js/dom.js';
import { editor, notifyChanged } from './state.js';
import { closeModal, openModal, showMessage } from './ui.js';

function field(id) {
  return document.getElementById(id);
}

export function renderEvents() {
  const list = document.getElementById('eventsList');
  if (!list) return;
  const events = Array.isArray(store.state.events) ? store.state.events : [];
  list.replaceChildren();
  if (!events.length) {
    list.append(el('p', { className: 'empty-note', text: 'No events yet.' }));
    return;
  }

  events.forEach((event, index) => {
    const when = dateParts(event.date) || { day: event.day || '', month: event.month || '' };
    const card = el('article', { className: 'item-card' });
    const info = el('div', { className: 'item-info' });
    info.append(el('h3', { text: event.title || 'Untitled event' }));
    info.append(el('p', { text: [when.day, when.month, event.venue].filter(Boolean).join(' ') }));
    const tags = el('div', { className: 'tag-list' });
    (Array.isArray(event.tags) ? event.tags : []).forEach((tag) => {
      tags.append(el('span', { className: 'status-badge', text: tag }));
    });
    info.append(tags);
    const actions = el('div', { className: 'item-actions' });
    actions.append(
      el('button', { className: 'btn-small', text: 'Edit', attrs: { type: 'button', 'data-action': 'event-edit', 'data-index': index } }),
      el('button', { className: 'btn-small secondary', text: 'Delete', attrs: { type: 'button', 'data-action': 'event-delete', 'data-index': index } })
    );
    card.append(info, actions);
    list.append(card);
  });
}

export function openEventModal() {
  editor.event = -1;
  field('eventTitle').value = '';
  field('eventDate').value = '';
  field('eventVenue').value = '';
  field('eventLocation').value = '';
  field('eventTags').value = '';
  openModal('eventModal');
}

export function editEvent(index) {
  const event = store.state.events[index];
  if (!event) return;
  editor.event = index;
  field('eventTitle').value = event.title || '';
  field('eventDate').value = event.date || '';
  field('eventVenue').value = event.venue || '';
  field('eventLocation').value = event.location || '';
  field('eventTags').value = Array.isArray(event.tags) ? event.tags.join(', ') : '';
  openModal('eventModal');
}

export function saveEvent() {
  const title = field('eventTitle').value.trim();
  const iso = field('eventDate').value;
  if (!title || !iso) {
    showMessage('Event title and date are required', 'error');
    return;
  }
  const existing = editor.event >= 0 ? store.state.events[editor.event] : null;
  const parts = dateParts(iso) || { day: existing?.day || '', month: existing?.month || '' };
  const event = {
    ...(existing || {}),
    id: existing?.id || `event-${Date.now()}`,
    title,
    date: iso,
    day: parts.day,
    month: parts.month,
    venue: field('eventVenue').value.trim(),
    location: field('eventLocation').value.trim(),
    tags: field('eventTags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
    type: existing?.type || 'Showcase',
    status: existing?.status || 'available',
    buttonText: existing?.buttonText || 'Get Tickets'
  };

  if (existing) store.state.events[editor.event] = event;
  else store.state.events.push(event);

  closeModal('eventModal');
  notifyChanged();
  showMessage('Event saved in this session', 'success');
}

export function deleteEvent(index) {
  if (!store.state.events[index]) return;
  if (!window.confirm('Delete this event?')) return;
  store.state.events.splice(index, 1);
  notifyChanged();
  showMessage('Event removed from this session', 'success');
}
