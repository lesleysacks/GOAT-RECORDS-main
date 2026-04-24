/**
 * music-player.js
 * 
 * @description Ambient background sound toggle with Web Audio API
 * Creates four-frequency oscillator for ambient atmosphere
 * 
 * @requires None (Web Audio API)
 * @exports None (Global variables manageded)
 * 
 * @features
 * - Toggle button for audio on/off
 * - Four sawtooth oscillators at different frequencies
 * - Low-pass filter for smooth sound
 * - Smooth fade in/out (2s in, 1.5s out)
 * - Paused state visual indicator
 * 
 * @audio
 * - Base frequencies: 55, 82.5, 110, 165 Hz
 * - Filter: Low-pass at 200-300 Hz
 * - Volume: Starts at 0, ramps to 0.04
 * 
 * @performance
 * - Lazy-loads AudioContext on first click
 * - Efficient gain node management
 */

let audioCtx = null, oscillators = [], gainNode = null, musicOn = false;
const musicBtn = document.getElementById('music-toggle');

/**
 * Starts ambient sound playback
 * Creates oscillators with filter chain
 */
function startAmbient() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2);
  gainNode.connect(audioCtx.destination);

  const freqs = [55, 82.5, 110, 165];
  oscillators = freqs.map(f => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    const g = audioCtx.createGain();
    g.gain.value = 0.25;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200 + Math.random() * 100;
    osc.connect(filter);
    filter.connect(g);
    g.connect(gainNode);
    osc.start();
    return osc;
  });
}

/**
 * Stops ambient sound with smooth fade out
 */
function stopAmbient() {
  if (gainNode) {
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    setTimeout(() => oscillators.forEach(o => { try { o.stop(); } catch(e){} }), 2000);
  }
}

// ─── MUSIC TOGGLE ───
musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  musicBtn.classList.toggle('paused', !musicOn);
  if (musicOn) startAmbient();
  else stopAmbient();
});
