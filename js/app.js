/**
 * Public site entry. One module starts behavior, loads JSON, then renders.
 */

import { store } from './data/store.js';
import { loadSite } from './data/loader.js';
import { applyChrome } from './components/chrome.js';
import { renderFeaturedArtist } from './components/featured-artist.js';
import { initArtistCards, renderArtists } from './components/artists.js';
import { renderEvents } from './components/events.js';
import { renderMerchandise } from './components/merchandise.js';
import { renderGallery } from './components/gallery.js';
import { initNavigation } from './ui/navigation.js';
import { initLightbox } from './ui/lightbox.js';
import { initScrollAnimations, observe } from './ui/scroll-animations.js';
import { initMusicPlayer } from './ui/music-player.js';
import { initBookingForm } from './forms/booking-form.js';
import { initNewsletter } from './forms/newsletter.js';
import { initHeroCanvas } from './canvas/hero-canvas.js';

window.GOAT = {
  data: store.state,
  config: store.state.config,
  ui: {}
};

function safe(name, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[GOAT] ${name} failed`, error);
  }
}

initNavigation();
initLightbox();
initMusicPlayer();
initBookingForm();
initNewsletter();
initHeroCanvas();
initArtistCards();
initScrollAnimations();

loadSite().then(() => {
  window.GOAT.config = store.state.config;
  safe('chrome', applyChrome);
  safe('featured artist', renderFeaturedArtist);
  safe('artists', renderArtists);
  safe('events', renderEvents);
  safe('merchandise', renderMerchandise);
  safe('gallery', renderGallery);
  observe(document);
}).catch((error) => {
  console.error('[GOAT] Content load failed', error);
});
