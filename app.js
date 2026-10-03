'use strict';

// All content is local and drawn from the two tailored résumés. No API keys or tracking.
const roles = {
  modeling: {
    kicker: 'AGRONOMIC SYSTEMS MODELING',
    heading: ['Understand the mechanisms.', 'Test the assumptions.', 'Make the model useful.'],
    description: 'A Ph.D. in crop modeling and commercial experience translating crop physiology, phenology, and soil-water processes into decision tools.',
    resume: 'James_Han_Agronomic_Systems_Modeling_Resume',
    evidence: [
      ['Process-based crop models', 'SALUS sensitivity analysis at CIBO; 30 commercial crop models at Lindsay; CornSoyWater doctoral research.', 'See the modeling work', '#project-cibo'],
      ['Calibration, evaluation & experiments', 'R cross-validation, field-data comparisons, and R&D trials collecting soil moisture, phenology, and yield.', 'See the field evidence', '#project-fieldnet'],
      ['From analysis to shared tools', 'Python, R, Scala, SQL, and cloud workflows; code review, model documentation, and clear technical reporting.', 'See a decision-support system', '#project-cornsoywater']
    ]
  },
  analytics: {
    kicker: 'AGRONOMY & GEOSPATIAL ANALYTICS',
    heading: ['Connect the data.', 'Find the agronomic signal.', 'Make the results clear.'],
    description: 'Agronomic context, statistical analysis, and spatial visualization — from field, weather, and soil data to findings your team can act on.',
    resume: 'James_Han_Agronomy_Analytics_Resume',
    evidence: [
      ['Field & geospatial data', 'Farm-management records, field boundaries, satellite imagery, weather, and soil inputs; QGIS, Tableau, and Spotfire.', 'See the agricultural analytics', '#project-phenology'],
      ['Statistical analysis with agronomic context', 'Mixed models, variance components, G×E analysis, R cross-validation, and crop-stage prediction.', 'See the prediction work', '#project-phenology'],
      ['Analysis that travels beyond the team', 'Quality-checked Python, R, SQL, and Spark workflows; written reports and weekly slide briefings to leadership.', 'See the data workflows', '#project-cibo']
    ]
  }
};

const projects = {
  cornsoywater: ['PROCESS-BASED MODELING', 'CornSoyWater', 'Crop simulation, weather, soil, and field management come together in a web application for irrigation decisions.', 'Crop physiology · Soil-water balance · Field evaluation'],
  fieldnet: ['COMMERCIAL CROP SYSTEMS', 'FieldNET Advisor', 'Thirty crop models for a commercial irrigation platform, informed by satellite imagery and hands-on R&D field trials.', 'Phenology · Cross-validation · Commercial delivery'],
  cibo: ['MODEL BEHAVIOR & AGRICULTURAL DATA', 'SALUS & field data', 'Sensitivity analysis makes model behavior clearer. Quality-checked agricultural data supports verification and reporting workflows.', 'SALUS · Management sensitivity · Python & Scala'],
  phenology: ['AGRONOMY & GEOSPATIAL ANALYTICS', 'Phenology & analytics', 'Environmental drivers, multi-location trials, and geospatial reporting connect statistical findings with agronomic decisions.', 'G×E analysis · Mixed models · QGIS & Tableau'],
  blueberry: ['COMPUTER VISION → USABLE SOFTWARE', 'Blueberry vision', 'A crop-imagery application brings YOLO detection into a practical workflow, with batch processing, maturity counts, and CSV export.', 'YOLO · ONNX Runtime · Flask']
};

const header = document.getElementById('site-header');
const menuButton = document.querySelector('.menu-toggle');
const roleTabs = [...document.querySelectorAll('[data-role]')];

function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '−' : '＋';
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 600) setMenu(false); });
function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 70); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

