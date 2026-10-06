/**
 * One artist-card renderer for the whole roster.
 * The wide card is whoever featured-artist.json points at, not a hardcoded name.
 */

import { SOCIALS, fallbackIndex } from '../config.js';
import { store } from '../data/store.js';
import { appendLink, clear, el, emptyState, isSafeUrl } from '../dom.js';

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  const letters = parts.map((part) => part[0]).join('');
  return (letters || 'GOAT').slice(0, 4).toUpperCase();
}

function statusClass(status) {
  const key = String(status || 'signed').toLowerCase().replace(/\s+/g, '-');
  return `status-badge status-${key}`;
}

function genreLine(artist, separator) {
  const genres = Array.isArray(artist.genres) ? artist.genres.filter(Boolean) : [];
  return genres.join(separator);
}

function addSocials(parent, artist, className) {
  const socials = artist.socials || {};
  const row = el('div', { className: className || 'artist-socials' });
  SOCIALS.forEach((network) => {
    const href = socials[network.key];
    if (!href) return;
    appendLink(row, href, 'artist-social', network.label, `${artist.name} on ${network.name}`);
  });
  if (row.childElementCount) parent.append(row);
}

function photo(artist, eager) {
  const wrap = el('div', { className: 'artist-card-img-inner' });
  const fallback = el('div', {
    className: `artist-avatar artist-fallback-${fallbackIndex(artist.id)}`,
    text: initials(artist.name),
    attrs: { 'aria-hidden': 'true' }
  });
  wrap.append(fallback);

  if (isSafeUrl(artist.image)) {
    const image = el('img', {
      className: 'easy-image',
      attrs: {
        alt: `${artist.name}${artist.genres?.length ? ` — ${genreLine(artist, ', ')}` : ''}`,
        decoding: 'async'
      }
    });
    if (!eager) image.loading = 'lazy';
    image.src = artist.image.trim();
    image.addEventListener('error', () => image.remove());
    wrap.append(image);
  }
  return wrap;
}

function featuredCard(artist, config) {
  const card = el('article', { className: 'artist-card artist-card--featured fade-in' });
  const media = el('div', { className: 'artist-card-img' });
  const frame = photo(artist, true);
  frame.append(el('div', {
    className: 'lead-badge',
    text: config.featured?.rosterBadge || '★ Lead Artist'
  }));
  media.append(frame);

  const panel = el('div', { className: 'artist-card-panel' });
  panel.append(el('span', {
    className: `${statusClass(artist.status)} status-badge--start`,
    text: artist.status || 'Signed'
  }));
  panel.append(el('div', { className: 'artist-name artist-name--lead', text: artist.name || 'Artist' }));
  const meta = [genreLine(artist, ' / '), artist.location].filter(Boolean).join(' — ');
  if (meta) panel.append(el('div', { className: 'artist-genre artist-genre--lead', text: meta }));
  const bio = artist.shortBio || artist.bio;
  if (bio) panel.append(el('p', { className: 'artist-bio artist-bio--lead', text: bio }));
  addSocials(panel, artist, 'artist-socials artist-socials--start');
  const book = el('a', { className: 'btn btn-red', children: [el('span', { text: `Book ${artist.name || 'Artist'}` })] });
  book.href = '#bookings';
  panel.append(book);

  card.append(media, panel);
  return card;
}

function rosterCard(artist) {
  const card = el('article', {
    className: 'artist-card fade-in',
    attrs: { tabindex: '0', 'aria-expanded': 'false' }
  });
  const media = el('div', { className: 'artist-card-img' });
  media.append(photo(artist, false));

  const overlay = el('div', { className: 'artist-overlay' });
  overlay.append(el('span', { className: statusClass(artist.status), text: artist.status || '' }));
  overlay.append(el('div', { className: 'artist-name', text: artist.name || 'Artist' }));
  const genres = genreLine(artist, ', ');
  if (genres) overlay.append(el('div', { className: 'artist-genre', text: genres }));

  const detail = el('div', { className: 'artist-overlay-detail' });
  detail.append(el('span', { className: statusClass(artist.status), text: artist.status || '' }));
  detail.append(el('div', { className: 'artist-name artist-name--detail', text: artist.name || 'Artist' }));
  const detailGenre = [genres, artist.location].filter(Boolean).join(' — ');
  if (detailGenre) detail.append(el('div', { className: 'artist-genre', text: detailGenre }));
  const bio = artist.shortBio || artist.bio;
  if (bio) detail.append(el('p', { className: 'artist-bio', text: bio }));
  addSocials(detail, artist);

  card.append(media, overlay, detail);
  return card;
}

function failed(key) {
  return store.state.errors.some((error) => error.key === key);
}

export function renderArtists() {
  const grid = document.querySelector('[data-render="artists"]');
  if (!grid) return;
  clear(grid);

  if (failed('artists')) {
    grid.append(emptyState('Artists could not be loaded.'));
    return;
  }

  const artists = (store.state.artists || []).filter((artist) => artist && typeof artist === 'object');
  if (!artists.length) {
    grid.append(emptyState('No artists on the roster yet.'));
    return;
  }

  const featured = store.getFeaturedArtist();
  const config = store.state.config || {};
  if (featured) grid.append(featuredCard(featured, config));

  artists.forEach((artist) => {
    if (featured && artist.id && artist.id === featured.id) return;
    try {
      grid.append(rosterCard(artist));
    } catch (error) {
      console.warn('[GOAT] Skipped an artist card', error);
    }
  });
}

export function initArtistCards() {
  const grid = document.querySelector('[data-render="artists"]');
  if (!grid) return;

  const toggle = (card) => {
    if (!card || card.classList.contains('artist-card--featured')) return;
    const open = !card.classList.contains('expanded');
    card.classList.toggle('expanded', open);
    card.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  grid.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    toggle(event.target.closest('.artist-card'));
  });

  grid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.artist-card');
    if (!card || event.target !== card) return;
    event.preventDefault();
    toggle(card);
  });
}
