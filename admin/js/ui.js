let messageTimer = 0;

export function showMessage(text, type = 'success') {
  const box = document.getElementById('messageBox');
  if (!box) return;
  box.textContent = text;
  box.className = `message ${type}`;
  window.clearTimeout(messageTimer);
  messageTimer = window.setTimeout(() => box.classList.add('is-hidden'), 4000);
}

export function showTab(name, button) {
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.toggle('active', tab.id === name);
  });
  document.querySelectorAll('.tab-btn').forEach((tabButton) => {
    const active = tabButton === button;
    tabButton.classList.toggle('active', active);
    tabButton.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

export function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  const field = modal.querySelector('input, select, textarea');
  if (field) field.focus();
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

export function closeOpenModals() {
  document.querySelectorAll('.modal.active').forEach((modal) => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });
}

export function initUi() {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOpenModals();
  });
}
