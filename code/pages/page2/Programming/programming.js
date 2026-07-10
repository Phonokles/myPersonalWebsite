
const REPO   = 'Phonokles/myPersonalWebsite';
const BRANCH = 'main';

const listEl   = document.getElementById('file-list');
const headerEl = document.getElementById('code-header');
const codeEl   = document.getElementById('code-body');

const BINARY = /\.(png|jpe?g|gif|ico|glb|gltf|woff2?|ttf|otf|mp3|mp4|zip)$/i;

async function loadTree() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`);
    if (!res.ok) throw new Error('GitHub-API ' + res.status);
    const data = await res.json();

    const files = data.tree
      .filter((node) => node.type === 'blob')
      .sort((a, b) => a.path.localeCompare(b.path));

    renderList(files);
  } catch (e) {
    listEl.textContent = 'error while loading ' + e.message;
  }
}

function renderList(files) {
  listEl.innerHTML = '';
  files.forEach((file) => {
    const btn = document.createElement('button');
    btn.className = 'file-item';
    btn.textContent = file.path;
    btn.addEventListener('click', () => openFile(file.path, btn));
    listEl.appendChild(btn);
  });
}

async function openFile(path, btn) {
  document.querySelectorAll('.file-item.active').forEach((b) => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  headerEl.textContent = path;
  codeEl.removeAttribute('data-highlighted');
  codeEl.className = '';

  if (BINARY.test(path)) {
    codeEl.textContent = '(binary data can not be shown as a text)';
    return;
  }

  codeEl.textContent = 'loading';
  try {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encoded}`);
    const text = await res.text();
    codeEl.textContent = text;
    if (window.hljs) hljs.highlightElement(codeEl);
  } catch (e) {
    codeEl.textContent = 'Fehler: ' + e.message;
  }
}

loadTree();