/**
 * Shared constants for the public site and the admin editor.
 * Content lives in /data. This file only names files and display maps.
 */

export const DATA_FILES = {
  artists: 'artists.json',
  events: 'events.json',
  merchandise: 'merchandise.json',
  gallery: 'gallery.json',
  featuredArtist: 'featured-artist.json',
  label: 'label-info.json',
  config: 'site-config.json'
};

export const SOCIALS = [
  { key: 'instagram', label: 'IG', name: 'Instagram' },
  { key: 'twitter', label: 'TW', name: 'X' },
  { key: 'soundcloud', label: 'SC', name: 'SoundCloud' },
  { key: 'spotify', label: 'SP', name: 'Spotify' },
  { key: 'youtube', label: 'YT', name: 'YouTube' },
  { key: 'tiktok', label: 'TK', name: 'TikTok' }
];

export const STAT_LABELS = {
  tracksReleased: 'Tracks Released',
  monthlyListeners: 'Monthly Listeners',
  yearsActive: 'Years Active',
  albums: 'Albums',
  totalStreams: 'Total Streams',
  artistsSigned: 'Artists Signed',
  streamsGlobal: 'Streams Global',
  eventsPerYear: 'Events/Year'
};

export const ARTIST_FALLBACKS = 7;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dataBasePath() {
  const path = window.location.pathname || '';
  return path.includes('/admin/') ? '../data/' : 'data/';
}

/** Display day and month from a canonical YYYY-MM-DD value, without UTC day-shift. */
export function dateParts(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);
  if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== day) {
    return null;
  }
  return {
    day: String(day).padStart(2, '0'),
    month: `${MONTHS[monthIndex]} ${year}`
  };
}

export function splitDisplayName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { lead: '', accent: '' };
  if (parts.length === 1) return { lead: parts[0], accent: '' };
  return { lead: parts[0], accent: parts.slice(1).join(' ') };
}

export function fallbackIndex(id) {
  const source = String(id || 'x');
  return source.charCodeAt(0) % ARTIST_FALLBACKS;
}

export function isHexColor(value) {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}
