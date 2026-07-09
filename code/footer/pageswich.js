const PAGE_COUNT = 5;
const LAST = PAGE_COUNT - 1;
let active = 0;                    // aktuelle Seite (Start: Seite 0)
let closeTimer = null;

let locked = true;                 // am Anfang gesperrt
setTimeout(() => { locked = false; }, 2000);   // nach 8 Sek. freigeben

const slider    = document.querySelector('.slider');
const keepEls   = document.querySelectorAll('.keep-open');
const meBtn     = document.querySelector('.me-btn');
const pageViews = document.querySelectorAll('.page-view');

// Footer + Punkte (nur Seite 2–5)
const bar = document.createElement('div');
bar.className = 'pageswitch';

const dots = [];
for (let i = 1; i <= LAST; i++) {
  const dot = document.createElement('span');
  dot.className = 'pageswitch-dot';
  dot.addEventListener('click', () => goTo(i));
  bar.appendChild(dot);
  dots.push({ el: dot, page: i });
}
document.body.appendChild(bar);

// Seite anzeigen: Slider + aktiver Punkt + sichtbare page-view
function show(index) {
  slider.style.transform = `translateX(-${index * 20}%)`;
  dots.forEach(({ el, page }) => el.classList.toggle('active', page === index));
  pageViews.forEach(v => v.classList.toggle('active', Number(v.dataset.page) === index));
}

function openZone() {
  clearTimeout(closeTimer);
  closeTimer = null;
  bar.classList.add('visible');
  meBtn.classList.add('big');
}

function goTo(index) {
  if (locked) return;              // während der Sperre kein Wechsel
  active = Math.max(1, Math.min(index, LAST));
  openZone();
  show(active);
}

function over(el, e, pad = 0) {
  const r = el.getBoundingClientRect();
  return e.clientX >= r.left - pad && e.clientX <= r.right + pad &&
         e.clientY >= r.top  - pad && e.clientY <= r.bottom + pad;
}

document.addEventListener('mousemove', (e) => {
  const onPanel = over(meBtn, e);
  const onBar   = bar.classList.contains('visible') && over(bar, e, 40);
  const onKeep  = [...keepEls].some(el => over(el, e));

  if (onPanel || onBar || onKeep) {
    clearTimeout(closeTimer);
    closeTimer = null;
    bar.classList.add('visible');
    meBtn.classList.add('big');
    if (onPanel && !locked) show(active);   // erst nach der Sperre wechseln
  } else if (!closeTimer) {
    closeTimer = setTimeout(() => {
      bar.classList.remove('visible');
      meBtn.classList.remove('big');
      // kein show(0) -> bleibt auf der aktuellen Seite stehen
      closeTimer = null;
    }, 250);
  }
});

document.addEventListener('keydown', (e) => {
  if (locked) return;              // während der Sperre nichts tun
  const k = e.key.toLowerCase();
  if (k === 'arrowright' || k === 'arrowdown' || k === 'd' || k === 's') {
    goTo(active + 1);
    e.preventDefault();
  } else if (k === 'arrowleft' || k === 'arrowup' || k === 'a' || k === 'w') {
    goTo(active - 1);
    e.preventDefault();
  }
});

let wheelLock = false;
document.addEventListener('wheel', (e) => {
  if (locked) return;              // während der Sperre nichts tun
  if (wheelLock) return;
  wheelLock = true;
  setTimeout(() => { wheelLock = false; }, 250);
  if (e.deltaY > 0) goTo(active + 1);
  else              goTo(active - 1);
}, { passive: true });

// --- Seite 2: Interesse im Button anhovern -> Detail rechts zeigen ---
const interestItems = document.querySelectorAll('.interest-list li');
const detailViews   = document.querySelectorAll('.detail-view');

function showDetail(name) {
  detailViews.forEach(v => v.classList.toggle('shown', v.dataset.interest === name));
  interestItems.forEach(li => li.classList.toggle('shown', li.dataset.interest === name));
}

interestItems.forEach(li => {
  li.addEventListener('mouseenter', () => showDetail(li.dataset.interest));
});

if (interestItems.length) showDetail(interestItems[0].dataset.interest);

show(0);   // Start: Seite 0 anzeigen