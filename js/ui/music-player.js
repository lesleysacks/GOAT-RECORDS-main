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

let audioCtx = null, oscillators = [], gainNode = null, musicOn = false, fadeOutTimeout = null;
const musicBtn = document.getElementById('music-toggle');

/**
 * Starts ambient sound playback
 * Creates oscillators with filter chain
 */
function startAmbient() {
  // Clean up any previous fade-out timeout
  if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
  
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Clean up old oscillators if they exist
  stopAmbient(true);
  
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
 * @param {boolean} immediate - If true, stop immediately without fade
 */
function stopAmbient(immediate = false) {
  if (!gainNode || !audioCtx) return;
  
  if (immediate) {
    // Hard stop for cleanup
    oscillators.forEach(o => {
      try { o.stop(); } catch(e){}
    });
    oscillators = [];
    gainNode = null;
  } else {
    // Smooth fade out
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    
    // Clean up timeout from previous call if any
    if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
    
    fadeOutTimeout = setTimeout(() => {
      oscillators.forEach(o => {
        try { o.stop(); } catch(e){}
      });
      oscillators = [];
      gainNode = null;
      fadeOutTimeout = null;
    }, 1500);
  }
}

// ─── MUSIC TOGGLE ───
musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  musicBtn.classList.toggle('paused', !musicOn);
  if (musicOn) startAmbient();
  else stopAmbient();
});

// ─── CLEANUP ON PAGE UNLOAD ───
window.addEventListener('beforeunload', () => {
  stopAmbient(true);
  if (audioCtx) {
    try { audioCtx.close(); } catch(e){}
    audioCtx = null;
  }
});
