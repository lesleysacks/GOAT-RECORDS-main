/**
 * Booking form. This only confirms the request in the browser.
 * Nothing is sent to a server.
 */

export function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('.form-submit');
    if (!button) return;
    const success = button.dataset.success || "✓ Request Sent — We'll Be In Touch!";
    const label = button.dataset.label || button.textContent;
    button.textContent = success;
    button.classList.add('is-sent');
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = label;
      button.classList.remove('is-sent');
      button.disabled = false;
      form.reset();
    }, 4000);
  });
}
