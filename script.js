/* ==========================================================
   Portfolio — minimal interactions
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initActiveLinks();
  initScrollReveal();
  initTyping();
  initCounters();
  initWorkScroll();
  initBackToTop();
  initYear();
});

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 300);
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ---------- Active nav links ---------- */
function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  const set = () => {
    const pos = window.scrollY + 120;
    let current = '';
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = '#' + sec.id;
      }
    });
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === current));
  };
  window.addEventListener('scroll', set, { passive: true });
  set();
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  items.forEach((el) => observer.observe(el));
}

/* ---------- Typing ---------- */
function initTyping() {
  const target = document.getElementById('typed');
  if (!target) return;

const words = [
  'Full-Stack Developer',
  'React Developer',
  'Django Developer',
  'Node.js Developer',
  'Python Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'API Developer',
  'Software Engineer',
];
  let wi = 0, ci = 0, deleting = false;

  const tick = () => {
    const current = words[wi];
    target.textContent = current.slice(0, ci);
    if (!deleting && ci < current.length) { ci++; setTimeout(tick, 80); }
    else if (deleting && ci > 0) { ci--; setTimeout(tick, 40); }
    else {
      if (!deleting) { deleting = true; setTimeout(tick, 1500); }
      else { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 300); }
    }
  };
  tick();
}

/* ---------- Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animate = (el) => {
    const target = +el.dataset.target;
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); }
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => observer.observe(c));
}

/* ---------- Work — vertical scroll → horizontal track (desktop) ----------
   On touch / small screens this is disabled and the work section falls
   back to native horizontal scroll (handled by CSS in @media (max-width:768px)).
*/
function initWorkScroll() {
  const pin = document.getElementById('workPin');
  const track = document.getElementById('workTrack');
  if (!pin || !track) return;

  // Skip on touch / small screens
  const isMobile = () => matchMedia('(hover: none)').matches || matchMedia('(max-width: 768px)').matches;

  const syncMode = () => {
    document.body.classList.toggle('work-mobile-mode', isMobile());
  };

  syncMode();
  if (isMobile()) return;

  const section = pin.parentElement;
  if (!section) return;

  const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const getScrollDelay = () => window.innerHeight;

  const setHeight = () => {
    section.style.height = `${window.innerHeight + (getScrollDelay() * 1.25) + getTravel()}px`;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sectionTop = section.offsetTop;
      const maxTranslate = getTravel();
      const scrollStart = sectionTop + getScrollDelay();
      const scrollEnd = scrollStart + maxTranslate;
      const range = Math.max(1, scrollEnd - scrollStart);
      const progress = Math.max(0, Math.min(1, (window.scrollY - scrollStart) / range));
      track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;

      ticking = false;
    });
  };

  setHeight();
  window.addEventListener('resize', () => {
    syncMode();
    if (isMobile()) return;
    setHeight();
    onScroll();
  });
  window.addEventListener('load', () => {
    syncMode();
    if (isMobile()) return;
    setHeight();
    onScroll();
  });
  if (document.readyState === 'complete') { setHeight(); onScroll(); }

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      syncMode();
      if (isMobile()) return;
      setHeight();
      onScroll();
    });
    ro.observe(track);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Year ---------- */
function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
