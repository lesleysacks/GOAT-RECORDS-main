import { store } from '../../js/data/store.js';
import { el } from '../../js/dom.js';
import { editor, notifyChanged } from './state.js';
import { closeModal, openModal, showMessage } from './ui.js';

function field(id) {
  return document.getElementById(id);
}

export function renderArtists() {
  const list = document.getElementById('artistsList');
  if (!list) return;
  const artists = Array.isArray(store.state.artists) ? store.state.artists : [];
  list.replaceChildren();
  if (!artists.length) {
    list.append(el('p', { className: 'empty-note', text: 'No artists yet.' }));
    return;
  }

  artists.forEach((artist, index) => {
    const card = el('article', { className: 'item-card' });
    const info = el('div', { className: 'item-info' });
    info.append(el('h3', { text: artist.name || 'Untitled artist' }));
    info.append(el('p', { text: Array.isArray(artist.genres) ? artist.genres.join(', ') : '' }));
    info.append(el('span', {
      className: `status-badge${artist.status === 'Upcoming' ? ' secondary' : ''}`,
      text: artist.status || ''
    }));
    const actions = el('div', { className: 'item-actions' });
    actions.append(
      el('button', { className: 'btn-small', text: 'Edit', attrs: { type: 'button', 'data-action': 'artist-edit', 'data-index': index } }),
      el('button', { className: 'btn-small secondary', text: 'Delete', attrs: { type: 'button', 'data-action': 'artist-delete', 'data-index': index } })
    );
    card.append(info, actions);
    list.append(card);
  });
}

export function openArtistModal() {
  editor.artist = -1;
  field('artistName').value = '';
  field('artistStatus').value = 'Signed';
  field('artistGenres').value = '';
  field('artistLocation').value = '';
  field('artistBio').value = '';
  field('artistImage').value = '';
  openForm();
}

function openForm() {
  openModal('artistModal');
}

export function editArtist(index) {
  const artist = store.state.artists[index];
  if (!artist) return;
  editor.artist = index;
  field('artistName').value = artist.name || '';
  field('artistStatus').value = artist.status || 'Signed';
  field('artistGenres').value = Array.isArray(artist.genres) ? artist.genres.join(', ') : '';
  field('artistLocation').value = artist.location || '';
  field('artistBio').value = artist.bio || '';
  field('artistImage').value = artist.image || '';
  openForm();
}

export function saveArtist() {
  const name = field('artistName').value.trim();
  if (!name) {
    showMessage('Artist name is required', 'error');
    return;
  }
  const existing = editor.artist >= 0 ? store.state.artists[editor.artist] : null;
  const bio = field('artistBio').value.trim();
  const artist = {
    ...(existing || {}),
    id: existing?.id || `artist-${Date.now()}`,
    name,
    status: field('artistStatus').value,
    genres: field('artistGenres').value.split(',').map((genre) => genre.trim()).filter(Boolean),
    location: field('artistLocation').value.trim(),
    image: field('artistImage').value.trim(),
    bio,
    shortBio: existing?.shortBio && existing.shortBio !== existing.bio ? existing.shortBio : bio
  };
  delete artist.featured;

  if (existing) store.state.artists[editor.artist] = artist;
  else store.state.artists.push(artist);

  closeModal('artistModal');
  notifyChanged();
  showMessage('Artist saved in this session', 'success');
}

export function deleteArtist(index) {
  const artist = store.state.artists[index];
  if (!artist) return;
  if (!window.confirm(`Delete ${artist.name || 'this artist'}?`)) return;
  store.state.artists.splice(index, 1);
  if (store.state.featuredArtist?.artistId === artist.id) {
    store.state.featuredArtist.artistId = store.state.artists[0]?.id || '';
  }
  notifyChanged();
  showMessage('Artist removed from this session', 'success');
}
