const PAGE_COUNT = 5;
const LAST = PAGE_COUNT - 1;
let active = 0;
let closeTimer = null;

let locked = true;
setTimeout(() => { locked = false; }, 2000);

const slider    = document.querySelector('.slider');
const keepEls   = document.querySelectorAll('.keep-open');
const meBtn     = document.querySelector('.me-btn');
const pageViews = document.querySelectorAll('.page-view');

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
  if (locked) return;
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
    if (onPanel && !locked) {
      if (active === 0) goTo(1);   // from the start page, hovering advances to page 1
      else show(active);
    }
  } else if (!closeTimer) {
    closeTimer = setTimeout(() => {
      bar.classList.remove('visible');
      meBtn.classList.remove('big');
      closeTimer = null;
    }, 250);
  }
});

document.addEventListener('keydown', (e) => {
  if (locked) return;
  const k = e.key.toLowerCase();
  if (k === 'arrowright' || k === 'arrowdown' || k === 'd' || k === 's') {
    goTo(active + 1);
    e.preventDefault();
  } else if (k === 'arrowleft' || k === 'arrowup' || k === 'a' || k === 'w') {
    goTo(active - 1);
    e.preventDefault();
  }
});
window.addEventListener('message', (e) => {
  if (!e.data || e.data.type !== 'nav') return;
  if (e.data.dir === 'next') goTo(active + 1);
  if (e.data.dir === 'prev') goTo(active - 1);
});
let wheelLock = false;
document.addEventListener('wheel', (e) => {
  if (e.target.closest && e.target.closest('.code-browser')) return;  // scroll the code viewer freely
  if (locked) return;
  if (wheelLock) return;
  wheelLock = true;
  setTimeout(() => { wheelLock = false; }, 250);
  if (e.deltaY > 0) goTo(active + 1);
  else              goTo(active - 1);
}, { passive: true });

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

show(0);