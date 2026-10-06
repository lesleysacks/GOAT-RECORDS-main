/**
 * Optional ambient drone. The AudioContext is created on the first click
 * and closed when the page unloads.
 */

let audioCtx = null;
let oscillators = [];
let gainNode = null;
let musicOn = false;
let fadeOutTimeout = null;

function startAmbient() {
  if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audioCtx) audioCtx = new AudioContext();
  stopAmbient(true);

  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2);
  gainNode.connect(audioCtx.destination);

  oscillators = [55, 82.5, 110, 165].map((frequency) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = frequency;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.25;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200 + Math.random() * 100;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(gainNode);
    osc.start();
    return osc;
  });
}

function stopAmbient(immediate = false) {
  if (!gainNode || !audioCtx) return;

  if (immediate) {
    oscillators.forEach((osc) => { try { osc.stop(); } catch (error) { /* already stopped */ } });
    oscillators = [];
    gainNode = null;
    return;
  }

  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
  if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
  fadeOutTimeout = setTimeout(() => {
    oscillators.forEach((osc) => { try { osc.stop(); } catch (error) { /* already stopped */ } });
    oscillators = [];
    gainNode = null;
    fadeOutTimeout = null;
  }, 1500);
}

export function initMusicPlayer() {
  const button = document.getElementById('music-toggle');
  if (!button) return;

  button.addEventListener('click', () => {
    musicOn = !musicOn;
    button.classList.toggle('paused', !musicOn);
    button.setAttribute('aria-pressed', musicOn ? 'true' : 'false');
    if (musicOn) startAmbient();
    else stopAmbient();
  });

  window.addEventListener('beforeunload', () => {
    stopAmbient(true);
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
  });
}
