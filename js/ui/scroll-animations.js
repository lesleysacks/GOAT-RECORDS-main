/**
 * Reveals .fade-in elements as they enter the viewport.
 * Call observe() again after dynamic sections are rendered.
 */

let observer = null;
let reduced = false;

export function initScrollAnimations() {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll('.fade-in').forEach((node) => node.classList.add('visible'));
    return;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      window.setTimeout(() => entry.target.classList.add('visible'), index * 60);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  observe(document);
}

export function observe(root) {
  const scope = root && root.querySelectorAll ? root : document;
  const nodes = scope.querySelectorAll('.fade-in');
  nodes.forEach((node) => {
    if (reduced || !observer) {
      node.classList.add('visible');
      return;
    }
    if (node.dataset.observed === 'true') return;
    node.dataset.observed = 'true';
    observer.observe(node);
  });
}
