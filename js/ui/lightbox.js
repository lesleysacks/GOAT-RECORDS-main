/**
 * lightbox.js
 *
 * Native dialog for gallery items. The browser handles focus and Escape.
 */

function openLightbox(item, index) {
  const dialog = document.getElementById('lightbox');
  const content = document.getElementById('lb-content');
  const total = window.galleryItems?.length || 0;
  content.replaceChildren();

  const frame = document.createElement('div');
  frame.className = 'lb-placeholder';
  if (item.image) {
    frame.classList.add('has-photo');
    const img = document.createElement('img');
    img.className = 'lightbox-img-display';
    img.src = item.image;
    img.alt = item.description || item.label || 'Gallery image';
    frame.append(img);
  } else if (item.gradient || item.bg) {
    frame.style.background = item.gradient || item.bg;
  }

  const title = document.createElement('p');
  title.className = 'lb-placeholder-title';
  title.textContent = item.label || 'Gallery';

  const meta = document.createElement('p');
  meta.className = 'lb-placeholder-sub';
  const description = item.description ? `${item.description.replace(/\.+$/, '')}. ` : '';
  meta.textContent = `${description}GOAT RECORDS — ${index + 1} / ${total}`;

  frame.append(title, meta);
  content.append(frame);

  if (!dialog.open) dialog.showModal();
}

function closeLightbox() {
  const dialog = document.getElementById('lightbox');
  if (dialog?.open) dialog.close();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);

document.getElementById('lightbox').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeLightbox();
});
