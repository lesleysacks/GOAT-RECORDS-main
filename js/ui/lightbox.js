/**
 * lightbox.js
 * 
 * @description Gallery lightbox image viewer functionality
 * Handles opening, closing, and keyboard navigation
 * 
 * @requires None (vanilla JS)
 * @exports openLightbox(), closeLightbox() - Control functions
 * 
 * @features
 * - Click to view full-size images
 * - Close on X button, background click, or Escape key
 * - Gallery item counter display
 * - Responsive scaling
 * 
 * @events
 * - click: Gallery items and close button
 * - click: Lightbox background
 * - keydown: Escape key support
 */

/**
 * Opens lightbox with image and metadata
 * @param {Object} item - Gallery item data (label, bg)
 * @param {number} i - Index for counter display
 */
function openLightbox(item, i) {
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lb-content');
  content.innerHTML = `
    <div class="lb-placeholder" style="background:${item.bg};">
      <div class="lb-placeholder-title">${item.label}</div>
      <div class="lb-placeholder-sub">GOAT RECORDS — ${i + 1} / ${galleryData.length}</div>
    </div>
  `;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes lightbox and restores body scroll
 */
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── CLOSE BUTTON ───
document.getElementById('lb-close').addEventListener('click', closeLightbox);

// ─── BACKGROUND CLICK ───
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// ─── ESCAPE KEY ───
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