function selectRole(key, updateUrl = true) {
  const role = roles[key];
  if (!role) return;
  roleTabs.forEach(tab => {
    const active = tab.dataset.role === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById('role-panel').setAttribute('aria-labelledby', `tab-${key}`);
  document.getElementById('role-kicker').textContent = role.kicker;
  const heading = document.getElementById('role-heading');
  heading.replaceChildren();
  role.heading.forEach((line, index) => {
    if (index) heading.append(document.createElement('br'));
    const item = index === 2 ? document.createElement('em') : document.createTextNode(line);
    if (index === 2) item.textContent = line;
    heading.append(item);
  });
  document.getElementById('role-description').textContent = role.description;
  document.getElementById('resume-download').href = `downloads/${role.resume}.pdf`;
  document.getElementById('resume-docx').href = `downloads/${role.resume}.docx`;
  const evidence = document.getElementById('fit-evidence');
  evidence.replaceChildren(...role.evidence.map(([title, description, label, href], index) => {
    const row = document.createElement('div');
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const copy = document.createElement('div');
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = `${label} ↗`;
    copy.append(titleElement, descriptionElement, link);
    row.append(number, copy);
    return row;
  }));
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
const requestedRole = new URLSearchParams(window.location.search).get('role');
if (requestedRole && Object.hasOwn(roles, requestedRole)) selectRole(requestedRole);
window.addEventListener('popstate', () => {
  const key = new URLSearchParams(window.location.search).get('role');
  selectRole(key && Object.hasOwn(roles, key) ? key : 'modeling', false);
});

document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  if (!project) return;
  document.querySelectorAll('[data-project]').forEach(node => {
    const active = node === button;
    node.classList.toggle('active', active);
    node.setAttribute('aria-pressed', String(active));
  });
  ['map-category', 'map-title', 'map-description', 'map-capabilities'].forEach((id, index) => {
    document.getElementById(id).textContent = project[index];
  });
  document.getElementById('map-link').href = `#project-${button.dataset.project}`;
}));

// Open collapsed case studies when their links are followed, including initial deep links.
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

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('itsjameschan@gmail.com');
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Select the email address below to copy it, or click it to open your email app.';
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('js');
}

// Decorative contour field, never presented as observations or simulation output.
const canvas = document.getElementById('field-canvas');
const context = canvas.getContext('2d');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (context) {
  let width = 0;
  let height = 0;
  let frame = 0;
  let inView = false;
  let points = [];
  function sizeCanvas() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = [];
    for (let row = 0; row < 27; row++) {
      for (let col = 0; col < 53; col++) {
        const x = (col / 52) * width;
        const y = (row / 26) * height + Math.sin(col * .115 + row * .095) * 27;
        const distance = Math.hypot((x - width * .48) / width, (y - height * .52) / height);
        points.push({ x, y, row, col, alpha: Math.max(.035, .27 - distance * .27) });
      }
    }
    draw(0);
  }
  function draw(time) {
    context.clearRect(0, 0, width, height);
    for (const point of points) {
      const wave = motionPreference.matches ? 0 : Math.sin(point.col * .14 + point.row * .1 - time * .00022) * .035;
      context.fillStyle = `rgba(183, 205, 149, ${Math.max(.025, point.alpha + wave)})`;
      context.beginPath();
      context.arc(point.x, point.y, .9, 0, Math.PI * 2);
      context.fill();
    }
  }
  function animate(time) {
    frame = 0;
    if (!inView || document.hidden || motionPreference.matches) return;
    draw(time);
    frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (inView && !document.hidden && !motionPreference.matches) frame = requestAnimationFrame(animate);
    else draw(0);
  }
  if ('ResizeObserver' in window) new ResizeObserver(sizeCanvas).observe(canvas);
  else window.addEventListener('resize', sizeCanvas);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncAnimation();
    }).observe(canvas);
  }
  motionPreference.addEventListener('change', syncAnimation);
  document.addEventListener('visibilitychange', syncAnimation);
  sizeCanvas();
}
