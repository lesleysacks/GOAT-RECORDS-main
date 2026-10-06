/**
 * Single in-memory content store for one page load.
 * The public site and the admin editor each get their own page, so this
 * singleton is not shared across tabs.
 */

function blankState() {
  return {
    artists: [],
    events: [],
    merchandise: [],
    gallery: [],
    featuredArtist: { artistId: '' },
    label: {},
    config: {},
    errors: []
  };
}

export const store = {
  state: blankState(),

  getFeaturedArtist() {
    const artists = Array.isArray(this.state.artists) ? this.state.artists : [];
    const id = this.state.featuredArtist && this.state.featuredArtist.artistId;
    if (id) return artists.find((artist) => artist && artist.id === id) || null;
    return artists.find((artist) => artist && artist.featured) || null;
  },

  getArtist(id) {
    const artists = Array.isArray(this.state.artists) ? this.state.artists : [];
    return artists.find((artist) => artist && artist.id === id) || null;
  },

  exportPayload() {
    const { artists, events, merchandise, gallery, featuredArtist, label } = this.state;
    return { artists, events, merchandise, gallery, featuredArtist, label };
  },

  exportJSON() {
    return JSON.stringify(this.exportPayload(), null, 2);
  },

  /**
   * Apply a backup object. Unknown or wrong-typed fields are left untouched.
   * Returns a list of collections that changed.
   */
  importPayload(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Backup must be a JSON object');
    }
    const applied = [];
    ['artists', 'events', 'merchandise', 'gallery'].forEach((key) => {
      if (Array.isArray(data[key])) {
        this.state[key] = data[key];
        applied.push(key);
      }
    });
    if (data.featuredArtist && typeof data.featuredArtist === 'object' && !Array.isArray(data.featuredArtist)) {
      this.state.featuredArtist = data.featuredArtist;
      applied.push('featuredArtist');
    }
    if (data.label && typeof data.label === 'object' && !Array.isArray(data.label)) {
      this.state.label = data.label;
      applied.push('label');
    }
    if (!applied.length) throw new Error('No recognised collections in that file');
    return applied;
  }
};
