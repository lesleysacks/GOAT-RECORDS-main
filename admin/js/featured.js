import { store } from '../../js/data/store.js';
import { el } from '../../js/dom.js';
import { notifyChanged } from './state.js';
import { showMessage } from './ui.js';

export function renderFeatured() {
  const select = document.getElementById('featuredSelect');
  const preview = document.getElementById('featuredPreview');
  if (!select || !preview) return;

  const current = store.state.featuredArtist?.artistId || '';
  select.replaceChildren();
  select.append(new Option('-- Select Artist --', ''));
  (store.state.artists || []).forEach((artist) => {
    if (!artist?.id) return;
    select.append(new Option(artist.name || artist.id, artist.id));
  });
  select.value = [...select.options].some((option) => option.value === current) ? current : '';

  const artist = store.getFeaturedArtist();
  preview.replaceChildren();
  if (!artist) {
    preview.append(el('p', { className: 'empty-note', text: 'No featured artist selected.' }));
    return;
  }

  const card = el('div', { className: 'preview-card' });
  card.append(el('h3', { text: `Preview: ${artist.name || 'Artist'}` }));
  const genres = Array.isArray(artist.genres) ? artist.genres.join(', ') : '';
  if (genres) {
    const line = el('p');
    line.append(el('strong', { text: 'Genres: ' }), document.createTextNode(genres));
    card.append(line);
  }
  if (artist.location) {
    const line = el('p');
    line.append(el('strong', { text: 'Location: ' }), document.createTextNode(artist.location));
    card.append(line);
  }
  if (artist.bio) {
    const line = el('p');
    line.append(el('strong', { text: 'Bio: ' }), document.createTextNode(artist.bio));
    card.append(line);
  }
  preview.append(card);
}

export function updateFeaturedArtist() {
  const select = document.getElementById('featuredSelect');
  if (!select) return;
  const artistId = select.value;
  store.state.featuredArtist = {
    ...(store.state.featuredArtist || {}),
    artistId
  };
  notifyChanged();
  showMessage(artistId ? 'Featured artist updated in this session' : 'Featured artist cleared in this session', 'success');
}
