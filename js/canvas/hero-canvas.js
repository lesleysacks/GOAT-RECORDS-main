/**
 * hero-canvas.js
 * 
 * @description Canvas animation system for hero section
 * Renders light beams, particle effects, and gradient backgrounds
 * Uses requestAnimationFrame for smooth 60fps performance
 * 
 * @requires None (vanilla JS)
 * @exports None (IIFE pattern)
 * 
 * @features
 * - Dynamic light beam generation and animation
 * - Particle system for crowd sparks
 * - Responsive canvas resizing
 * - Color variations (red/white beams)
 * - Pulsing alpha opacity effects
 * 
 * @performance
 * - Beams count scales with viewport width (6-60 beams)
 * - 80 particles for visual depth
 * - Uses requestAnimationFrame for optimal performance
 * - Minimal DOM manipulation
 */

(function() {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, beams = [], particles = [], frame = 0;

  /**
   * Resizes canvas to match window dimensions
   */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /**
   * Initializes light beams with random properties
   * Beam count scales with viewport width
   */
  function initBeams() {
    beams = [];
    const count = Math.max(6, Math.floor(W / 160));
    for (let i = 0; i < count; i++) {
      beams.push({
        x:     Math.random() * W,
        angle: (Math.random() - 0.5) * 0.7,
        width: Math.random() * 60 + 20,
        speed: (Math.random() - 0.5) * 0.4,
        color: Math.random() < 0.35 ? 'red' : 'white',
        alpha: Math.random() * 0.08 + 0.02,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Initializes particle system for crowd sparks
   * Creates 80 particles with random starting positions
   */
  function initParticles() {
    particles = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.6 + 0.1,
        color: Math.random() < 0.3 ? '#ff0000' : '#ffffff',
      });
    }
  }

  /**
   * Main animation loop
   * Renders background, beams, particles, and horizon line
   */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createRadialGradient(W/2, H*0.6, 0, W/2, H/2, Math.max(W,H)*0.8);
    bg.addColorStop(0, 'rgba(30,0,0,1)');
    bg.addColorStop(0.4, 'rgba(10,0,0,1)');
    bg.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Ground glow
    const glow = ctx.createLinearGradient(0, H*0.65, 0, H);
    glow.addColorStop(0, 'rgba(255,0,0,0.06)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, H*0.65, W, H*0.35);

    // Light beams
    beams.forEach(b => {
      b.x  += b.speed;
      b.pulse += 0.018;
      if (b.x > W + 200) b.x = -200;
      if (b.x < -200)    b.x =  W + 200;

      const alpha = b.alpha * (0.7 + 0.3 * Math.sin(b.pulse));
      const originY = H * 0.72;

      ctx.save();
      ctx.translate(b.x, originY);
      ctx.rotate(b.angle);

      const grad = ctx.createLinearGradient(0, 0, 0, -H * 1.2);
      if (b.color === 'red') {
        grad.addColorStop(0, `rgba(255,0,0,${alpha * 2})`);
        grad.addColorStop(0.5, `rgba(255,0,0,${alpha})`);
        grad.addColorStop(1, 'rgba(255,0,0,0)');
      } else {
        grad.addColorStop(0, `rgba(255,220,160,${alpha * 1.5})`);
        grad.addColorStop(0.4, `rgba(255,240,200,${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
      }

      ctx.beginPath();
      ctx.moveTo(-b.width / 2, 0);
      ctx.lineTo(b.width / 2, 0);
      ctx.lineTo(b.width * 1.8, -H * 1.2);
      ctx.lineTo(-b.width * 1.8, -H * 1.2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    // Particles (crowd sparks)
    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      if (p.y < -10) {
        p.y = H + 5;
        p.x = Math.random() * W;
        p.alpha = Math.random() * 0.6 + 0.1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.color === '#ff0000') {
        ctx.fillStyle = `rgba(255,0,0,${p.alpha})`;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      }
      ctx.fill();
    });

    // Horizon line
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.lineTo(W, H * 0.72);
    ctx.strokeStyle = 'rgba(255,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  initBeams();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initBeams(); initParticles(); });
})();
