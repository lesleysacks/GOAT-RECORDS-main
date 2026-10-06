/** Which row each editor modal is updating. -1 means a new record. */
export const editor = {
  artist: -1,
  event: -1,
  merch: -1,
  gallery: -1
};

export function notifyChanged(detail = {}) {
  document.dispatchEvent(new CustomEvent('admin:changed', { detail }));
}
