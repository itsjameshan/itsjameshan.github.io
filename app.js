'use strict';

// All content is local and drawn from the two tailored résumés. No API keys or tracking.
window.jhReady = true;
document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const roles = {
  modeling: {
    kicker: 'Agronomic systems modeling',
    heading: ['Understand the mechanisms.', 'Test the assumptions.', 'Make the model useful.'],
    description: 'A Ph.D. in crop modeling and industry experience translating crop physiology, phenology and soil-water processes into commercial decision tools.',
    resume: 'James_Han_Agronomic_Systems_Modeling_Resume',
    heroLabel: 'Download modeling résumé',
    evidence: [
      ['Process-based crop models', 'SALUS sensitivity analysis at CIBO; 30 commercial crop models at Lindsay; CornSoyWater doctoral research.', 'See the modeling work', '#project-cibo'],
      ['Calibration, evaluation & experiments', 'R cross-validation, comparisons of simulated and measured residue-related outputs, and R&D trials collecting soil moisture, phenology and yield.', 'See the field evidence', '#project-fieldnet'],
      ['From analysis to shared tools', 'Python, R, Scala and SQL workflows; GitHub pull requests, Confluence documentation and written model reports.', 'See a decision-support system', '#project-cornsoywater']
    ],
    tools: ['SALUS', 'Process-based simulation', 'Corn & soybean phenology', 'Soil-water balance', 'Nutrient & residue processes', 'Calibration & validation', 'Python', 'R', 'Scala', 'SQL', 'Spark', 'AWS EC2', 'Azure', 'QGIS', 'Satellite imagery']
  },
  analytics: {
    kicker: 'Agronomy & geospatial analytics',
    heading: ['Connect the data.', 'Find the agronomic signal.', 'Make the results clear.'],
    description: 'Agronomic context, statistical analysis and spatial visualization — from field, trial, weather and soil data to clear findings for product, agronomy and business teams.',
    resume: 'James_Han_Agronomy_Analytics_Resume',
    heroLabel: 'Download analytics résumé',
    evidence: [
      ['Field & geospatial data', 'Farm-management records, field boundaries, satellite imagery and NDVI, weather and soil inputs; QGIS, Tableau and Spotfire.', 'See the agricultural analytics', '#project-phenology'],
      ['Statistical analysis with agronomic context', 'Mixed models, variance components, G×E analysis in multi-location trials, R cross-validation and crop-stage prediction.', 'See the prediction work', '#project-phenology'],
      ['Analysis that travels beyond the team', 'Quality-checked Python, R, SQL and Spark workflows; written reports and weekly slide briefings to leadership.', 'See the data workflows', '#project-cibo']
    ],
    tools: ['Field & hybrid trials', 'Farm-management data', 'Phenology', 'QA/QC', 'Mixed models', 'Variance components', 'QGIS', 'Tableau', 'Spotfire', 'Satellite imagery & NDVI', 'Python', 'R', 'SQL', 'Spark', 'AWS EC2', 'Azure']
  }
};

const lensPrompts = {
  modeling: ['Hiring for agronomy or geospatial analytics?', 'analytics', 'Switch to the analytics lens'],
  analytics: ['Hiring for crop or systems modeling?', 'modeling', 'Switch to the modeling lens']
};

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

/* Role lenses: tabs, tailored résumés and the hero shortcut */
const roleTabs = [...document.querySelectorAll('[role="tab"][data-role]')];
const rolePanel = document.getElementById('role-panel');

function makeEvidenceItem([title, description, label, href], index) {
  const item = document.createElement('li');
  const number = document.createElement('span');
  number.className = 'fit-num';
  number.textContent = String(index + 1).padStart(2, '0');
  const copy = document.createElement('div');
  const titleElement = document.createElement('h4');
  titleElement.textContent = title;
  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = description;
  const link = document.createElement('a');
  link.href = href;
  link.textContent = `${label} →`;
  copy.append(titleElement, descriptionElement, link);
  item.append(number, copy);
  return item;
}

