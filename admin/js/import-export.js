/**
 * Backup stays in the browser until someone downloads it and replaces the
 * JSON files in /data. This page cannot write to the server or to GitHub.
 */

import { store } from '../../js/data/store.js';
import { showMessage } from './ui.js';
import { notifyChanged } from './state.js';

function exportArea() {
  return document.getElementById('jsonExport');
}

export function refreshExport() {
  const area = exportArea();
  if (area) area.value = store.exportJSON();
}

export function downloadExport() {
  const json = store.exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'goat-records-data.json';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMessage('Download started. Replace the files in /data to publish it.', 'success');
}

export function pickImport() {
  const input = document.getElementById('importFile');
  if (input) input.click();
}

export function importFile(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || ''));
      store.importPayload(payload);
      notifyChanged({ label: true, imported: true });
      showMessage('Backup loaded into this session. Download it again to keep a copy.', 'success');
    } catch (error) {
      showMessage(`Could not import that file: ${error.message}`, 'error');
    }
  };
  reader.addEventListener('error', () => showMessage('Could not read that file', 'error'));
  reader.readAsText(file);
}

export async function copyExport() {
  const area = exportArea();
  if (!area) return;
  const text = area.value;
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else throw new Error('clipboard unavailable');
  } catch (error) {
    area.focus();
    area.select();
    const copied = document.execCommand('copy');
    if (!copied) {
      showMessage('Copy failed. Select the JSON and copy it manually.', 'error');
      return;
    }
  }
  showMessage('JSON copied to the clipboard', 'success');
}
