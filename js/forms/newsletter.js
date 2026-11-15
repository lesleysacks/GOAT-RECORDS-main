/**
 * newsletter.js
 *
 * There is no connected mailing list. A valid address opens an email
 * to the published general address.
 */

document.getElementById('newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = String(new FormData(event.currentTarget).get('email') || '').trim();
  const status = document.getElementById('newsletter-status');

  if (!email.includes('@')) {
    status.textContent = 'Enter an email address.';
    return;
  }

  status.textContent = 'There is no mailing list connected on this site. Your email app will open a note to info@goatrecords.co.za. Nothing is delivered until you send it.';
  window.location.href = `mailto:info@goatrecords.co.za?subject=${encodeURIComponent('Mailing list request — GOAT RECORDS')}&body=${encodeURIComponent(`Please add this address to label news:\n${email}\n\nThis request is delivered only if you send the email.`)}`;
});