function selectRole(key, updateUrl = true) {
  const role = roles[key];
  if (!role) return;
  const changed = rolePanel.getAttribute('aria-labelledby') !== `tab-${key}`;
  roleTabs.forEach(tab => {
    const active = tab.dataset.role === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  rolePanel.setAttribute('aria-labelledby', `tab-${key}`);
  document.getElementById('role-kicker').textContent = role.kicker;
  const heading = document.getElementById('role-heading');
  heading.replaceChildren();
  role.heading.forEach((line, index) => {
    if (index) heading.append(document.createElement('br'));
    if (index === role.heading.length - 1) {
      const emphasis = document.createElement('em');
      emphasis.textContent = line;
      heading.append(emphasis);
    } else {
      heading.append(document.createTextNode(line));
    }
  });
  document.getElementById('role-description').textContent = role.description;
  document.getElementById('resume-download').href = `downloads/${role.resume}.pdf`;
  document.getElementById('resume-docx').href = `downloads/${role.resume}.docx`;
  document.getElementById('fit-evidence').replaceChildren(...role.evidence.map(makeEvidenceItem));
  document.getElementById('role-tools').replaceChildren(...role.tools.map(tool => {
    const chip = document.createElement('li');
    chip.textContent = tool;
    return chip;
  }));

  // The hero résumé button and lens shortcut follow the active lens.
  document.querySelectorAll('[data-resume="pdf"]').forEach(link => { link.href = `downloads/${role.resume}.pdf`; });
  document.querySelectorAll('[data-resume-label]').forEach(label => { label.textContent = role.heroLabel; });
  const [prompt, otherKey, otherLabel] = lensPrompts[key];
  document.querySelectorAll('[data-lens-switch]').forEach(line => {
    line.querySelector('[data-lens-prompt]').textContent = prompt;
    const link = line.querySelector('[data-lens-link]');
    link.dataset.lensLink = otherKey;
    link.href = `?role=${otherKey}#fit`;
    link.firstChild.textContent = `${otherLabel} `;
  });

  if (changed && !reducedMotion.matches) {
    rolePanel.classList.remove('is-switching');
    void rolePanel.offsetWidth;
    rolePanel.classList.add('is-switching');
  }
  if (!updateUrl) return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('role', key);
    history.replaceState(null, '', url);
  } catch { /* The page remains usable when opened directly as a local file. */ }
}

roleTabs.forEach(tab => {
  tab.addEventListener('click', () => selectRole(tab.dataset.role));
  tab.addEventListener('keydown', event => {
    const index = roleTabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % roleTabs.length;
    if (event.key === 'ArrowLeft') next = (index + roleTabs.length - 1) % roleTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = roleTabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectRole(roleTabs[next].dataset.role);
      roleTabs[next].focus();
    }
  });
});

// Lens shortcuts switch in place and add a history entry, so Back returns to the previous lens.
document.addEventListener('click', event => {
  const link = event.target.closest('[data-lens-link]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const key = link.dataset.lensLink;
  if (!Object.hasOwn(roles, key)) return;
  event.preventDefault();
  selectRole(key, false);
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('role', key);
    url.hash = 'fit';
    history.pushState(null, '', url);
  } catch { /* Local files cannot always rewrite history. */ }
  document.getElementById('fit').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  document.getElementById(`tab-${key}`).focus({ preventScroll: true });
});

const requestedRole = new URLSearchParams(window.location.search).get('role');
if (requestedRole && Object.hasOwn(roles, requestedRole)) selectRole(requestedRole, false);
window.addEventListener('popstate', () => {
  const key = new URLSearchParams(window.location.search).get('role');
  selectRole(key && Object.hasOwn(roles, key) ? key : 'modeling', false);
  revealLinkedProject(window.location.hash);
});

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
    7: 'Before: ±7 days — the stage could land anywhere in a window of about two weeks.',
    3: 'After: ±3 days — the window narrows to about one week.'
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
  const copyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activateChapter(entry.target.closest('[data-chapter]'));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  const figureObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      methodSeen = true;
      entry.target.closest('[data-chapter]').dataset.seen = 'true';
    });
    syncDrawn();
  }, { threshold: .3 });
  chapters.forEach(chapter => {
    copyObserver.observe(chapter.querySelector('.chapter-copy'));
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
