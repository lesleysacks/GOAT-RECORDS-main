/**
 * newsletter.js
 * 
 * @description Newsletter subscription form handler
 * Validates email and provides visual feedback
 * 
 * @requires None (vanilla JS)
 * @exports None (Event listener on .nl-btn)
 * 
 * @features
 * - Email validation (checks for @)
 * - Visual feedback with button text change
 * - Auto-reset after 3 seconds
 * - Clear input on successful subscription
 * 
 * @validation
 * - Checks for non-empty input
 * - Checks for @ character (basic email validation)
 */

// ─── NEWSLETTER SUBSCRIPTION ───
document.querySelector('.nl-btn').addEventListener('click', function() {
  const input = document.querySelector('.nl-input');
  if (input.value && input.value.includes('@')) {
    this.textContent = '✓ Subscribed!';
    input.value = '';
    setTimeout(() => { this.textContent = 'Subscribe'; }, 3000);
  }
});
