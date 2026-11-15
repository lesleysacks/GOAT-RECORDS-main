/**
 * booking-form.js
 *
 * Drafts a booking enquiry in the visitor's email app.
 * The site does not store or deliver the form itself.
 */

function handleBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const lines = [
    `Name: ${data.get('name') || ''}`,
    `Email: ${data.get('email') || ''}`,
    `Phone: ${data.get('phone') || ''}`,
    `Event type: ${data.get('type') || ''}`,
    `Date: ${data.get('date') || ''}`,
    `Budget: ${data.get('budget') || ''}`,
    `Venue: ${data.get('venue') || ''}`,
    '',
    String(data.get('message') || ''),
    '',
    'Sent from the GOAT RECORDS website. This enquiry is delivered only if you send the email that opens.'
  ];
  const status = document.getElementById('booking-status');
  status.textContent = 'Your email app should open with this enquiry addressed to bookings@goatrecords.co.za. Nothing is delivered until you send that email. If no app opens, write to that address directly.';
  window.location.href = `mailto:bookings@goatrecords.co.za?subject=${encodeURIComponent('Booking enquiry — GOAT RECORDS')}&body=${encodeURIComponent(lines.join('\n'))}`;
}
