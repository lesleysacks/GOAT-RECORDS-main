/**
 * navigation.js
 *
 * Sticky bar, current-section marker, and the mobile menu dialog.
 */

const nav = document.getElementById('nav');
const ham = document.getElementById('hamburger');
const menu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

function setMenuOpen(open) {
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open ? 'true' : 'false');
  ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

ham.addEventListener('click', () => {
  if (menu.open) {
    menu.close();
    return;
  }
  setMenuOpen(true);
  menu.showModal();
});

menu.addEventListener('close', () => setMenuOpen(false));

menu.addEventListener('click', (event) => {
  if (event.target === menu) menu.close();
});

document.getElementById('menu-close').addEventListener('click', () => menu.close());

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => menu.close());
});

const navLinks = [...document.querySelectorAll('.nav-links a, #mobile-menu a')];
const sections = [...new Set(navLinks.map((link) => document.querySelector(link.getAttribute('href'))))]
  .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach((section) => spy.observe(section));
