/**
 * gallery.js
 * 
 * @description Gallery item generation and management
 * Creates gallery grid from data array
 * 
 * @requires lightbox.js - For openLightbox() function
 * @exports None (IIFE pattern)
 * 
 * @features
 * - Dynamic gallery item creation
 * - Click handlers for lightbox opening
 * - Placeholder styling and labels
 * 
 * @data
 * - Gallery items with labels, heights, and background gradients
 */

// ─── GALLERY DATA ───
const galleryData = [
  { label: 'STAGE',    h: 280, bg: 'linear-gradient(135deg,#1a0000,#330000,#000)' },
  { label: 'STUDIO',   h: 200, bg: 'linear-gradient(135deg,#000,#0d0d0d,#1a1a1a)' },
  { label: 'CROWD',    h: 340, bg: 'linear-gradient(135deg,#0d0000,#200000)' },
  { label: 'LIGHTS',   h: 220, bg: 'linear-gradient(135deg,#110000,#1a0000,#0d0d00)' },
  { label: 'ARTIST',   h: 360, bg: 'linear-gradient(135deg,#000,#0a0a1a,#000)' },
  { label: 'BACKSTAGE',h: 200, bg: 'linear-gradient(135deg,#0a0a0a,#1a0a00)' },
  { label: 'FESTIVAL', h: 300, bg: 'linear-gradient(135deg,#0d0000,#1a0000,#000)' },
  { label: 'STUDIO',   h: 240, bg: 'linear-gradient(135deg,#000,#111,#0a000a)' },
  { label: 'MERCH',    h: 260, bg: 'linear-gradient(135deg,#0d0d0d,#1a0000)' },
];

// ─── GALLERY GENERATION ───
const grid = document.getElementById('gallery-grid');
galleryData.forEach((item, i) => {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.innerHTML = `
    <div class="gallery-item-inner">
      <div class="gallery-placeholder" style="height:${item.h}px;background:${item.bg};font-size:${Math.min(item.h/3,80)}px;">
        ${item.label}
      </div>
    </div>
    <div class="gallery-item-overlay">⊕</div>
  `;
  div.addEventListener('click', () => openLightbox(item, i));
  grid.appendChild(div);
});
