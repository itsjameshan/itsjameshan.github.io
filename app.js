'use strict';

// All content is local. No API keys or tracking.
// Re-enable the enhanced layout in case the head script's stall timer already fell back.
document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Header and mobile menu */
const header = document.getElementById('site-header');
const menuButton = header.querySelector('.menu-toggle');
const isMenuOpen = () => menuButton.getAttribute('aria-expanded') === 'true';

function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
}

menuButton.addEventListener('click', () => setMenu(!isMenuOpen()));
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && isMenuOpen()) {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (isMenuOpen() && !header.contains(event.target)) setMenu(false);
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Legacy role links lead to this single modeling page; retain other queries and the anchor.
try {
  const url = new URL(window.location.href);
  if (url.searchParams.has('role')) {
    url.searchParams.delete('role');
    history.replaceState(null, '', url);
  }
} catch { /* The page remains usable when opened directly as a local file. */ }
window.addEventListener('popstate', () => revealLinkedProject(window.location.hash));

/* Open collapsed case files when their links are followed, including initial deep links. */
function revealLinkedProject(hash) {
  if (!hash.startsWith('#project-')) return;
  const target = document.getElementById(hash.slice(1));
  if (target instanceof HTMLDetailsElement) target.open = true;
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#project-"]');
  if (link) revealLinkedProject(link.hash);
});
window.addEventListener('hashchange', () => revealLinkedProject(window.location.hash));
revealLinkedProject(window.location.hash);

/* Fig. 1: the prediction window narrows from ±7 to ±3 days. */
const predictionWindow = document.querySelector('[data-window]');
if (predictionWindow) {
  const buttons = [...predictionWindow.querySelectorAll('button[data-error]')];
  const readout = predictionWindow.querySelector('[data-window-readout]');
  const readouts = {
    7: 'Before: approximate crop growth-stage prediction error of ±7 days.',
    3: 'After: approximate crop growth-stage prediction error of ±3 days.'
  };
  let touched = false;
  const setError = value => {
    predictionWindow.dataset.error = value;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.error === value)));
    readout.textContent = readouts[value];
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    touched = true;
    readout.setAttribute('aria-live', 'polite');
    setError(button.dataset.error);
  }));
  // Play the improvement once when the figure comes into view; reduced motion shows the result directly.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    readout.setAttribute('aria-live', 'off');
    setError('7');
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      window.setTimeout(() => {
        if (!touched) setError('3');
        readout.setAttribute('aria-live', 'polite');
      }, 900);
    }, { threshold: .6 });
    observer.observe(predictionWindow.querySelector('.window-strip'));
  }
}

/* Method chapters: the copy at mid-screen chooses the active figure. */
const chapters = [...document.querySelectorAll('[data-chapter]')];
const wideLayout = window.matchMedia('(min-width: 960px)');
let methodSeen = false;

function syncDrawn() {
  chapters.forEach(chapter => {
    const drawn = wideLayout.matches ? methodSeen && chapter.classList.contains('is-active') : chapter.dataset.seen === 'true';
    chapter.classList.toggle('is-drawn', drawn);
  });
}

function activateChapter(active) {
  chapters.forEach(chapter => chapter.classList.toggle('is-active', chapter === active));
  syncDrawn();
}

if (chapters.length && 'IntersectionObserver' in window) {
  // Switch to the pinned layout without fading figures out, and keep a #chapter-… deep link in place.
  document.documentElement.classList.add('method-enhanced', 'method-settling');
  const linkedChapter = window.location.hash.startsWith('#chapter-') ? document.getElementById(window.location.hash.slice(1)) : null;
  if (linkedChapter) linkedChapter.scrollIntoView({ behavior: 'instant', block: 'start' });
  window.setTimeout(() => document.documentElement.classList.remove('method-settling'), 400);
  let copyObserver;
  let resizeFrame;
  function observeChapterCopy() {
    if (copyObserver) copyObserver.disconnect();
    // IntersectionObserver percentages use viewport width, even for vertical margins.
    const margin = Math.floor(window.innerHeight * .45);
    copyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activateChapter(entry.target.closest('[data-chapter]'));
      });
    }, { rootMargin: `-${margin}px 0px -${margin}px 0px` });
    chapters.forEach(chapter => copyObserver.observe(chapter.querySelector('.chapter-copy')));
  }
  observeChapterCopy();
  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(observeChapterCopy);
  });
  const figureObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      methodSeen = true;
      entry.target.closest('[data-chapter]').dataset.seen = 'true';
    });
    syncDrawn();
  }, { threshold: .3 });
  chapters.forEach(chapter => {
    figureObserver.observe(chapter.querySelector('.chapter-figure'));
  });
  wideLayout.addEventListener('change', syncDrawn);
} else {
  chapters.forEach(chapter => chapter.classList.add('is-drawn'));
}

/* Copy email */
document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('itsjameschan@gmail.com');
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Copying is unavailable here. Select the address above, or click it to open your email app.';
  }
});

/* Scroll reveal */
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add('is-visible'));
}

// Printing shows every case file and revealed section.
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details.case').forEach(details => { details.open = true; });
  revealTargets.forEach(element => element.classList.add('is-visible'));
});

// Everything above initialized without throwing; the head script's fallback can stand down.
window.jhReady = true;
