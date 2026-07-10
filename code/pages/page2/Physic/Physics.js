
const canvas = document.getElementById('tesseract');
const ctx = canvas.getContext('2d');

const vertices = [];
for (let i = 0; i < 16; i++) {
  vertices.push([
    (i & 1) ? 1 : -1,
    (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1,
    (i & 8) ? 1 : -1,
  ]);
}

const edges = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    const diff = i ^ j;                 
    if ((diff & (diff - 1)) === 0) {    
      edges.push([i, j]);
    }
  }
}

const angles = { xy: 0, xz: 0, xw: 0.6, yz: 0.5, yw: 0, zw: 0 };

function rotatePlane(a, b, t) {
  const cos = Math.cos(t), sin = Math.sin(t);
  return [a * cos - b * sin, a * sin + b * cos];
}

function rotate(p) {
  let [x, y, z, w] = p;
  [x, y] = rotatePlane(x, y, angles.xy);
  [x, z] = rotatePlane(x, z, angles.xz);
  [x, w] = rotatePlane(x, w, angles.xw);
  [y, z] = rotatePlane(y, z, angles.yz);
  [y, w] = rotatePlane(y, w, angles.yw);
  [z, w] = rotatePlane(z, w, angles.zw);
  return [x, y, z, w];
}


function project(p) {
  const [x, y, z, w] = p;

  const dist4 = 2.5;
  const k4 = 1 / (dist4 - w);
  const x3 = x * k4, y3 = y * k4, z3 = z * k4;

  const dist3 = 4;
  const k3 = 1 / (dist3 - z3);
  return [x3 * k3, y3 * k3];
}

let cw = 0, ch = 0;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cw = canvas.clientWidth;
  ch = canvas.clientHeight;
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

function draw() {
  if (active) angles[active.plane] += active.dir * SPEED;

  ctx.clearRect(0, 0, cw, ch);

  const scale = Math.min(cw, ch) * 0.32;
  const cx = cw / 2, cy = ch / 2;

  const pts = vertices.map((v) => {
    const [px, py] = project(rotate(v));
    return [cx + px * scale, cy + py * scale];
  });

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#ffffff';
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(pts[a][0], pts[a][1]);
    ctx.lineTo(pts[b][0], pts[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = '#ffffff';
  pts.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

const SPEED = 0.03;
let active = null;

document.querySelectorAll('.ctrl-btn').forEach((btn) => {
  const plane = btn.dataset.plane;
  const dir = Number(btn.dataset.dir);
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    active = { plane, dir };
  });
});
window.addEventListener('pointerup', () => { active = null; });
window.addEventListener('pointercancel', () => { active = null; });

draw();