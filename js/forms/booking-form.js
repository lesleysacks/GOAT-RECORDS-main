/**
 * booking-form.js
 * 
 * @description Booking form submission handler
 * Provides feedback on form submission with visual confirmation
 * 
 * @requires None (vanilla JS)
 * @exports handleBooking() - Form submission handler
 * 
 * @features
 * - Prevents default form submission
 * - Visual feedback with button text change
 * - Auto-reset after 4 seconds
 * - Accessible form experience
 * 
 * @events
 * - submit: Form submission handler
 */

/**
 * Handles booking form submission
 * Shows confirmation message and resets after delay
 * @param {Event} e - Form submit event
 */
function handleBooking(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = "✓ Request Sent — We'll Be In Touch!";
  btn.style.background = '#111';
  btn.style.cursor = 'default';
  setTimeout(() => {
    btn.textContent = 'Book GOAT Records →';
    btn.style.background = '';
    btn.style.cursor = '';
    e.target.reset();
  }, 4000);
}
