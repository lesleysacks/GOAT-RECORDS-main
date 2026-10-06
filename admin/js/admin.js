/**
 * Admin editor. Changes live in this browser tab until they are downloaded.
 */

import { store } from '../../js/data/store.js';
import { loadSite } from '../../js/data/loader.js';
import { initUi, showMessage, showTab, closeModal } from './ui.js';
import { renderArtists, openArtistModal, editArtist, saveArtist, deleteArtist } from './artists.js';
import { renderEvents, openEventModal, editEvent, saveEvent, deleteEvent } from './events.js';
import { renderMerch, openMerchModal, editMerch, saveMerch, deleteMerch } from './merchandise.js';
import { renderGallery, openGalleryModal, editGallery, saveGallery, deleteGallery } from './gallery.js';
import { renderFeatured, updateFeaturedArtist } from './featured.js';
import { renderLabel, saveLabelInfo } from './label.js';
import { refreshExport, downloadExport, pickImport, importFile, copyExport } from './import-export.js';

window.GOAT = {
  data: store.state,
  config: store.state.config,
  ui: { showMessage }
};

function indexOf(button) {
  return Number(button?.dataset.index);
}

const actions = {
  'show-tab': (button) => showTab(button.dataset.tab, button),
  export: downloadExport,
  'import-pick': pickImport,
  'copy-json': copyExport,
  'artist-add': openArtistModal,
  'artist-edit': (button) => editArtist(indexOf(button)),
  'artist-delete': (button) => deleteArtist(indexOf(button)),
  'artist-save': saveArtist,
  'event-add': openEventModal,
  'event-edit': (button) => editEvent(indexOf(button)),
  'event-delete': (button) => deleteEvent(indexOf(button)),
  'event-save': saveEvent,
  'merch-add': openMerchModal,
  'merch-edit': (button) => editMerch(indexOf(button)),
  'merch-delete': (button) => deleteMerch(indexOf(button)),
  'merch-save': saveMerch,
  'gallery-add': openGalleryModal,
  'gallery-edit': (button) => editGallery(indexOf(button)),
  'gallery-delete': (button) => deleteGallery(indexOf(button)),
  'gallery-save': saveGallery,
  'label-save': saveLabelInfo,
  'modal-close': (button) => closeModal(button.dataset.modal)
};

function refresh(event) {
  renderArtists();
  renderEvents();
  renderMerch();
  renderGallery();
  renderFeatured();
  refreshExport();
  if (event?.detail?.label || event?.detail?.imported) renderLabel();
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = actions[button.dataset.action];
  if (action) action(button);
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'featuredSelect') updateFeaturedArtist();
  if (event.target.id === 'importFile') importFile(event);
});

document.addEventListener('admin:changed', refresh);

initUi();

loadSite().then(() => {
  window.GOAT.config = store.state.config;
  refresh({ detail: { label: true } });
  if (store.state.errors.length) {
    const files = store.state.errors.map((error) => error.file).join(', ');
    showMessage(`Some data files did not load: ${files}`, 'error');
  } else {
    showMessage('Data loaded into this browser session', 'success');
  }
}).catch((error) => {
  showMessage(`Could not load site data: ${error.message}`, 'error');
});
