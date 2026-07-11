// Projects: overlapping README cards on the button.
// Hovering a card loads that repo's code into the viewer on the right.
const OWNER = 'Phonokles';

const cardsEl = document.getElementById('project-cards');
const listEl  = document.getElementById('proj-file-list');
const codeEl  = document.getElementById('proj-code-body');

const BINARY = /\.(png|jpe?g|gif|ico|glb|gltf|woff2?|ttf|otf|mp3|mp4|zip|webp)$/i;
const OFFSET = 70;            // vertical offset between stacked cards
const treeCache = {};         // repo name -> file list (so we fetch each tree only once)

// 1) load repos, build a card per repo that has a README
async function init() {
  if (!cardsEl) return;
  try {
    const res = await fetch(`https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    const repos = await res.json();

    let i = 0;
    cardsEl.innerHTML = '';
    for (const repo of repos) {
      const readme = await fetchReadme(repo);
      if (readme !== null) { buildCard(repo, readme, i); i++; }
    }
    if (!i) cardsEl.textContent = 'No projects with a README found.';
  } catch (e) {
    cardsEl.textContent = 'Error: ' + e.message;
  }
}

async function fetchReadme(repo) {
  for (const name of ['README.md', 'readme.md']) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${OWNER}/${repo.name}/${repo.default_branch}/${name}`);
      if (r.ok) return await r.text();
    } catch (e) {  }
  }
  return null;
}


function buildCard(repo, readmeText, index) {
  const card = document.createElement('div');
  card.className = 'proj-card';
  card.style.top = (index * OFFSET) + 'px';
  card.style.zIndex = index + 1;

  const html = window.marked ? marked.parse(readmeText) : escapeHtml(readmeText);
  card.innerHTML = `
    <div class="proj-card-title">${escapeHtml(repo.name)}</div>
    <div class="proj-card-readme">${html}</div>`;

  card.addEventListener('mouseenter', () => selectRepo(repo));
  cardsEl.appendChild(card);
}

// 3) hovering a card -> load its file list into the right-hand viewer
async function selectRepo(repo) {
  if (!listEl) return;
  listEl.textContent = 'loading files \u2026';
  codeEl.textContent = '';
  codeEl.className = '';
  try {
    let files = treeCache[repo.name];
    if (!files) {
      const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`);
      if (!res.ok) throw new Error('API ' + res.status);
      const data = await res.json();
      files = data.tree.filter((n) => n.type === 'blob').sort((a, b) => a.path.localeCompare(b.path));
      treeCache[repo.name] = files;
    }
    renderFiles(repo, files);
  } catch (e) {
    listEl.textContent = 'Error: ' + e.message;
  }
}

function renderFiles(repo, files) {
  listEl.innerHTML = '';
  files.forEach((file) => {
    const btn = document.createElement('button');
    btn.className = 'file-item';
    btn.textContent = file.path;
    btn.addEventListener('click', () => openFile(repo, file.path, btn));
    listEl.appendChild(btn);
  });
}

// 4) show a file's content in the right-hand viewer
async function openFile(repo, path, btn) {
  listEl.querySelectorAll('.file-item.active').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  codeEl.className = '';
  codeEl.removeAttribute('data-highlighted');

  if (BINARY.test(path)) { codeEl.textContent = '(binary file)'; return; }

  codeEl.textContent = 'loading \u2026';
  try {
    const enc = path.split('/').map(encodeURIComponent).join('/');
    const r = await fetch(`https://raw.githubusercontent.com/${OWNER}/${repo.name}/${repo.default_branch}/${enc}`);
    codeEl.textContent = await r.text();
    if (window.hljs) hljs.highlightElement(codeEl);
  } catch (e) {
    codeEl.textContent = 'Error: ' + e.message;
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

init();