/**
 * main.js
 * 
 * @description Application entry point and module loader
 * Initializes all modules in proper dependency order
 * 
 * @requires All module files (see script tags in HTML)
 * @exports None (Global initialization)
 * 
 * @modules
 * - hero-canvas.js: Hero section canvas animation
 * - navigation.js: Navigation and hamburger menu
 * - scroll-animations.js: Fade-in animations on scroll
 * - gallery.js: Gallery item generation
 * - lightbox.js: Lightbox image viewer
 * - booking-form.js: Booking form handler
 * - newsletter.js: Newsletter subscription
 * - music-player.js: Ambient sound toggle
 * 
 * @notes
 * All scripts are loaded with defer attribute in HTML
 * They execute in the order they are included after DOM is ready
 */

// This file serves as documentation and module coordination
// All initialization happens in individual module files
// Loaded after DOM is ready via defer attribute in <script> tags

console.log('GOAT RECORDS — Built for Greatness. Powered by Sound.');
