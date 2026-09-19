/* ============================================================
   Ch. Nouman Iftikhar — Portfolio JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Hero Entrance Animations ─── */
  // Use rAF so the browser paints the hidden state first (prevents FOUC)
  // then on next frame add the class which triggers all transitions
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const heroContent = document.querySelector('.hero-content');
      const heroStats  = document.querySelector('.hero-stats');
      if (heroContent) heroContent.classList.add('hero-animate');
      if (heroStats)   heroStats.classList.add('hero-animate');
    });
  });

  /* ─── Progress Bar ─── */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = (scrollTop / docHeight) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ─── Navbar Scroll ─── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Smooth Scroll on Nav Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 80;
        const top = target.offsetTop - navH;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile menu
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          toggleMobileMenu();
        }
      }
    });
  });

  /* ─── Mobile Menu ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  function toggleMobileMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }
  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

  /* ─── Hero BG Parallax (Disabled to fix zoom glitches) ─── */
  const heroBg = document.querySelector('.hero-bg');
  // if (heroBg) {
  //   let lastScrollY = 0;
  //   let rafPending = false;

  //   function applyParallax() {
  //     const offset = lastScrollY * 0.3;
  //     heroBg.style.transform = `scale(1.06) translateY(${offset}px)`;
  //     rafPending = false;
  //   }

  //   window.addEventListener('scroll', () => {
  //     lastScrollY = window.scrollY;
  //     if (lastScrollY < window.innerHeight && !rafPending) {
  //       rafPending = true;
  //       requestAnimationFrame(applyParallax);
  //     }
  //   }, { passive: true });

  //   applyParallax();
  // }

  /* ─── Intersection Observer (Reveal Animations) ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Counter Animation ─── */
  function animateCounter(el, target, duration = 2000) {
    let start = null;
    const suffix = el.dataset.suffix || '';
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ─── Timeline Scroll Fill ─── */
  const timelineLine = document.querySelector('.timeline-line-fill');
  const timelineContainer = document.querySelector('.timeline');
  if (timelineLine && timelineContainer) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateTimelineFill();
          window.addEventListener('scroll', updateTimelineFill, { passive: true });
        }
      });
    }, { threshold: 0 });
    timelineObserver.observe(timelineContainer);

    function updateTimelineFill() {
      const rect = timelineContainer.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalH = timelineContainer.offsetHeight;
      const scrolledIn = viewH - rect.top;
      const pct = Math.max(0, Math.min(100, (scrolledIn / (totalH + viewH)) * 160));
      timelineLine.style.height = pct + '%';
    }
  }

  /* ─── Magnetic Buttons (subtle) ─── */
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─── Back To Top ─── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── Contact Form (visual only) ─── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#2d6a4f';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ─── Section Label line animation ─── */
  const sectionLabels = document.querySelectorAll('.section-label');
  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  sectionLabels.forEach(l => {
    l.style.opacity = '0';
    l.style.transition = 'opacity 0.6s ease 0.2s';
    labelObserver.observe(l);
  });

  /* ─── Typewriter for hero subtitle ─── */
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const texts = [
      'Founder & CEO, Mian Group of Chakwal',
      'Founder & CEO, MGC Developments',
      'Pioneer of the 1% Payment Plan',
      'Presidential Award Winner'
    ];
    let tIdx = 0, cIdx = 0, deleting = false;
    function type() {
      const current = texts[tIdx];
      if (!deleting) {
        typeTarget.textContent = current.substring(0, cIdx + 1);
        cIdx++;
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
      } else {
        typeTarget.textContent = current.substring(0, cIdx - 1);
        cIdx--;
        if (cIdx === 0) {
          deleting = false;
          tIdx = (tIdx + 1) % texts.length;
        }
      }
      setTimeout(type, deleting ? 40 : 70);
    }
    setTimeout(type, 1500);
  }

  /* ─── Project card tilt effect ─── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  /* ─── Custom cursor (desktop) ─── */
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    // Use transform:translate3d — only triggers GPU composite, never layout or paint
    // NO mix-blend-mode — that forces full-page compositing on every frame (causes flicker)
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 10px; height: 10px; border-radius: 50%;
      background: rgba(201,168,76,0.9);
      pointer-events: none; z-index: 99999;
      transform: translate3d(-50%, -50%, 0);
      will-change: transform;
      transition: width 0.25s ease, height 0.25s ease, opacity 0.3s ease;
    `;

    // Ring uses CSS transition for lag — no rAF loop needed, handled off main thread
    const cursorRing = document.createElement('div');
    cursorRing.id = 'cursor-ring';
    cursorRing.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid rgba(201,168,76,0.55);
      pointer-events: none; z-index: 99998;
      transform: translate3d(-50%, -50%, 0);
      will-change: transform;
      transition: transform 0.12s ease, width 0.25s ease, height 0.25s ease, border-color 0.25s ease;
      opacity: 0.75;
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    // Single mousemove — write transform3d once, no rAF loop
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
      cursorRing.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
    }, { passive: true });

    document.querySelectorAll('a, button, .venture-card, .project-card, .award-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '18px';
        cursor.style.height = '18px';
        cursorRing.style.width = '56px';
        cursorRing.style.height = '56px';
        cursorRing.style.borderColor = 'rgba(201,168,76,0.85)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'rgba(201,168,76,0.55)';
      });
    });
  }

});

