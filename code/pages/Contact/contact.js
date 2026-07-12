const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'sending \u2026';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form),
    });
    const json = await res.json();

    if (json.success) {
      statusEl.textContent = 'thanks! your message was sent.';
      form.reset();
    } else {
      statusEl.textContent = 'hmm, that did not work: ' + (json.message || 'unknown error');
    }
  } catch (err) {
    statusEl.textContent = 'error: ' + err.message;
  }
});

document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (['arrowright', 'arrowdown', 'd', 's'].includes(k)) {
    window.parent.postMessage({ type: 'nav', dir: 'next' }, '*');
  } else if (['arrowleft', 'arrowup', 'a', 'w'].includes(k)) {
    window.parent.postMessage({ type: 'nav', dir: 'prev' }, '*');
  }
});