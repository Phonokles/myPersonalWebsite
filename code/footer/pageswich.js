const DOT_COUNT = 5;

const bar = document.createElement('div');
bar.className = 'pageswitch';

const dots = [];
for (let i = 0; i < DOT_COUNT; i++) {
  const dot = document.createElement('span');
  dot.className = 'pageswitch-dot';
  dot.addEventListener('click', () => setActive(i));
  bar.appendChild(dot);
  dots.push(dot);
}

function setActive(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);   // nur einer kriegt 'active'
  });
}

document.body.appendChild(bar);
setActive(0);   