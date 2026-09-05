/* Framd.
 * ─────────────────────────────────────────────────────────────
 * TO ADD OR EDIT WORK: change the WORKS array below. Nothing else.
 *
 *   type   'short' (9:16 grid) or 'long' (16:9 rows)
 *   file   full URL (Google Drive direct link) or filename inside /videos
 *   poster filename inside /posters (auto-generated .jpg)
 *   title  shown under the video
 *   tags   small grey line under the title
 *   dur    display only — write it however you like
 * ───────────────────────────────────────────────────────────── */

const WORKS = [
  {
    type: 'short',
    file: 'https://drive.google.com/uc?export=view&id=1aFeiIaYq44FWjukxygd4UWhoTO_Bm8EC',
    poster: 'kolton.jpg',
    title: 'Feature 01',
    tags: 'Short Form · Client Work',
    dur: '0:45'
  },
  {
    type: 'short',
    file: 'https://drive.google.com/uc?export=view&id=1nOON6J_RPlMZPF3SQV65HCTTKFogfH0H',
    poster: 'football-history.jpg',
    title: 'Feature 02',
    tags: 'Short Form · Sport',
    dur: '0:36'
  },
  {
    type: 'short',
    file: 'https://drive.google.com/uc?export=view&id=108Xciz6iugItLaSCuVHETDfwWS_i3G1g',
    poster: 'eric-1.jpg',
    title: 'Feature 03',
    tags: 'Short Form · Heritage',
    dur: '0:37'
  },
  {
    type: 'short',
    file: 'https://drive.google.com/uc?export=view&id=18ZM7w0EGoRs3hUNBmjpC1210x6EdC4up',
    poster: 'eric-3.jpg',
    title: 'Feature 04',
    tags: 'Short Form · Heritage',
    dur: '1:28'
  },
  {
    type: 'short',
    file: 'https://drive.google.com/uc?export=view&id=1EUqmwdLgbx36B41YVbZph53KjeQNNXey',
    poster: 'portfolio-cut.jpg',
    title: 'Feature 05',
    tags: 'Short Form',
    dur: '0:36'
  },

  {
    type: 'long',
    file: 'https://drive.google.com/uc?export=view&id=1LsNxHX0ynjhs56lIdBQYmrvSpMjirAjN',
    poster: 'feature-01.jpg',
    title: 'Feature — 01',
    tags: 'Long Form',
    dur: '8:35'
  }
];

/* ── helpers ───────────────────────────────────────────────── */

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Respect the visitor's data saver: previews stay as still posters.
const savingData = !!(navigator.connection && navigator.connection.saveData);
const allowPreviews = !prefersReducedMotion && !savingData;

/* ── render ────────────────────────────────────────────────── */

const shorts = WORKS.filter((w) => w.type === 'short');
const longs  = WORKS.filter((w) => w.type === 'long');

// Helper: returns the src value — full URL or local path
const videoSrc = (file) => file.startsWith('http') ? file : `videos/${esc(file)}`;

$('#shortGrid').innerHTML = shorts.map((w, i) => `
  <button class="tile reveal" type="button" data-index="${WORKS.indexOf(w)}"
          aria-label="Play ${esc(w.title)}">
    <div class="shell">
      <div class="core">
        <img src="posters/${esc(w.poster)}" alt="" loading="lazy" decoding="async">
        <video muted loop playsinline preload="none"
               data-src="${videoSrc(w.file)}" aria-hidden="true"></video>
        ${w.dur ? `<span class="tile__badge">${esc(w.dur)}</span>` : ''}
      </div>
    </div>
    <div class="tile__body">
      <h3 class="tile__title">${esc(w.title)}</h3>
      <p class="tile__tags">${esc(w.tags || '')}</p>
    </div>
  </button>
`).join('');

const longRows = $('#longRows');
if (longs.length) {
  longRows.innerHTML = longs.map((w) => `
    <button class="row reveal" type="button" data-index="${WORKS.indexOf(w)}"
            aria-label="Play ${esc(w.title)}">
      <div class="shell">
        <div class="core">
          <img src="posters/${esc(w.poster)}" alt="" loading="lazy" decoding="async">
          <span class="row__play">
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
          </span>
        </div>
      </div>
      <div class="row__body">
        <div>
          <h3 class="row__title">${esc(w.title)}</h3>
          <p class="row__tags">${esc(w.tags || '')}</p>
        </div>
        ${w.dur ? `<span class="row__dur">${esc(w.dur)}</span>` : ''}
      </div>
    </button>
  `).join('');
} else {
  $('#longEmpty').hidden = false;
}

/* ── silent looping previews, only while on screen ─────────── */

if (allowPreviews && 'IntersectionObserver' in window) {
  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const tile = entry.target;
      const video = tile.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        // Attach the source the first time the tile is actually seen,
        // so nothing downloads for work the visitor scrolls past.
        if (!video.src) video.src = video.dataset.src;
        video.play()
          .then(() => tile.classList.add('is-previewing'))
          .catch(() => { /* autoplay blocked — poster stays, no harm */ });
      } else {
        video.pause();
        tile.classList.remove('is-previewing');
      }
    });
  }, { threshold: 0.55 });

  document.querySelectorAll('.tile').forEach((t) => previewObserver.observe(t));
}

/* ── lightbox ──────────────────────────────────────────────── */

const lightbox = $('#lightbox');
const stage = $('#lightboxStage');
let lastFocused = null;

function openLightbox(index) {
  const work = WORKS[index];
  if (!work) return;

  lastFocused = document.activeElement;

  const video = document.createElement('video');
  video.src = videoSrc(work.file);
  video.poster = `posters/${work.poster}`;
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'auto';

  stage.replaceChildren(video);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#lightboxClose').focus();
}

function closeLightbox() {
  const video = stage.querySelector('video');
  if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
  stage.replaceChildren();
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-index]');
  if (trigger) { openLightbox(Number(trigger.dataset.index)); return; }
  if (e.target === lightbox || e.target.closest('#lightboxClose')) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

/* ── scroll reveal ─────────────────────────────────────────── */

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Failsafe: the work must never be invisible. If the observer hasn't run
  // by now (backgrounded tab on load, odd browser), just show everything.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.5) {
        el.classList.add('is-in');
      }
    });
  }, 1500);
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
}

/* ── nav: mark the section you're looking at ────────────────── */

const navLinks = [...document.querySelectorAll('[data-nav]')];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        a.setAttribute('aria-current',
          a.getAttribute('href') === `#${entry.target.id}` ? 'true' : 'false');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => navObserver.observe(s));
}

/* ── pricing tabs ──────────────────────────────────────────── */

const switchBtns = [...document.querySelectorAll('.switch__btn')];

switchBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    switchBtns.forEach((other) => {
      const on = other === btn;
      other.classList.toggle('is-on', on);
      other.setAttribute('aria-selected', String(on));
      const panel = document.getElementById(other.dataset.panel);
      if (panel) panel.hidden = !on;
    });
  });
});

// Footer year is set directly in index.html.
