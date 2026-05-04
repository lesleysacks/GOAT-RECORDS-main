/**
 * content-loader.js
 * 
 * @description Dynamically loads content from JSON data files
 * Centralizes all content management into separate JSON files for easy editing
 * 
 * @requires None (vanilla JS)
 * @exports window.goatData - Global data object containing all content
 * 
 * @features
 * - Async loading of all JSON data files
 * - Fallback to demo data if files not found
 * - Single source of truth for all content
 * - Easy admin interface integration
 * - Works from both root and admin/ subdirectory
 * 
 * @data_files
 * - data/artists.json - Artist roster
 * - data/events.json - Tour dates and events
 * - data/merchandise.json - Merch store items
 * - data/gallery.json - Gallery items
 * - data/featured-artist.json - Featured artist selection
 * - data/label-info.json - Label information and contact
 */

// ─── DETECT CURRENT LOCATION ───
const isAdminPage = window.location.pathname.includes('/admin/');
const basePath = isAdminPage ? '../data/' : 'data/';

// ─── DEMO/FALLBACK DATA ───
const fallbackData = {
  artists: [
    { id: 'luda-g', name: 'LUDA G', status: 'Signed', genres: ['Rap', 'Hip-Hop'], location: 'Paarl, SA', image: 'images/luda g poster pic.jpg', bio: 'Lead artist of GOAT RECORDS', featured: true }
  ],
  events: [],
  merchandise: [],
  gallery: [],
  featuredArtist: { artistId: 'luda-g' },
  label: { name: 'GOAT RECORDS' }
};

// ─── CONTENT DATA OBJECT ───
window.goatData = {
  artists: fallbackData.artists,
  events: fallbackData.events,
  merchandise: fallbackData.merchandise,
  gallery: fallbackData.gallery,
  featuredArtist: fallbackData.featuredArtist,
  label: fallbackData.label,
  
  /**
   * Load all JSON data files
   * @returns {Promise<void>}
   */
  async loadAll() {
    try {
      const [artists, events, merch, gallery, featured, label] = await Promise.all([
        this.loadJSON(basePath + 'artists.json'),
        this.loadJSON(basePath + 'events.json'),
        this.loadJSON(basePath + 'merchandise.json'),
        this.loadJSON(basePath + 'gallery.json'),
        this.loadJSON(basePath + 'featured-artist.json'),
        this.loadJSON(basePath + 'label-info.json')
      ]);
      
      if (artists?.artists) this.artists = artists.artists;
      if (events?.events) this.events = events.events;
      if (merch?.merchandise) this.merchandise = merch.merchandise;
      if (gallery?.gallery) this.gallery = gallery.gallery;
      if (featured?.featuredArtist) this.featuredArtist = featured.featuredArtist;
      if (label?.label) this.label = label.label;
      
      console.log('✓ Content loaded from JSON data files');
      window.dispatchEvent(new CustomEvent('goatDataLoaded', { detail: this }));
    } catch (err) {
      console.warn('⚠ Using fallback data (JSON files not found or error loading):', err.message);
      window.dispatchEvent(new CustomEvent('goatDataLoaded', { detail: this }));
    }
  },
  
  /**
   * Load individual JSON file
   * @param {string} path - Path to JSON file
   * @returns {Promise<Object>}
   */
  async loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  },
  
  /**
   * Get featured artist data
   * @returns {Object} Featured artist object
   */
  getFeaturedArtist() {
    const id = this.featuredArtist?.artistId;
    return this.artists.find(a => a.id === id) || this.artists[0];
  },
  
  /**
   * Get artist by ID
   * @param {string} id - Artist ID
   * @returns {Object} Artist object
   */
  getArtist(id) {
    return this.artists.find(a => a.id === id);
  },
  
  /**
   * Update data (for admin interface)
   * @param {string} type - Data type (artists, events, merchandise, gallery, label)
   * @param {Array|Object} data - New data
   */
  updateData(type, data) {
    if (this[type] !== undefined) {
      this[type] = data;
      console.log(`✓ Updated ${type}`);
      window.dispatchEvent(new CustomEvent('goatDataUpdated', { detail: { type, data } }));
    }
  },
  
  /**
   * Export all data as JSON string
   * @returns {string} JSON string
   */
  exportJSON() {
    return JSON.stringify({
      artists: this.artists,
      events: this.events,
      merchandise: this.merchandise,
      gallery: this.gallery,
      featuredArtist: this.featuredArtist,
      label: this.label
    }, null, 2);
  },
  
  /**
   * Import data from JSON string
   * @param {string} jsonString - JSON string
   */
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.artists) this.updateData('artists', data.artists);
      if (data.events) this.updateData('events', data.events);
      if (data.merchandise) this.updateData('merchandise', data.merchandise);
      if (data.gallery) this.updateData('gallery', data.gallery);
      if (data.featuredArtist) this.updateData('featuredArtist', data.featuredArtist);
      if (data.label) this.updateData('label', data.label);
      console.log('✓ Data imported successfully');
    } catch (err) {
      console.error('✗ Error importing data:', err);
      throw err;
    }
  }
};

// ─── AUTO-LOAD ON PAGE READY ───
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.goatData.loadAll());
} else {
  window.goatData.loadAll();
}
