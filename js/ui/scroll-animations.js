/**
 * scroll-animations.js
 * 
 * @description Scroll-triggered fade-in animations
 * Uses Intersection Observer API for performance
 * 
 * @requires None (vanilla JS)
 * @exports None (IIFE pattern)
 * 
 * @features
 * - Fade-in animation on scroll
 * - Staggered animation delay (60ms between elements)
 * - Efficient Intersection Observer implementation
 * - Low threshold (0.08) for early trigger
 * 
 * @performance
 * - Single observer instance for all elements
 * - No layout thrashing
 * - Smooth CSS transitions (0.8s)
 */

// ─── SCROLL ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.08 });

function watchFadeIns() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.fade-in:not(.visible)').forEach((el) => {
    if (reduce) {
      el.classList.add('visible');
      return;
    }
    observer.observe(el);
  });
}

watchFadeIns();

const fadeWatch = new MutationObserver(() => watchFadeIns());
fadeWatch.observe(document.body, { childList: true, subtree: true });
