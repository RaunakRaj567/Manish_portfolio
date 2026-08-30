/* ============================================================
   MANISH KUMAR SAINI PORTFOLIO — script.js
   ============================================================ */

/* ──────────────────────────────────────────────
   1. PARTICLE CANVAS BACKGROUND
   ────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 45 : 80;
  const MAX_DIST = window.innerWidth < 768 ? 100 : 140;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const op = (1 - dist / MAX_DIST) * 0.3;
          ctx.strokeStyle = `rgba(0, 212, 255, ${op})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
      p.update();
    });

    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();


/* ──────────────────────────────────────────────
   2. STICKY NAVBAR — scroll shadow + active link + mobile menu
   ────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  });

  // Hamburger toggle
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const isOpen = navLinksContainer.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
      }
    });
  }

  // Close menu on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer) navLinksContainer.classList.remove('open');
      if (hamburger) hamburger.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  function highlightActiveLink() {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active');
    });
  }

  // Initial call
  highlightActiveLink();
})();


/* ──────────────────────────────────────────────
   3. INTERSECTION OBSERVER — Reveal Animations
   ────────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   4. SKILL BARS — animate on scroll
   ────────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  let animated = false;

  function animateBars() {
    fills.forEach(fill => {
      const target = fill.getAttribute('data-width') || '0';
      fill.style.width = target + '%';
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        setTimeout(animateBars, 200);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
})();


/* ──────────────────────────────────────────────
   5. TYPED TEXT EFFECT — Hero role cycling
   ────────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = [
    'Full Stack Web Developer',
    'React.js & Node.js Developer',
    'Emergency SOS & Safety Tech Dev',
    'Geospatial Portal Developer',
    'Python & C Programmer',
    'B.Tech CSE Student @ LPU'
  ];

  let roleIndex = 0, charIndex = 0, deleting = false;
  const TYPE_SPEED = 80, DELETE_SPEED = 45, PAUSE = 2200;

  function type() {
    const current = roles[roleIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Add blinking cursor via CSS
  el.style.borderRight = '2px solid var(--color-accent-cyan)';
  el.style.paddingRight = '3px';
  el.style.animation = 'blink-cursor 0.8s step-end infinite';

  const style = document.createElement('style');
  style.textContent = `@keyframes blink-cursor { 50% { border-color: transparent; } }`;
  document.head.appendChild(style);

  setTimeout(type, 800);
})();


/* ──────────────────────────────────────────────
   6. CONTACT FORM — client-side handler
   ────────────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const statusEl = document.getElementById('form-status');
  const btn = document.getElementById('form-submit');

  btn.disabled = true;
  btn.style.opacity = '0.7';
  statusEl.textContent = '⏳ Sending your message...';

  setTimeout(() => {
    statusEl.textContent = '✅ Thank you! Manish will get back to you soon.';
    btn.disabled = false;
    btn.style.opacity = '1';
    e.target.reset();

    setTimeout(() => { statusEl.textContent = ''; }, 5000);
  }, 1600);
}


/* ──────────────────────────────────────────────
   7. SMOOTH SCROLL for all internal links
   ────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ──────────────────────────────────────────────
   8. MOUSE PARALLAX — Subtle hero orb movement
   ────────────────────────────────────────────── */
(function initParallax() {
  const orb = document.querySelector('.hero-orb');
  if (!orb || window.innerWidth < 768) return;

  document.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    orb.style.transform = `translateY(${yRatio * -10}px) translateX(${xRatio * -8}px)`;
  });
})();


/* ──────────────────────────────────────────────
   9. PROJECT CARDS — ripple effect on click
   ────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 212, 255, 0.15);
      width: 10px; height: 10px;
      transform: scale(0);
      animation: ripple-anim 0.6s linear;
      left: ${e.offsetX - 5}px;
      top: ${e.offsetY - 5}px;
      pointer-events: none; z-index: 10;
    `;
    this.appendChild(ripple);
    const anim = document.createElement('style');
    anim.textContent = `@keyframes ripple-anim { to { transform: scale(60); opacity: 0; } }`;
    document.head.appendChild(anim);
    setTimeout(() => ripple.remove(), 700);
  });
});


/* ──────────────────────────────────────────────
   10. COUNTERS — Animate stat numbers
   ────────────────────────────────────────────── */
(function initCounters() {
  const counters = [
    { id: 'stat-projects', end: 4, suffix: '+' },
  ];
  counters.forEach(({ id, end, suffix }) => {
    const el = document.getElementById(id);
    if (!el) return;
    let count = 0;
    const step = Math.ceil(end / 30);
    const timer = setInterval(() => {
      count = Math.min(count + step, end);
      el.textContent = count + (suffix || '');
      if (count >= end) clearInterval(timer);
    }, 60);
  });
})();


/* ──────────────────────────────────────────────
   11. REALISTIC 3D TILT EFFECT — project, experience & ach cards
   ────────────────────────────────────────────── */
(function initTilt() {
  if (window.innerWidth < 768) return; // Disable tilt on touch devices for smoother scrolling
  const tiltElements = document.querySelectorAll('.project-card, .ach-card, .cert-card, .experience-card');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s ease-out';
    });
    
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease-out';
    });
  });
})();
