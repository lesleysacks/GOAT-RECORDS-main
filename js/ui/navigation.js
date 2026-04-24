/**
 * navigation.js
 * 
 * @description Navigation interactivity and hamburger menu functionality
 * Handles sticky navigation bar on scroll, mobile menu toggle
 * 
 * @requires None (vanilla JS)
 * @exports closeMobile() - Function to close mobile menu
 * 
 * @features
 * - Sticky nav with blur effect on scroll (triggers at 60px)
 * - Hamburger menu animation on mobile
 * - Mobile menu open/close with smooth transitions
 * - Link handling for navigation
 * 
 * @events
 * - scroll: Triggers nav.scrolled class
 * - click: Hamburger menu toggle
 */

// ─── STICKY NAVIGATION ─── 
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── HAMBURGER MENU ───
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});

/**
 * Closes the mobile menu
 * Called when user clicks navigation link
 */
function closeMobile() {
  ham.classList.remove('open');
  mob.classList.remove('open');
}
