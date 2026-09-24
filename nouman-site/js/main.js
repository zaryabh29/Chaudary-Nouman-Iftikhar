/* Ch. Nouman Iftikhar — site behaviour
   Vanilla JS, no dependencies. Every effect degrades gracefully. */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsIO = 'IntersectionObserver' in window;
  const nav = document.getElementById('nav');
  const NAV_H = () => nav.getBoundingClientRect().height || 72;

  /* --- Page load: one orchestrated hero entrance ------------------------ */
  const markLoaded = () => document.body.classList.add('is-loaded');
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(markLoaded);
    setTimeout(markLoaded, 1200); // never wait on a slow font
  } else {
    markLoaded();
  }

  /* --- Nav: shrink after 80px; invert over light sections --------------- */
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 80);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const lightSections = document.querySelectorAll('[data-theme="light"]');
  let lightObserver = null;
  const watchLightSections = () => {
    if (!supportsIO) return;
    if (lightObserver) lightObserver.disconnect();
    // Intersect only with the band the nav occupies at the top of the viewport.
    const band = Math.max(1, window.innerHeight - NAV_H() - 1);
    lightObserver = new IntersectionObserver((entries) => {
      const anyLight = [...lightSections].some((s) => s.dataset.underNav === '1');
      entries.forEach((e) => { e.target.dataset.underNav = e.isIntersecting ? '1' : '0'; });
      const nowLight = [...lightSections].some((s) => s.dataset.underNav === '1');
      if (nowLight !== anyLight || entries.length) nav.classList.toggle('is-light', nowLight);
    }, { rootMargin: `0px 0px -${band}px 0px`, threshold: 0 });
    lightSections.forEach((s) => lightObserver.observe(s));
  };
  watchLightSections();
  window.addEventListener('resize', debounce(watchLightSections, 200));

  /* --- Mobile menu -------------------------------------------------------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(() => menu.classList.add('is-open'));
        menu.querySelector('a').focus();
      } else {
        menu.classList.remove('is-open');
        const done = () => { menu.hidden = true; menu.removeEventListener('transitionend', done); };
        reduceMotion ? done() : menu.addEventListener('transitionend', done);
        toggle.focus();
      }
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
    });
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 960 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
    }, 200));
  }

  /* --- Reveal on scroll (once) ------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!supportsIO || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach((el) => ro.observe(el));
  }

  /* --- Count-up numerals --------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const formatNum = (n, el) => {
    const decimals = Number(el.dataset.decimals || 0);
    const sep = el.dataset.separator;
    const fixed = n.toFixed(decimals);
    if (sep === '') return fixed;
    return Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || !Number.isFinite(target)) { el.textContent = formatNum(target, el) + suffix; return; }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = formatNum(target * eased, el) + suffix;
      if (t < 1) requestAnimationFrame(step); else el.textContent = formatNum(target, el) + suffix;
    };
    requestAnimationFrame(step);
  };
  if (supportsIO && !reduceMotion) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => co.observe(el));
  }

  /* --- Background videos: play only while on screen, never on reduced motion */
  const autoVideos = document.querySelectorAll('video[data-autoplay]');
  if (reduceMotion) {
    autoVideos.forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
  } else if (supportsIO) {
    const vo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          const p = v.play(); if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    autoVideos.forEach((v) => vo.observe(v));
  } else {
    autoVideos.forEach((v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
  }

  /* --- Brand film player ---------------------------------------------------- */
  document.querySelectorAll('[data-player]').forEach((player) => {
    const btn = player.querySelector('.player__play');
    const video = player.querySelector('video');
    if (!btn || !video) return;
    btn.addEventListener('click', () => {
      player.classList.add('is-playing');
      video.hidden = false;
      video.focus();
      const p = video.play(); if (p && p.catch) p.catch(() => {});
    });
  });

  /* --- Contact form (Formspree-style JSON POST, graceful fallback) ------- */
  const form = document.querySelector('.form');
  if (form) {
    const status = form.querySelector('.form__status');
    const button = form.querySelector('button[type="submit"]');
    const say = (msg, kind) => {
      status.textContent = msg;
      status.classList.toggle('is-error', kind === 'error');
      status.classList.toggle('is-success', kind === 'success');
    };
    form.addEventListener('submit', async (e) => {
      const endpoint = form.getAttribute('action') || '';
      if (endpoint.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        say('The form is not connected yet — add your Formspree ID in index.html.', 'error');
        return;
      }
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      if (!window.fetch) return; // plain HTML submit
      e.preventDefault();
      button.disabled = true;
      say('Sending…');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          form.reset();
          say('Sent. The office will reply within two working days.', 'success');
        } else {
          say('Could not send. Email ceo@mgcdevelopments.com instead.', 'error');
        }
      } catch (err) {
        say('Could not send. Check your connection or email ceo@mgcdevelopments.com.', 'error');
      } finally {
        button.disabled = false;
      }
    });
  }

  /* --- Asset fallback: a local file that is missing (assets not yet fetched)
         is replaced by the original online copy, so the page never shows a gap. */
  document.querySelectorAll('img[data-remote]').forEach((img) => {
    const swap = () => {
      if (img.dataset.swapped) return;
      img.dataset.swapped = '1';
      img.src = img.dataset.remote;
    };
    img.addEventListener('error', swap, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('loading') !== 'lazy') swap();
  });
  document.querySelectorAll('a[data-remote]').forEach((a) => {
    if (!window.fetch) return;
    fetch(a.getAttribute('href'), { method: 'HEAD' })
      .then((r) => { if (!r.ok) a.href = a.dataset.remote; })
      .catch(() => { a.href = a.dataset.remote; });
  });

  /* --- Timeline Nav --------------------------------------------------------- */
  const timeline = document.querySelector('.timeline');
  const tlPrev = document.querySelector('.legacy__btn--prev');
  const tlNext = document.querySelector('.legacy__btn--next');
  if (timeline && tlPrev && tlNext) {
    tlPrev.addEventListener('click', () => {
      // scroll left by one item width roughly (320px + gap)
      timeline.scrollBy({ left: -344, behavior: 'smooth' });
    });
    tlNext.addEventListener('click', () => {
      timeline.scrollBy({ left: 344, behavior: 'smooth' });
    });
  }

  /* --- Footer year ---------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* --- Lightbox ------------------------------------------------------------- */
  const initLightbox = () => {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Close" type="button">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button class="lightbox__nav lightbox__prev" aria-label="Previous" type="button">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button class="lightbox__nav lightbox__next" aria-label="Next" type="button">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <img class="lightbox__img" src="" alt="Enlarged view">
        <div class="lightbox__caption"></div>
      </div>
    `;
    document.body.appendChild(lb);
    
    const imgEl = lb.querySelector('.lightbox__img');
    const capEl = lb.querySelector('.lightbox__caption');
    
    let items = [];
    let currentIndex = -1;

    const showImage = (index) => {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;
      const item = items[currentIndex];
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery__overlay span, .pg-caption');
      if (!img) return;
      imgEl.src = img.src;
      capEl.textContent = cap ? cap.textContent : '';
    };

    const closeLightbox = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { imgEl.src = ''; }, 300);
    };

    lb.addEventListener('click', (e) => {
      if (e.target.closest('.lightbox__close') || e.target.classList.contains('lightbox__backdrop')) {
        closeLightbox();
      } else if (e.target.closest('.lightbox__prev')) {
        showImage(currentIndex - 1);
      } else if (e.target.closest('.lightbox__next')) {
        showImage(currentIndex + 1);
      } else if (e.target.closest('.lightbox__img')) {
        // Clicking the image itself goes to next
        showImage(currentIndex + 1);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

    document.addEventListener('click', (e) => {
      const clickedItem = e.target.closest('.gallery__item, .pg-item');
      if (!clickedItem) return;
      
      items = Array.from(document.querySelectorAll('.gallery__item, .pg-item'));
      currentIndex = items.indexOf(clickedItem);
      
      if (currentIndex > -1) {
        showImage(currentIndex);
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  };
  
  initLightbox();

  /* --- Utilities ------------------------------------------------------------- */
  function debounce(fn, wait) {
    let t; return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), wait); };
  }
})();
