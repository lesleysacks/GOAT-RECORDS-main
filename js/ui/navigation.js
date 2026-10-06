/**
 * Sticky navigation and the mobile menu.
 * Link clicks are delegated so links can be re-rendered from config.
 */

export function initNavigation() {
  const nav = document.getElementById('nav');
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (!ham || !menu) return;

  const setOpen = (open) => {
    ham.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) menu.removeAttribute('inert');
    else menu.setAttribute('inert', '');
    if (open) {
      const first = menu.querySelector('a');
      if (first) first.focus();
    }
  };

  ham.addEventListener('click', () => setOpen(!menu.classList.contains('open')));

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false);
      ham.focus();
    }
  });
}
