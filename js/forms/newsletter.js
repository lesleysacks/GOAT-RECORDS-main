/**
 * Newsletter field. The address is checked locally and then cleared.
 * It is not stored or sent anywhere.
 */

export function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  const input = form.querySelector('.nl-input');
  const button = form.querySelector('.nl-btn');
  if (!input || !button) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value.includes('@') || !value.includes('.')) {
      input.focus();
      return;
    }
    const success = button.dataset.success || '✓ Subscribed!';
    const label = button.dataset.label || 'Subscribe';
    button.textContent = success;
    input.value = '';
    window.setTimeout(() => { button.textContent = label; }, 3000);
  });
}
