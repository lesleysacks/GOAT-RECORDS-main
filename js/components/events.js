/**
 * Tour dates from events.json. Day and month are derived from the canonical date.
 */

import { dateParts } from '../config.js';
import { store } from '../data/store.js';
import { clear, el, emptyState } from '../dom.js';

function displayDate(event) {
  const derived = dateParts(event.date);
  if (derived) return derived;
  return {
    day: event.day || '—',
    month: event.month || ''
  };
}

function renderEvent(event) {
  const soldOut = event.status === 'sold-out';
  const when = displayDate(event);
  const row = el('article', { className: 'event-row' });

  const date = el('div', { className: 'event-date' });
  date.append(
    el('div', { className: 'event-day', text: when.day }),
    el('div', { className: 'event-month', text: when.month })
  );

  const info = el('div', { className: 'event-info' });
  info.append(el('div', { className: 'event-title', text: event.title || 'Untitled event' }));
  const place = [event.venue, event.location].filter(Boolean).join(' — ');
  if (place) info.append(el('div', { className: 'event-venue', text: place }));

  const tags = Array.isArray(event.tags) ? event.tags.filter(Boolean) : [];
  if (tags.length) {
    const tagRow = el('div', { className: 'event-tags' });
    tags.forEach((tag) => tagRow.append(el('span', { className: 'event-tag', text: tag })));
    info.append(tagRow);
  }

  const action = el('div', { className: 'event-action' });
  const button = el('a', {
    className: `btn btn-compact ${soldOut ? 'btn-white' : 'btn-red'}`,
    children: [el('span', { text: event.buttonText || (soldOut ? 'Sold Out' : 'Get Tickets') })]
  });
  button.href = '#bookings';
  if (soldOut) button.setAttribute('aria-disabled', 'true');
  action.append(button);

  row.append(date, info, action);
  return row;
}

export function renderEvents() {
  const root = document.querySelector('[data-render="events"]');
  if (!root) return;
  clear(root);

  const failed = store.state.errors.some((error) => error.key === 'events');
  const events = Array.isArray(store.state.events) ? store.state.events : [];
  if (!events.length) {
    root.append(emptyState(failed ? 'Events could not be loaded.' : 'No dates announced yet.'));
    return;
  }

  events.forEach((event) => {
    if (!event || typeof event !== 'object') return;
    try {
      root.append(renderEvent(event));
    } catch (error) {
      console.warn('[GOAT] Skipped an event', error);
    }
  });
}
