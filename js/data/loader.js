/**
 * Loads each JSON file on its own so one missing file does not blank the site.
 */

import { DATA_FILES, dataBasePath } from '../config.js';
import { store } from './store.js';

const UNWRAP = {
  artists: 'artists',
  events: 'events',
  merchandise: 'merchandise',
  gallery: 'gallery',
  featuredArtist: 'featuredArtist',
  label: 'label',
  config: null
};

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function assign(key, payload) {
  const wrapper = UNWRAP[key];
  const value = wrapper ? payload?.[wrapper] : payload;
  if (value == null) throw new Error(`Missing "${wrapper || key}" in ${key}`);
  store.state[key] = value;
}

export async function loadSite() {
  const base = dataBasePath();
  store.state.errors = [];

  await Promise.all(Object.entries(DATA_FILES).map(async ([key, file]) => {
    const path = base + file;
    try {
      const payload = await loadJSON(path);
      assign(key, payload);
    } catch (error) {
      store.state.errors.push({ key, file, message: error.message || String(error) });
      console.warn(`[GOAT] Could not load ${path}:`, error.message || error);
    }
  }));

  const detail = store.state;
  window.dispatchEvent(new CustomEvent('goat:ready', { detail }));
  return detail;
}
