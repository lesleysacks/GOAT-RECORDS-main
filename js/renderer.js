/**
 * renderer.js
 * 
 * @description Dynamically renders page content from JSON data
 * Updates HTML sections to display data from content-loader
 * 
 * @requires content-loader.js - For window.goatData
 * @exports window.renderer - Rendering functions
 * 
 * @features
 * - Dynamic artist card rendering
 * - Event list generation
 * - Merchandise grid population
 * - Gallery item creation
 * - Featured artist updates
 */

window.renderer = {
  /**
   * Render artist cards from JSON data
   */
  renderArtists() {
    const grid = document.querySelector('.artists-grid');
    if (!grid || !window.goatData?.artists) return;
    
    const artists = window.goatData.artists;
    const featured = artists.find(a => a.featured);
    
    let html = '';
    
    // Render featured artist first if exists
    if (featured) {
      html += this.createFeaturedArtistCard(featured);
    }
    
    // Render other artists
    artists.forEach(artist => {
      if (!artist.featured) {
        html += this.createArtistCard(artist);
      }
    });
    
    grid.innerHTML = html;
    
    // Add event listeners to artist cards
    grid.querySelectorAll('.artist-card').forEach(card => {
      card.addEventListener('click', function() {
        if (!this.classList.contains('luda-wide')) {
          this.classList.toggle('expanded');
        }
      });
    });
  },
  
  /**
   * Create featured artist HTML
   */
  createFeaturedArtistCard(artist) {
    return `
      <div class="artist-card luda-wide fade-in" style="grid-column: span 2; display:grid; grid-template-columns:1fr 1fr; min-height:320px;">
        <div class="artist-card-img" style="padding-top:0; min-height:320px;">
          <div class="artist-card-img-inner" style="position:relative; height:100%;">
            <div class="artist-avatar" style="height:100%; background-image: url('${artist.image}'); background-size: cover; background-position: center; position:relative;">
              <div style="position:absolute;top:16px;left:16px;background:var(--red);font-family:var(--font-cond);font-size:0.6rem;letter-spacing:0.25em;text-transform:uppercase;padding:4px 12px;color:#fff;">★ LEAD ARTIST</div>
            </div>
          </div>
        </div>
        <div style="position:relative; background:var(--gray); display:flex; flex-direction:column; justify-content:center; padding:40px; border-left:3px solid var(--red);">
          <span class="status-badge status-${artist.status.toLowerCase()}">${artist.status}</span>
          <div class="artist-name" style="font-size:3.2rem; margin-top:4px;">${artist.name}</div>
          <div class="artist-genre" style="font-size:0.8rem; margin-bottom:16px;">${artist.genres.join(' / ')} — ${artist.location}</div>
          <p class="artist-bio" style="max-width:400px; opacity:1; color:rgba(255,255,255,0.65);">${artist.shortBio || artist.bio}</p>
          <div class="artist-socials" style="justify-content:flex-start; margin-top:16px;">
            <a href="#" class="artist-social">IG</a>
            <a href="#" class="artist-social">TW</a>
            <a href="#" class="artist-social">SC</a>
            <a href="#" class="artist-social">SP</a>
            <a href="#" class="artist-social">YT</a>
          </div>
          <a href="#bookings" class="btn btn-red" style="align-self:flex-start; margin-top:24px;"><span>Book ${artist.name}</span></a>
        </div>
      </div>
    `;
  },
  
  /**
   * Create individual artist card HTML
   */
  createArtistCard(artist) {
    const gradient = this.generateGradient(artist.id);
    const initials = artist.name.split(' ').map(n => n[0]).join('');
    
    return `
      <div class="artist-card fade-in">
        <div class="artist-card-img">
          <div class="artist-card-img-inner">
            <img class="easy-image" src="${artist.image}" alt="${artist.name} - ${artist.genres.join(', ')} Artist" onerror="this.style.display='none'">
            <div class="artist-avatar" style="background: ${gradient};">${initials}</div>
          </div>
        </div>
        <div class="artist-overlay">
          <span class="status-badge status-${artist.status.toLowerCase()}">${artist.status}</span>
          <div class="artist-name">${artist.name}</div>
          <div class="artist-genre">${artist.genres.join(', ')}</div>
        </div>
        <div class="artist-overlay-detail">
          <span class="status-badge status-${artist.status.toLowerCase()}">${artist.status}</span>
          <div class="artist-name" style="font-size:1.4rem;">${artist.name}</div>
          <div class="artist-genre">${artist.genres.join(', ')}</div>
          <p class="artist-bio">${artist.shortBio || artist.bio}</p>
          <div class="artist-socials">
            <a href="#" class="artist-social">IG</a>
            <a href="#" class="artist-social">TW</a>
            <a href="#" class="artist-social">SC</a>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Render events
   */
  renderEvents() {
    const container = document.querySelector('.events-grid');
    if (!container || !window.goatData?.events) return;
    
    container.innerHTML = window.goatData.events.map(event => `
      <div class="event-row">
        <div class="event-date">
          <div class="event-day">${event.day}</div>
          <div class="event-month">${event.month}</div>
        </div>
        <div class="event-info">
          <div class="event-title">${event.title}</div>
          <div class="event-venue">${event.venue} — ${event.location}</div>
          <div class="event-tags">
            ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="event-action">
          <a href="#bookings" class="btn btn-${event.status === 'sold-out' ? 'white' : 'red'}" style="padding:10px 24px"><span>${event.buttonText}</span></a>
        </div>
      </div>
    `).join('');
  },
  
  /**
   * Render merchandise
   */
  renderMerchandise() {
    const container = document.querySelector('.merch-grid');
    if (!container || !window.goatData?.merchandise) return;
    
    container.innerHTML = window.goatData.merchandise.map(item => `
      <div class="merch-card fade-in">
        ${item.new ? '<div class="merch-new">New</div>' : ''}
        <div class="merch-img">
          <div class="merch-img-inner" style="background:${item.gradient || 'linear-gradient(135deg,#1a1a1a,#2a2a2a)'};flex-direction:column;gap:8px;">
            <div style="font-family:var(--font-display);font-size:${item.symbol.length > 3 ? 2 : 4}rem;color:rgba(255,0,0,0.6);">${item.symbol}</div>
            <div style="font-family:var(--font-cond);font-size:0.65rem;letter-spacing:0.3em;color:rgba(255,255,255,0.2);">${item.type}</div>
          </div>
        </div>
        <div class="merch-body">
          <div class="merch-name">${item.name}</div>
          <div class="merch-desc">${item.description}</div>
          <div class="merch-footer">
            <div class="merch-price">R${item.price}<span> ${item.currency}</span></div>
            <button class="merch-buy">Buy Now</button>
          </div>
        </div>
      </div>
    `).join('');
  },
  
  /**
   * Render featured artist section
   */
  renderFeaturedArtist() {
    const container = document.getElementById('featured-artist');
    const artist = window.goatData.getFeaturedArtist();
    
    if (!container || !artist) return;
    
    const featured = document.querySelector('.featured-monogram img');
    const bgImg = document.querySelector('.featured-monogram-img');
    const featuredBg = document.querySelector('.featured-bg');
    
    if (featured) featured.src = artist.image;
    if (bgImg) bgImg.style.backgroundImage = `url('${artist.image}')`;
    if (featuredBg) featuredBg.style.backgroundImage = `url('${artist.image}')`;
    
    // Update text content
    const nameEl = container.querySelector('.featured-name');
    const bioEl = container.querySelector('.featured-bio');
    const genresEl = container.querySelector('.featured-genre-bar');
    
    if (nameEl) nameEl.innerHTML = artist.name.split(' ')[0] + '<span class="highlight">' + artist.name.split(' ')[1] + '</span>';
    if (bioEl) bioEl.textContent = artist.bio;
    if (genresEl) {
      const genres = artist.genres.slice(0, 2);
      const location = artist.location.split(',')[0];
      genresEl.innerHTML = genres.map(g => `<span class="featured-genre-pill">${g}</span><div class="featured-genre-dot"></div>`).join('') + 
        `<span class="featured-genre-pill">${location}</span>`;
    }
  },
  
  /**
   * Generate random gradient for artist card
   */
  generateGradient(id) {
    const gradients = [
      'linear-gradient(135deg,#1a0000,#330000)',
      'linear-gradient(135deg,#000011,#000033)',
      'linear-gradient(135deg,#001100,#002200)',
      'linear-gradient(135deg,#110011,#220022)',
      'linear-gradient(135deg,#111100,#222200)',
      'linear-gradient(135deg,#0d0000,#1a0a00)',
      'linear-gradient(135deg,#000,#111)',
    ];
    return gradients[id.charCodeAt(0) % gradients.length];
  },
  
  /**
   * Initialize all renderers
   */
  init() {
    this.renderArtists();
    this.renderEvents();
    this.renderMerchandise();
    this.renderFeaturedArtist();
  }
};

// ─── AUTO-RENDER ON DATA LOAD ───
window.addEventListener('goatDataLoaded', () => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    if (window.renderer) window.renderer.init();
  }, 100);
});

// ─── RE-RENDER ON DATA UPDATE ───
window.addEventListener('goatDataUpdated', (e) => {
  const type = e.detail.type;
  switch(type) {
    case 'artists':
      window.renderer.renderArtists();
      window.renderer.renderFeaturedArtist();
      break;
    case 'events':
      window.renderer.renderEvents();
      break;
    case 'merchandise':
      window.renderer.renderMerchandise();
      break;
    case 'featuredArtist':
      window.renderer.renderFeaturedArtist();
      break;
  }
});
