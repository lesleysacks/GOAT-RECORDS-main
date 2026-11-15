/**
 * renderer.js
 *
 * Paints roster, events, merchandise, and the featured artist from JSON.
 * Text is written with textContent. Profile details open in a dialog.
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const STAT_LABELS = {
  tracksReleased: 'Tracks Released',
  monthlyListeners: 'Monthly Listeners',
  yearsActive: 'Years Active',
  albums: 'Albums',
  totalStreams: 'Streams'
};

window.renderer = {
  renderArtists() {
    const grid = document.querySelector('.artists-grid');
    if (!grid || !window.goatData?.artists) return;

    const artists = window.goatData.artists;
    const featured = artists.find((artist) => artist.featured);
    const html = [
      featured ? this.createFeaturedArtistCard(featured) : '',
      ...artists.filter((artist) => !artist.featured).map((artist) => this.createArtistCard(artist))
    ].join('');

    grid.innerHTML = html;
  },

  createFeaturedArtistCard(artist) {
    const genres = artist.genres?.join(' / ') || '';
    return `
      <article class="artist-card artist-card-lead">
        <div class="artist-card-img">
          <img class="easy-image" src="${escapeHtml(artist.image)}" alt="${escapeHtml(artist.name)} — ${escapeHtml(genres)}">
          <p class="lead-flag">Lead artist</p>
        </div>
        <div class="artist-card-copy">
          <span class="status-badge status-${escapeHtml(String(artist.status || '').toLowerCase())}">${escapeHtml(artist.status)}</span>
          <h3 class="artist-name">${escapeHtml(artist.name)}</h3>
          <p class="artist-genre">${escapeHtml(genres)}${artist.location ? ` — ${escapeHtml(artist.location)}` : ''}</p>
          <p class="artist-bio">${escapeHtml(artist.shortBio || artist.bio || '')}</p>
          <div class="artist-card-actions">
            <button type="button" class="btn btn-white" data-artist-id="${escapeHtml(artist.id)}"><span>Profile</span></button>
            <a href="#bookings" class="btn btn-red"><span>Book ${escapeHtml(artist.name)}</span></a>
          </div>
        </div>
      </article>
    `;
  },

  createArtistCard(artist) {
    const genres = artist.genres?.join(', ') || '';
    const initials = artist.name.split(/\s+/).map((part) => part[0]).join('');
    return `
      <article class="artist-card">
        <div class="artist-card-img">
          <div class="artist-card-img-inner">
            <img class="easy-image" src="${escapeHtml(artist.image)}" alt="${escapeHtml(artist.name)} — ${escapeHtml(genres)}" loading="lazy" decoding="async">
            <div class="artist-avatar" style="background:${this.generateGradient(artist.id)}" aria-hidden="true">${escapeHtml(initials)}</div>
          </div>
        </div>
        <div class="artist-overlay">
          <span class="status-badge status-${escapeHtml(String(artist.status || '').toLowerCase())}">${escapeHtml(artist.status)}</span>
          <h3 class="artist-name">${escapeHtml(artist.name)}</h3>
          <p class="artist-genre">${escapeHtml(genres)}</p>
          <button type="button" class="btn btn-white" data-artist-id="${escapeHtml(artist.id)}"><span>Profile</span></button>
        </div>
      </article>
    `;
  },

  renderEvents() {
    const container = document.querySelector('.events-grid');
    if (!container || !window.goatData?.events) return;
    container.replaceChildren();

    window.goatData.events.forEach((event) => {
      const row = document.createElement('article');
      row.className = 'event-row';

      const date = document.createElement('div');
      date.className = 'event-date';
      const day = document.createElement('div');
      day.className = 'event-day';
      day.textContent = event.day || '';
      const month = document.createElement('div');
      month.className = 'event-month';
      month.textContent = event.month || '';
      date.append(day, month);

      const info = document.createElement('div');
      info.className = 'event-info';
      const title = document.createElement('h3');
      title.className = 'event-title';
      title.textContent = event.title || '';
      const venue = document.createElement('p');
      venue.className = 'event-venue';
      venue.textContent = [event.venue, event.location].filter(Boolean).join(' — ');
      const tags = document.createElement('div');
      tags.className = 'event-tags';
      (event.tags || []).forEach((tag) => {
        const chip = document.createElement('span');
        chip.className = 'event-tag';
        chip.textContent = tag;
        tags.append(chip);
      });
      info.append(title, venue, tags);

      const action = document.createElement('div');
      action.className = 'event-action';
      if (event.status === 'sold-out') {
        const status = document.createElement('p');
        status.className = 'event-status';
        status.textContent = event.buttonText || 'Sold out';
        action.append(status);
      } else {
        const link = document.createElement('a');
        link.className = 'btn btn-red';
        link.href = '#bookings';
        const label = document.createElement('span');
        label.textContent = event.buttonText || 'Enquire';
        link.append(label);
        action.append(link);
      }

      row.append(date, info, action);
      container.append(row);
    });
  },

  renderMerchandise() {
    const container = document.querySelector('.merch-grid');
    if (!container || !window.goatData?.merchandise) return;
    container.replaceChildren();

    window.goatData.merchandise.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'merch-card fade-in';

      if (item.new) {
        const badge = document.createElement('div');
        badge.className = 'merch-new';
        badge.textContent = 'New';
        card.append(badge);
      }

      const imgWrap = document.createElement('div');
      imgWrap.className = 'merch-img';
      const inner = document.createElement('div');
      inner.className = 'merch-img-inner';
      const photo = item.image && !String(item.image).startsWith('data:');
      if (photo) {
        const img = document.createElement('img');
        img.className = 'merch-photo';
        img.src = item.image;
        img.alt = `Preview mockup of ${item.name}. Not an official product photograph.`;
        img.loading = 'lazy';
        img.decoding = 'async';
        inner.append(img);
      } else {
        inner.style.background = item.gradient || 'linear-gradient(135deg,#1a1a1a,#2a2a2a)';
        inner.style.flexDirection = 'column';
        inner.style.gap = '8px';
        const symbol = document.createElement('div');
        symbol.style.fontFamily = 'var(--font-display)';
        symbol.style.fontSize = String(item.symbol || '').length > 3 ? '2rem' : '4rem';
        symbol.style.color = '#ffffff';
        symbol.textContent = item.symbol || '';
        const type = document.createElement('div');
        type.style.fontFamily = 'var(--font-cond)';
        type.style.fontSize = '0.72rem';
        type.style.letterSpacing = '0.22em';
        type.style.color = 'rgba(255,255,255,0.78)';
        type.textContent = item.type || '';
        inner.append(symbol, type);
      }
      imgWrap.append(inner);

      const body = document.createElement('div');
      body.className = 'merch-body';
      const name = document.createElement('h3');
      name.className = 'merch-name';
      name.textContent = item.name || '';
      const desc = document.createElement('p');
      desc.className = 'merch-desc';
      desc.textContent = item.description || '';
      const footer = document.createElement('div');
      footer.className = 'merch-footer';
      const price = document.createElement('p');
      price.className = 'merch-price';
      price.append(document.createTextNode(`R${Number(item.price).toLocaleString('en-ZA')}`));
      const currency = document.createElement('span');
      currency.textContent = item.currency ? ` ${item.currency}` : '';
      price.append(currency);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'merch-buy';
      button.dataset.name = item.name || '';
      button.dataset.price = `R${Number(item.price).toLocaleString('en-ZA')} ${item.currency || ''}`.trim();
      button.textContent = 'Enquire';
      footer.append(price, button);
      body.append(name, desc, footer);
      card.append(imgWrap, body);
      container.append(card);
    });
  },

  renderFeaturedArtist() {
    const container = document.getElementById('featured-artist');
    const artist = window.goatData.getFeaturedArtist?.();
    if (!container || !artist) return;

    const portrait = container.querySelector('.featured-portrait');
    if (portrait) {
      portrait.src = artist.image;
      portrait.alt = `${artist.name} — featured artist`;
    }

    const nameEl = container.querySelector('.featured-name');
    if (nameEl) {
      const parts = String(artist.name || '').trim().split(/\s+/);
      nameEl.replaceChildren(document.createTextNode(parts[0] || artist.name || ''));
      if (parts.length > 1) {
        nameEl.append(document.createTextNode(' '));
        const highlight = document.createElement('span');
        highlight.className = 'highlight';
        highlight.textContent = parts.slice(1).join(' ');
        nameEl.append(highlight);
      }
    }

    const bioEl = container.querySelector('.featured-bio');
    if (bioEl) bioEl.textContent = artist.bio || '';

    const genresEl = container.querySelector('.featured-genre-bar');
    if (genresEl) {
      genresEl.replaceChildren();
      const pills = [...(artist.genres || []).slice(0, 2)];
      if (artist.location) pills.push(artist.location.split(',')[0].trim());
      pills.forEach((text, index) => {
        if (index > 0) {
          const dot = document.createElement('span');
          dot.className = 'featured-genre-dot';
          dot.setAttribute('aria-hidden', 'true');
          genresEl.append(dot);
        }
        const pill = document.createElement('span');
        pill.className = 'featured-genre-pill';
        pill.textContent = text;
        genresEl.append(pill);
      });
    }

    const statsEl = container.querySelector('.featured-stats');
    if (statsEl) {
      statsEl.replaceChildren();
      const stats = artist.stats || {};
      Object.entries(STAT_LABELS).forEach(([key, label]) => {
        if (stats[key] === undefined || stats[key] === '') return;
        const block = document.createElement('div');
        const num = document.createElement('div');
        num.className = 'featured-stat-num';
        num.textContent = String(stats[key]);
        const caption = document.createElement('div');
        caption.className = 'featured-stat-label';
        caption.textContent = label;
        block.append(num, caption);
        statsEl.append(block);
      });
      statsEl.hidden = statsEl.childElementCount === 0;
    }

    const book = container.querySelector('.featured-book');
    if (book) {
      const span = book.querySelector('span');
      if (span) span.textContent = `Book ${artist.name}`;
    }

    const socials = container.querySelector('.featured-socials');
    if (socials) {
      socials.replaceChildren();
      const links = Object.entries(artist.socials || {}).filter(([, url]) => /^https?:\/\//i.test(String(url)));
      if (!links.length) {
        const note = document.createElement('p');
        note.className = 'notice';
        note.textContent = 'Social profile links are not published for this artist.';
        socials.append(note);
      } else {
        links.forEach(([network, url]) => {
          const link = document.createElement('a');
          link.className = 'artist-social';
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = network.slice(0, 2).toUpperCase();
          link.setAttribute('aria-label', `${artist.name} on ${network}`);
          socials.append(link);
        });
      }
    }
  },

  openArtist(id) {
    const artist = window.goatData.getArtist?.(id);
    const dialog = document.getElementById('artist-dialog');
    if (!artist || !dialog) return;

    const media = document.getElementById('artist-dialog-media');
    media.replaceChildren();
    if (artist.image) {
      const img = document.createElement('img');
      img.src = artist.image;
      img.alt = artist.name;
      media.append(img);
    }

    document.getElementById('artist-dialog-status').textContent = artist.status || '';
    document.getElementById('artist-dialog-name').textContent = artist.name || '';
    const genres = artist.genres?.join(', ') || '';
    document.getElementById('artist-dialog-meta').textContent = [genres, artist.location].filter(Boolean).join(' — ');
    document.getElementById('artist-dialog-bio').textContent = artist.bio || artist.shortBio || '';

    const links = document.getElementById('artist-dialog-links');
    links.replaceChildren();
    const realLinks = Object.entries(artist.socials || {}).filter(([, url]) => /^https?:\/\//i.test(String(url)));
    if (!realLinks.length) {
      const note = document.createElement('p');
      note.textContent = 'Social profile links are not published for this artist.';
      links.append(note);
    } else {
      realLinks.forEach(([network, url]) => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = network;
        links.append(link);
      });
    }

    if (!dialog.open) dialog.showModal();
  },

  generateGradient(id) {
    const gradients = [
      'linear-gradient(135deg,#1a0000,#330000)',
      'linear-gradient(135deg,#000,#111)',
      'linear-gradient(135deg,#110000,#1a0000)',
      'linear-gradient(135deg,#0d0d0d,#1a1a1a)',
      'linear-gradient(135deg,#1a0000,#0d0d0d)',
      'linear-gradient(135deg,#0d0000,#1a0a00)',
      'linear-gradient(135deg,#000,#1a0000)'
    ];
    return gradients[(id || 'a').charCodeAt(0) % gradients.length];
  },

  init() {
    this.renderArtists();
    this.renderEvents();
    this.renderMerchandise();
    this.renderFeaturedArtist();
  }
};

document.addEventListener('click', (event) => {
  const profile = event.target.closest('[data-artist-id]');
  if (profile) {
    window.renderer.openArtist(profile.dataset.artistId);
    return;
  }

  const buy = event.target.closest('.merch-buy');
  if (!buy) return;
  const name = buy.dataset.name || 'Merchandise';
  const price = buy.dataset.price || '';
  const body = `Product: ${name}\nListed price: ${price}\n\nOnline checkout is not available. Please reply with size and quantity.\n`;
  window.location.href = `mailto:info@goatrecords.co.za?subject=${encodeURIComponent(`Merch enquiry: ${name}`)}&body=${encodeURIComponent(body)}`;
});

document.getElementById('artist-dialog-close')?.addEventListener('click', () => {
  document.getElementById('artist-dialog').close();
});

document.getElementById('artist-dialog-book')?.addEventListener('click', () => {
  document.getElementById('artist-dialog').close();
});

window.addEventListener('goatDataLoaded', () => {
  window.renderer?.init();
});

if (window.goatData?.ready) window.renderer.init();
