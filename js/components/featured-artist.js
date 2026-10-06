/**
 * Featured showcase. The artist comes from featured-artist.json joined to artists.json.
 */

import { SOCIALS, STAT_LABELS, splitDisplayName } from '../config.js';
import { store } from '../data/store.js';
import { appendLink, clear, el, emptyState, isSafeUrl } from '../dom.js';

function rankParts(artist, config) {
  const defaults = config.featured || {};
  if (artist.rankBadge || artist.rankLabel) {
    return {
      badge: artist.rankBadge || defaults.rankBadge || '★ #1',
      label: artist.rankLabel || defaults.rankLabel || 'Lead Artist'
    };
  }
  const raw = String(artist.featured_rank || '');
  if (raw.toLowerCase().includes('lead artist')) {
    return {
      badge: raw.replace(/lead artist/i, '').trim() || defaults.rankBadge || '★ #1',
      label: defaults.rankLabel || 'Lead Artist'
    };
  }
  return {
    badge: raw || defaults.rankBadge || '★ #1',
    label: defaults.rankLabel || 'Lead Artist'
  };
}

function statBlocks(stats) {
  if (!stats || typeof stats !== 'object') return [];
  return Object.entries(stats)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => ({
      value: String(value),
      label: STAT_LABELS[key] || key
    }));
}

export function renderFeaturedArtist() {
  const root = document.querySelector('[data-render="featured-artist"]');
  if (!root) return;
  clear(root);

  const failed = store.state.errors.some((error) => error.key === 'artists' || error.key === 'featuredArtist');
  const artist = store.getFeaturedArtist();
  if (!artist) {
    root.append(emptyState(failed ? 'Featured artist could not be loaded.' : 'No featured artist selected.'));
    return;
  }

  const config = store.state.config || {};
  const rank = rankParts(artist, config);
  const name = splitDisplayName(artist.name);

  const visual = el('div', { className: 'featured-visual' });
  visual.append(
    el('div', { className: 'featured-visual-bg' }),
    el('div', { className: 'featured-visual-grid' }),
    el('div', { className: 'featured-visual-glow' })
  );

  const rankRow = el('div', { className: 'featured-rank' });
  rankRow.append(
    el('div', { className: 'featured-rank-badge', text: rank.badge }),
    el('div', { className: 'featured-rank-label', text: rank.label })
  );
  visual.append(rankRow);

  const monogram = el('div', { className: 'featured-monogram' });
  if (isSafeUrl(artist.image)) {
    const image = el('img', {
      attrs: {
        alt: `${artist.name || 'Featured artist'} — ${rank.label}`,
        decoding: 'async'
      }
    });
    image.src = artist.image.trim();
    image.addEventListener('error', () => {
      image.remove();
      monogram.append(el('div', { className: 'featured-monogram-text', text: name.lead || 'GOAT' }));
    });
    monogram.append(image);
  } else {
    monogram.append(el('div', { className: 'featured-monogram-text', text: name.lead || 'GOAT' }));
  }
  visual.append(monogram, el('div', { className: 'featured-vinyl', attrs: { 'aria-hidden': 'true' } }));

  const content = el('div', { className: 'featured-content fade-in' });
  content.append(el('div', { className: 'featured-tag', text: config.featured?.tag || 'Featured Artist' }));

  const heading = el('h2', { className: 'featured-name', attrs: { id: 'featured-heading' } });
  heading.append(document.createTextNode(name.lead || artist.name || 'Artist'));
  if (name.accent) {
    heading.append(document.createTextNode(' '));
    heading.append(el('span', { className: 'highlight', text: name.accent }));
  }
  content.append(heading);

  const genres = Array.isArray(artist.genres) ? artist.genres.filter(Boolean).slice(0, 2) : [];
  const location = String(artist.location || '').split(',')[0].trim();
  const pills = [...genres, location].filter(Boolean);
  if (pills.length) {
    const bar = el('div', { className: 'featured-genre-bar' });
    pills.forEach((pill, index) => {
      if (index > 0) bar.append(el('div', { className: 'featured-genre-dot', attrs: { 'aria-hidden': 'true' } }));
      bar.append(el('span', { className: 'featured-genre-pill', text: pill }));
    });
    content.append(bar);
  }

  if (artist.bio) content.append(el('p', { className: 'featured-bio', text: artist.bio }));

  const stats = statBlocks(artist.stats);
  if (stats.length) {
    const row = el('div', { className: 'featured-stats' });
    stats.forEach((stat) => {
      const block = el('div');
      block.append(
        el('div', { className: 'featured-stat-num', text: stat.value }),
        el('div', { className: 'featured-stat-label', text: stat.label })
      );
      row.append(block);
    });
    content.append(row);
  }

  const ctas = el('div', { className: 'featured-ctas' });
  const book = el('a', { className: 'btn btn-red', children: [el('span', { text: `Book ${artist.name || 'Artist'}` })] });
  book.href = '#bookings';
  const roster = el('a', {
    className: 'btn btn-white',
    children: [el('span', { text: config.featured?.rosterCta || 'Full Roster' })]
  });
  roster.href = config.featured?.rosterHref || '#artists';
  ctas.append(book, roster);
  content.append(ctas);

  const socials = artist.socials || {};
  const socialRow = el('div', { className: 'featured-socials' });
  SOCIALS.forEach((network) => {
    if (!socials[network.key]) return;
    appendLink(socialRow, socials[network.key], 'artist-social', network.label, `${artist.name} on ${network.name}`);
  });
  if (socialRow.childElementCount) content.append(socialRow);

  root.append(visual, content);
}
